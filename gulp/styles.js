// ====== Styles : sass - autoprefixer  ====== //
'use strict';

var gulp = require('gulp');
// ~ paths to the assets - sass files
var paths = gulp.paths;

// autoprefix css based on gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer');
// compile sass to css
var sass = require('gulp-ruby-sass');
// Remove files
var clean = require('gulp-clean');

gulp.task('clean', function() {
    return gulp.src(paths.css)
        .pipe(clean());
});

gulp.task('autoprefixer', function() {
    return gulp.src(paths.css + '/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.css));
});

// ~ Clean the files before any new compilation and then re-compile
gulp.task('sass', function() {
    return gulp.src(paths.sass + '/**/*.sass')
        .pipe(sass({
            style: 'compressed'
        }))
        .on('error', function(err) {
            console.log(err.message);
        })
        .pipe(gulp.dest(paths.css));
});

gulp.task('styles', ['sass', 'autoprefixer']);
