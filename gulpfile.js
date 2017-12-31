const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('default', () => {
    let pkgName = process.env.npm_package_name;
    let version = process.env.npm_package_version;
    gulp.src('src/*')
        .pipe(zip(pkgName + '-' + version + '.zip'))
        .pipe(gulp.dest('dist'))
});