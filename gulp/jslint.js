// ==== JSlint - Douglas crockford is gonna be proud xD ==== //
'use strict';
var gulp = require('gulp');
var paths = gulp.paths;
var jshint = require('gulp-jshint');
var noop = function() {};

gulp.task('lint', function() {
    return gulp.src([paths.javascript + '/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
