/*
 * @Author: ZXY 
 * @Date: 2019-02-18 08:44:59 
 * @Last Modified by: ZXY
 * @Last Modified time: 2019-02-18 09:14:13
 */

var gulp = require('gulp'),
    server = require('gulp-webserver'),
    scss = require('gulp-sass'),
    minCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    url = require('url'),
    path = require('path'),
    fs = require('fs')

// 在gulp中使用webserver启动web服务，并且提供自动刷新功能
gulp.task('devServer', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == '/favicon.ico') {
                    res.end('');
                    return;
                }
                if (pathname == '/api/list') {
                    res.end();
                } else {
                    pathname = pathname == '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
});
// 在gulp中创建scss任务，进行scss文件编译，并且压缩css（10分）
gulp.task('scss', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(scss())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
});
// 在gulp中创建js任务编译js文件，合并js，并且压缩（10分）
gulp.task('js', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./src/js/min'))
});
// 7.在gulp中创建watch任务，进行css文件监听，自动执行对应的任务（10分）；
gulp.task('watch', function() {
    return gulp.watch('./src/scss/**/*.scss', gulp.series('scss'))
});
// 8.在gulp中创建default任务，默认执行webserver服务，js，css，watch任务（10分）；
gulp.task('default', gulp.series('scss', 'js', 'devServer', 'watch'));
// 9.在gulp中创建build任务，指向js,css任务，并把文件生成到dist文件夹（10分）；
gulp.task('build', function() {
    return gulp.src(['./src/css/**/*.css', './src/js/**/*.js'])
        .pipe(gulp.dest(['./dist/css/**/*.css', './dist/js/**/*.js']))
});