var gulp = require('gulp'),
    preen = require('preen');
gulp.task('preen', function(cb) {
    preen.preen({}, cb);
});
