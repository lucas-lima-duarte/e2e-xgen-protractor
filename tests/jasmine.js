exports.config = {
   // ...
   onPrepare: function() {
      jasmine.getEnv().addReporter(
        new Jasmine2HtmlCliReporter({
          savePath: 'target/screenshots'
        })
      );
   }
}