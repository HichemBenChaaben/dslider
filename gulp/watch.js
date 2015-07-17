// == Watch and execute the tasks ===//
'use strict';
var gulp = require('gulp');
var paths = gulp.paths;
gulp.task('watch', function() {
    gulp.watch(paths.sass + '/**/*.sass', ['styles']);
    gulp.watch(paths.javascript + '/*.js', ['lint']);
    // preen the deps everytime the file changes
    gulp.watch(paths.bowerMainFile, ['preen']);
});
