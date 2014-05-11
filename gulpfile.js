/*global require*/
var gulp = require('gulp'),
    jasmine = require('gulp-jasmine'),
    size = require('gulp-size');

gulp.task('test', function(){
    gulp.src('./test/test.js').pipe(jasmine({verbose: true}));
});

gulp.task('size', function(){
    gulp.src('fuq.js').pipe(size({title: 'Total'})).pipe(size({
        title: 'Gzipped',
        gzip: true
    }));
});

gulp.task('watch', function() {
    gulp.watch('fuq.js', ['test', 'size']);
    gulp.watch('./test/test.js', ['test']);
});

gulp.task('default', ['test', 'size', 'watch']);
