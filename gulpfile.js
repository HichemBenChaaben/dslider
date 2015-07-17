'use strict';
var gulp = require('gulp');
var basePath = './';
gulp.paths = {
    bowerMainFile: './bower.json',
    appServer: 'http://127.0.0.1:3000',
    javascipt: './scripts',
    sass: './sass',
    css: './css'
};
require('require-dir')('./gulp');
gulp.task('default', ['styles', 'lint', 'serve', 'watch']);
