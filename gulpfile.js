'use strict';
var gulp = require('gulp');
var header = require('gulp-header');
var pkg = require('./package.json');

var banner = ['/**',
    ' * <%= pkg.name %>',
    ' * Copyright (c) 2018 darteaga (<%= pkg.homepage %>)',
    ' * <%= pkg.license %> Licensed',
    ' */',
    '\n'].join('\n');

gulp.task('default', () => {
    gulp.src('./src/**')
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('./src/'));
});

