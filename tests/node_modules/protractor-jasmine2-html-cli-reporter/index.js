'use strict';

// dep modules
const ci = require('ci-info'),
    fs     = require('fs'),
    mkdirp = require('mkdirp'),
    _      = require('lodash'),
    path   = require('path'),
    async  = require('async'),
    hat    = require('hat'),
    os = require('os');

// own modules
const StreamPrinter = require('./lib/StreamPrinter');
const StyleFactory = require('./lib/StyleFactory');
const TestStats = require('./lib/TestStats');
const utils = require('./lib/utils');

const INDENT_CHAR = ' ';
const INDENT_UNIT = 3;
var UNDEFINED;
var exportObject = exports, reportDate;

class Jasmine2HTMLCLIReporter {

    constructor(options = {}) {
         this.started = false;
        this.finished = false;

        this.options = utils.getOption(options);

        this.suites = [];
        this.currentSuite = null;
        this.totalSpecsExecuted = 0;
        this.totalSpecsDefined;
        // when use use fit, jasmine never calls suiteStarted / suiteDone, so make a fake one to use
        this.fakeFocusedSuite = {
            id: 'focused',
            description: 'focused specs',
            fullName: 'focused specs'
        };

        this.__suites = {};
        this.__specs = {};

        //cli report
        this.cliOptions = utils.getCliReportOptions(options.cliReport); 
        if (ci.isCI) {
            this.cliOptions.emoji = false;
            this.cliOptions.beep = false;
        }

        const pOpts = typeof this.cliOptions.activity === 'string'
            ? { spinner: this.cliOptions.activity }
            : undefined;
        this.print = new StreamPrinter(pOpts);
        this.style = StyleFactory.create(this.cliOptions);
        this.stats = new TestStats(this.cliOptions);

        this.verbosity = this.cliOptions.verbosity;

        // Keeping track of suite (describe) nest levels.
        this._depth = -1;
        // Just keeping a flag to determine whether an extra new line is
        // needed when there is a remaining spec after a nested suite is
        // finished.
        this._isSuiteDone = false;
    }

    getSuite(suite) {
        this.__suites[suite.id] = utils.extend(suite, this.__suites[suite.id] || {});
        return this.__suites[suite.id];
    }

    getSpec(spec) {
        this.__specs[spec.id] = utils.extend(spec, this.__specs[spec.id] || {});
        return this.__specs[spec.id];
    }

    getReportFilename(specName){
        var name = '';
        if (this.options.fileNamePrefix)
            name += this.options.fileNamePrefix + this.options.fileNameSeparator;

        name += this.options.fileName;

        if (specName !== UNDEFINED)
            name += this.options.fileNameSeparator + specName;

        if (this.options.fileNameSuffix)
            name += this.options.fileNameSeparator + this.options.fileNameSuffix;

        if (this.options.fileNameDateSuffix)
            name += this.options.fileNameSeparator + this.getReportDate();

        return name;
    }

    isFailed(obj) { return obj.status === "failed"; }
    isSkipped(obj) { return obj.status === "pending"; }
    isDisabled(obj) { return obj.status === "disabled"; }

    writeScreenshot(data, filename) {
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
    };

    copyFolderRecursiveSync( source, target, copyBaseDir, callback ) {
        var files = [];
        //check if folder needs to be created or integrated
        var targetFolder = path.join( target, copyBaseDir ? path.basename( source ) : '' );

        if ( !fs.existsSync( targetFolder ) ) {
            fs.mkdirSync( targetFolder );
        }

        //copy
        if ( fs.lstatSync( source ).isDirectory() ) {
            files = fs.readdirSync( source );
            files.forEach( ( file ) => {
                var curSource = path.join( source, file );
                if ( fs.lstatSync( curSource ).isDirectory() ) {
                    this.copyFolderRecursiveSync( curSource, targetFolder, true, function(){});
                } else {
                    this.copyFileSync( curSource, targetFolder );
                }
            } );
        }
        callback();
    }

