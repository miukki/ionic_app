var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var paths = {
  sass: ['./scss/**/*.scss', './www/lib/ionic/scss/**/*.scss'],
  tmpls: ['./www/tmpls/**/*.html'],
  ctrls: ['./www/js/ctrls/**/*.js'],
  lint: ['./www/js/ctrls/**/*.js', './www/js/app.js']
};


gulp.task('default', ['sass', 'tmpl', 'ctrl']);

gulp.task('lint', function() {
  return gulp.src(paths.lint)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});

gulp.task('ctrl', function () {
    gulp.src(paths.ctrls[0])
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('www/js'));
});

gulp.task('tmpl', function () {
    gulp.src(paths.tmpls[0])
        .pipe(templateCache('tmpls.js', {module: 'starter'}))
        .pipe(gulp.dest('www/js'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.tmpls, ['tmpl']);
  gulp.watch(paths.ctrls, ['ctrl']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
