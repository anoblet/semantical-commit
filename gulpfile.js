var gulp = require('gulp');
var prompt = require('gulp-prompt');
var git = require('gulp-git');

gulp.task('default', () => {
  const question = {
    message: 'Do you want to continue?(no)',
    default: false
  };

  return gulp.src('gulpfile.js')
      .pipe(prompt.confirm(question));
});

gulp.task('prompt', () => {
  var type;
  var message;

  gulp.src('./package.json')
  // Prompt for type
      .pipe(prompt.prompt({
        type: 'list',
        name: 'type',
        message: 'Commit type',
        choices: ['Fix', 'Feature', 'Performance'],
        pageSize: '3'
      }, (result) => {
        type = result.type;
        // Prompt for scope
        gulp.src('./package.json')
            .pipe(prompt.prompt({
              type: 'input',
              name: 'scope',
              message: 'Scope',
            }, (result) => {
              scope = result.scope;
              // Prompt for message
              gulp.src('./package.json')
                  .pipe(prompt.prompt({
                    type: 'input',
                    name: 'message',
                    message: 'Message',
                  }, (result) => {
                    message = result.message;
                    // Prompt for breaking
                    gulp.src('./package.json')
                        .pipe(prompt.prompt({
                          type: 'checkbox',
                          name: 'isBreaking',
                          message: 'Is breaking??',
                          choices: ['Yes', 'No']
                        }, function(result){
                          var isBreaking = result.isBreaking;
                          console.log(type, scope, message, isBreaking);
                          var scopeFormatted = '';
                          if(scope) scopeFormatted = '(' + scope + ')';
                          var isBreakingFormatted = ''
                          if(isBreaking == 'Yes') isBreakingFormatted = '\nBREAKING CHANGES';
                          console.log(type + scopeFormatted + ': ' + message + isBreakingFormatted);
                          return;
                          // Git add
                          gulp.src('./')
                              .pipe(git.add({args: '-A'}));
                          // Git commit
                          gulp.src('./')
                                .pipe(git.commit(type + scopeFormatted + ': ' + message));
                        }));
                  }));
            }));

      }));
});

