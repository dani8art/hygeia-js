'use strict';
const { src, series, dest } = require('gulp');
const header = require('gulp-header');
const del = require('delete');
const pkg = require('./package.json');

const banner = ['/**',
    ' * <%= pkg.name %>',
    ' * Copyright (c) 2019 darteaga (<%= pkg.homepage %>)',
    ' * <%= pkg.license %> Licensed',
    ' */',
    '\n'].join('\n');

function clear(cb) {
    del(['dist/'], cb);
}
function build() {
    return src('./src/**')
        .pipe(header(banner, { pkg: pkg }))
        .pipe(dest('./dist/'));
}

function copy() {
    return src(['LICENSE', 'package.json', 'README.md'])
        .pipe(dest('./dist/'));
}

exports.clear = clear;
exports.build = build;
exports.copy = copy;
exports.default = series(clear, build, copy);