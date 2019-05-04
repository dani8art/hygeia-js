'use strict';
var gulp = require('gulp');
var header = require('gulp-header');
var pkg = require('./package.json');

var banner = ['/**',
    ' * <%= pkg.name %>',
    ' * Copyright (c) 2019 darteaga (<%= pkg.homepage %>)',
    ' * <%= pkg.license %> Licensed',
    ' */',
    '\n'].join('\n');

gulp.task('build', () => {
    gulp.src('./src/**')
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', () => {
    gulp.src(['LICENSE', 'package.json', 'README.md'])
        .pipe(gulp.dest('./dist/'));
});