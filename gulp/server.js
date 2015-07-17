'use strict';
var gulp = require('gulp');
var paths = gulp.paths;
var util = require('util');
var browserSync = require('browser-sync');
var middleware = require('./proxy');
var reload = browserSync.reload;
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(paths.sass + '/**/*.sass', ['styles']);
    gulp.watch([
        paths.sass + '/**/*.sass',
        '*.html',
        paths.javascript + 'scripts/*.js',
        paths.app + '/**/*.js'
    ]).on('change', reload);
});