    copyFileSync( source, target ) {

        var targetFile = target;
    
        //if target is a directory a new file with the same name will be created
        if ( fs.existsSync( target ) ) {
            if ( fs.lstatSync( target ).isDirectory() ) {
                targetFile = path.join( target, path.basename( source ) );
            }
        }
    
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    rmdir(dir) {
        try {
            var list = fs.readdirSync(dir);
            for (var i = 0; i < list.length; i++) {
                var filename = path.join(dir, list[i]);
                var stat = fs.statSync(filename);
    
                if (stat.isDirectory()) {
                    // rmdir recursively
                    rmdir(filename);
                } else {
                    // rm fiilename
                    fs.unlinkSync(filename);
                }
            }
            fs.rmdirSync(dir);
        }catch (e) { utils.log("problem trying to remove a folder:" + dir); }
    }

   // console report functions
   _specFailureDetails(spec, num) {
        this.print.line(this.style.red(num + '. '));
        const title = spec.fullName.replace(spec.description, ': ' + spec.description);
        this.print.str(this.style.cyan(title));
        let i, failedExpectation, errInfo;
        for (i = 0; i < spec.failedExpectations.length; i++) {
            failedExpectation = spec.failedExpectations[i];
            if (failedExpectation.stack) {
                errInfo = utils.restack(failedExpectation, this.options.cleanStack, this.style);
            } else {
                errInfo = 'Error: ' + (failedExpectation.message || 'Unknown Error');
                errInfo = this.style.red(errInfo);
            }
            this.print.line(utils.indent(errInfo, INDENT_UNIT));
        }
        this.print.newLine();
    }

    _specPendingDetails(spec, num) {
        this.print.line(this.style.yellow(num + '. '));
        const title = spec.fullName.replace(spec.description, ': ' + spec.description);
        this.print.str(this.style.cyan(title));
        const pendingReason = spec.pendingReason
            ? this.style.yellow('Reason: ' + spec.pendingReason)
            : this.style.gray('(No pending reason)');
        this.print.line(utils.indent(pendingReason, INDENT_UNIT));
        this.print.newLine();
    }

    _suiteFailureDetails(suite) {
        suite.failedExpectations.forEach(ex => {
            this.print.line(this.style.red('>> An error was thrown in an afterAll'));
            const stack = utils.restack(ex, this.cliOptions.cleanStack, this.style);
            this.print.line(utils.indent(stack, INDENT_UNIT));
        });
        this.print.newLine(2);
    }

    _finalReport(doneSummary) {
        if (this.stats.failedSpecList.length > 0) {
            this.print.line(this.style.white(this.style.underline('Failed Specs')) + this.style.white(':'));
            this.print.newLine();
            this.stats.failedSpecList.forEach((spec, index) => {
                this._specFailureDetails(spec, index + 1);
            });
        }

        if (this.verbosity.pending && this.stats.pendingSpecList.length > 0) {
            this.print.line(this.style.white(this.style.underline('Pending Specs')) + this.style.white(':'));
            this.print.newLine();
            this.stats.pendingSpecList.forEach((spec, index) => {
                this._specPendingDetails(spec, index + 1);
            });
        }

        if (this.verbosity.summary) {
            this.print.line(this.style.white(this.style.underline('Summary') + ':'));
            this.print.newLine();

            if (doneSummary && doneSummary.overallStatus) {
                const status = doneSummary.overallStatus;
                const oStyle = this.style.fromKeyword(status);
                this.print.line(this.style.emoji[status + 'Status'] + oStyle(utils.capitalize(status)));
                if (doneSummary.incompleteReason) {
                    this.print.str(this.style.gray(' (' + doneSummary.incompleteReason + ')'));
                }
            }

            if (this.stats.specs.total > 0) {
                const executedSuites = this.stats.suites.total - this.stats.suites.disabled;
                this.print.line('Suites:  ' + this.style.white(executedSuites) + ' of ' + this.stats.suites.total);
                if (this.stats.suites.disabled) {
                    this.print.str(this.style.yellow(' (' + this.stats.suites.disabled + ' disabled)'));
                }

                this.print.line('Specs:   ' + this.style.white(this.stats.executedSpecs) + ' of ' + this.stats.specs.defined);
                const specsInfo = [];
                if (this.stats.specs.pending) {
                    specsInfo.push(this.stats.specs.pending + ' pending');
                }

                if (this.stats.specs.disabled > 0) {
                    specsInfo.push(this.stats.specs.disabled + ' disabled');
                }
                if (this.stats.specs.excluded > 0) {
                    specsInfo.push(this.stats.specs.excluded + ' excluded');
                }
                if (specsInfo.length) {
                    this.print.str(this.style.yellow(' (' + specsInfo.join(', ') + ')'));
                }

                let exInfo;
                const totalExpects = this.stats.expects.total;
                this.print.line('Expects: ' + this.style.white(totalExpects));
                if (totalExpects === 0) {
                    exInfo = this.style.yellow(' (none executed)');
                } else {
                    const fc = this.stats.expects.failed;
                    exInfo = ' (' + fc + ' ' + utils.plural('failure', fc) + ')';
                    if (fc > 0) exInfo = this.style.red(exInfo);
                }

                this.print.str(exInfo);
            }

            this.print.line(this.style.gray('Finished in ' + this.stats.elapsed + ' ' + utils.plural('second', this.stats.elapsed)));
            this.print.newLine(2);
        } else {
            this.print.newLine();
        }

        this.stats.failedSuiteList.forEach(suite => {
            this._suiteFailureDetails(suite);
        });

        if (this.cliOptions.beep && this.stats.expects.falied > 0) {
            this.print.beep();
        }
    }

    getPlatform(){
        return (os.type() == 'Darwin') ? 'Mac OS' : ((os.type() == 'Windows_NT') ? 'Windows' : os.type())  + ' ' + os.release();
    }

    jasmineStarted(summary) {
        this.totalSpecsDefined = summary && summary.totalSpecsDefined || NaN;
        exportObject.startTime = new Date();
        this.started = true;

        //Delete previous reports unless cleanDirectory is false
        if (this.options.cleanDestination)
            this.rmdir(this.options.savePath);

        // console jasmine started
        this.stats.init(summary);

        this.print.newLine();

        if (summary.totalSpecsDefined === 0) {
            this.print.newLine();
            this.print.str(this.style.emoji.noSpecs + this.style.yellow('No specs defined!'));
            return;
        }

        this.print.str('Executing ' + summary.totalSpecsDefined + ' defined specs...');

        const isRandom = summary.order && summary.order.random;
        if (this.verbosity.summary && isRandom) {
            this.print.newLine();
            this.print.str(this.style.gray('Running in random order... (seed: ' + summary.order.seed + ')'));
        }
        this.print.newLine();

        if (this.verbosity.specs) {
            this.print.line(this.style.white(this.style.underline('Test Suites & Specs')) + this.style.white(':'));
            this.print.newLine();
        }

    };

    suiteStarted(suite) {

        //console report suite started
        this._depth++;
        this.stats.addSuite(suite);

        const isFirstSuite = this.stats.suites.total === 1;
        if (!isFirstSuite && this.verbosity.specs) {
            this.print.newLine();
        }

        if (this.verbosity.specs) {
            this._depth = this._depth || 0;
            const ind = this.cliOptions.listStyle === 'indent'
                ? utils.repeat(INDENT_CHAR, this._depth * INDENT_UNIT)
                : '';
            const title = this.style.cyan(this.stats.suites.total + '. ' + suite.description);
            this.print.line(ind + title);
        }

        this._isSuiteDone = false;

        //html report
        suite = this.getSuite(suite);
        suite._startTime = new Date();
        suite._specs = [];
        suite._suites = [];
        suite._failures = 0;
        suite._skipped = 0;
        suite._disabled = 0;
        suite._parent = this.currentSuite;
        if (!this.currentSuite) {
            this.suites.push(suite);
        } else {
            this.currentSuite._suites.push(suite);
        }
        this.currentSuite = suite;
    };

    specStarted(spec) {
        //console report spec started
        this.stats.addSpec(spec);
        if (this.verbosity.specs) {
            this.print.newLine(this._isSuiteDone ? 2 : 1);
        }

        // show the activity animation and current spec to be executed, if
        // enabled.
        if (this.options.activity) {
            const ind = this.verbosity.specs && this.options.listStyle === 'indent'
                ? utils.repeat(INDENT_CHAR, (this._depth + 1) * INDENT_UNIT)
                : '';
            this.print.spin(ind + this.style.gray(spec.description));
        }

        if (!this.currentSuite) {
            // focused spec (fit) -- suiteStarted was never called
            this.suiteStarted(this.fakeFocusedSuite);
        }

        //html report spec started
        spec = this.getSpec(spec);
        spec._startTime = new Date();
        spec._suite = this.currentSuite;
        this.currentSuite._specs.push(spec);

        
    };

    specDone(spec) {

        //console report spec done
        this.stats.updateSpec(spec);
        if (this.options.activity) this.print.spinStop();

        if (this.verbosity.specs) {
            this._depth = this._depth || 0;
            let title = '';
            const ind = this.options.listStyle === 'indent'
                ? utils.repeat(INDENT_CHAR, (this._depth + 1) * INDENT_UNIT)
                : '';
            let timeStyle;

            switch (spec.status) {
                case 'pending':
                    title = this.style.yellow(this.style.symbol('warning') + ' ' + spec.description);
                    break;
                case 'disabled':
                case 'excluded':
                    // we don't print disableds and exludeds
                    if (!this.verbosity.disabled) {
                        // clear the new line printed on spec-start
                        // this.print.clearLine();
                        this.print.clearLine(2);
                        this.print.moveCursor(0, -1);
                        return;
                    }
                    title = this.style.gray(this.style.symbol('disabled') + ' ' + spec.description);
                    break;
                case 'failed': {
                    const fc = spec.failedExpectations.length;
                    const f = ' (' + fc + ' ' + utils.plural('failure', fc) + ')';
                    timeStyle = this.style.time(spec._time.num);
                    title = this.style.red(this.style.symbol('error') + ' ' + spec.description + f)
                        + timeStyle(' (' + spec._time.str + ')');
                    break;
                }
                case 'passed':
                    timeStyle = this.style.time(spec._time.num);
                    title = this.style.green(this.style.symbol('success') + ' ' + spec.description)
                        + timeStyle(' (' + spec._time.str + ')');
                    break;
                default:
                    // unknown status
                    break;
            }

            this.print.str(ind + title);
        }

        //html report spec done
        spec = this.getSpec(spec);
        spec._endTime = new Date();
        if (this.isSkipped(spec)) { spec._suite._skipped++; }
        if (this.isDisabled(spec)) { spec._suite._disabled++; }
        if (this.isFailed(spec)) { spec._suite._failures++; }
        this.totalSpecsExecuted++;

        //Take screenshots taking care of the configuration
        if ((this.options.takeScreenshots && !this.options.takeScreenshotsOnlyOnFailures) ||
            (this.options.takeScreenshots && this.options.takeScreenshotsOnlyOnFailures && this.isFailed(spec))) {
            if (!this.options.fixedScreenshotName)
                spec.screenshot = hat() + '.png';
            else
                spec.screenshot = utils.sanitizeFilename(spec.description) + '.png';

            browser.takeScreenshot().then((png) => {
                var screenshotPath = path.join(
                    this.options.savePath,
                    this.options.screenshotsFolder,
                    spec.screenshot
                );

                mkdirp(path.dirname(screenshotPath), (err) => {
                    if (err) {
                        throw new Error('Could not create directory for ' + screenshotPath);
                    }
                    this.writeScreenshot(png, screenshotPath);
                });
            });
        }
    };

    suiteDone(suite) {
        //console report suite done
        this.stats.updateSuite(suite);
        this._depth--;
        this._isSuiteDone = true;

        suite = this.getSuite(suite);
        if (suite._parent === UNDEFINED) {
            // disabled suite (xdescribe) -- suiteStarted was never called
            this.suiteStarted(suite);
        }
        suite._endTime = new Date();
        this.currentSuite = suite._parent;

    };

    jasmineDone(summary) {
        //jasmine done console report
        this.stats.done(summary);
        this.print.newLine();
        if (this.stats.specs.defined > 0) {
            if (this.verbosity.specs) this.print.newLine();
            this.print.str(this.style.gray('>> Done!'));
            this.print.newLine(2);
        }

        this._finalReport(summary);

        //html report jasmine done
        if (this.currentSuite) {
            // focused spec (fit) -- suiteDone was never called
            this.suiteDone(this.fakeFocusedSuite);
        }
        //console.log(__suites);
        //writing jsonfile
        var suitesSummary = {
            suites : this.stats.suites,
            specs : this.stats.specs,
            expects : this.stats.expects
        };

        var envDetails = {
            platform : this.getPlatform(),
            hostname : os.hostname(),
            username : os.userInfo().username
        };

        var jsonOutput = JSON.stringify(this.suites, function(key, value){
            if(key == '_parent' || key == '_suite'){ return value && value.id;}
            else {return value;}
        });

        jsonOutput = 'var result = { suites : '+jsonOutput+', summary : ' + JSON.stringify(suitesSummary) + ', environment : ' + JSON.stringify(envDetails) + '};function getOutput(){return result};';


        this.copyFolderRecursiveSync(__dirname + '/angular-html-report-template', this.options.savePath, false, () => {
            
            if (fs.existsSync(path.join(this.options.savePath, './assets'))) {
                this.writeJsonOutput(jsonOutput);
            }else{
                fs.mkdir(path.join(this.options.savePath, './assets'), (err) => {
                    if (err) throw err;
                    this.writeJsonOutput(jsonOutput);
                }) 
            }
        });
        this.finished = true;
        exportObject.endTime = new Date();
    };
    writeJsonOutput(jsonOutput){
        fs.writeFile(path.join(this.options.savePath, './assets/output.js'), jsonOutput, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
    }
}
module.exports = Jasmine2HTMLCLIReporter;