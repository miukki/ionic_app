//var sh = require('shelljs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var version = require('./package.json').version;

//load gulp modules
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /^gulp(-|\.)/,
    scope: ['dependencies', 'devDependencies', 'peerDependencies'],
    camelize: true,
    lazy: true,
    rename: { 'minifyCss': 'gulp-minify-css'}
});


var paths = {
  fonts: './www/bower_components/ionic/fonts/*',
  sass: ['./www/scss/**/*.scss'],
  tmpls: ['./www/tmpls/**/*.html'],
  dist: {
    latest: './_output/latest',
    release: './_output/'+version
  },
  css: ['./www/css/ionic.app.css'],
  scripts: {
    lint: ['./www/js/ctrls/**/*.js', './www/js/app.js'],
    ctrls: ['./www/js/ctrls/**/*.js'],
    annotate: ['./www/js/*.js', '!./www/js/ctrls/**/*.js'],
    dist: './www/js/dist'
  },
  html: ['./www/index.html'],
};


gulp.task('clean', function () {
  return gulp.src('./_output', {read: false}).pipe(plugins.clean({force: true}))
});

gulp.task('clean:js:dist', function () {
  return gulp.src(paths.scripts.dist, {read: false}).pipe(plugins.clean({force: true}))
});

gulp.task('default', function() {

  runSequence('clean', 'copy:fonts', 'sass', 'scripts', 'useref', function() {
    console.log((gutil.env.release ? 'release ' : 'latest ')  + 'done!');
  })

});


gulp.task('ng_annotate', function () { //prepare angular app in one bundle file
  return gulp.src(paths.scripts.annotate)
    .pipe(plugins.ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(plugins.concat('app.bundle.js'))
    .pipe(gulp.dest(paths.scripts.dist));
});

gulp.task('useref', function () {
  var assets = plugins.useref.assets();
  var jsFilter = plugins.filter(['js/app.bundle.js']);//'js/dist/app.bundle.js'
  var indexFilter = plugins.filter(['index.html'])
  var manifest = gulp.src('./rev-manifest.json');


  return gulp.src(paths.html)
    .pipe(assets) // Concatenate with gulp-useref

    .pipe(plugins.if(gutil.env.release, jsFilter)) // Minify app.bundle.js if gutil.env.release
    .pipe(plugins.if(gutil.env.release, plugins.rename({ extname: '.min.js' })))
    .pipe(plugins.if(gutil.env.release, plugins.uglify()))
    .pipe(plugins.if(gutil.env.release, jsFilter.restore())) //restore filter

    .pipe(assets.restore())
    .pipe(plugins.useref())

    //manually substitute in new filenames for UAT server, please check file rev-manifest.json
    .pipe(plugins.revReplace({ manifest: manifest,
        modifyReved: function(filename) {
          if (filename.indexOf('app.bundle.js') > -1 && (gutil.env.release) ) {
              return filename.replace('app.bundle.js', 'app.bundle.min.js');
          }
          return filename;

        }
      }))

    .pipe(indexFilter)
    .pipe(plugins.rename({ basename: 'dashboard'}))
    .pipe(indexFilter.restore())

    .pipe(gulp.dest(gutil.env.release ? paths.dist.release : paths.dist.latest));

});

gulp.task('scripts', function(cb) {
  runSequence('tmpl', 'ctrl', 'clean:js:dist','ng_annotate', cb)
})



gulp.task('lint', function () {
  return gulp.src(paths.scripts.lint)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish', { verbose: true }));
    //.pipe(jshint.reporter('fail'));
});

gulp.task('ctrl', function () {
  return gulp.src(paths.scripts.ctrls)
    .pipe(plugins.concat('controllers.js'))
    .pipe(gulp.dest('www/js'));
});

gulp.task('tmpl', function () {
  return gulp.src(paths.tmpls[0])
        .pipe(plugins.angularTemplatecache('tmpls.js', {module: 'starter'}))//, standalone: true, i using one module 'starter' for app, ctrls, tmpls
        .pipe(gulp.dest('www/js'));
});

gulp.task('copy:fonts', function() {
  return gulp.src(paths.fonts).pipe(gulp.dest(gutil.env.release ? paths.dist.release+'/fonts' : gutil.env.latest ? paths.dist.latest+'/fonts' : './www/fonts' ));
})

gulp.task('sass', function () {
  return gulp.src('./www/scss/ionic.app.scss')
    .pipe(plugins.sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(plugins.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'));
});


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.tmpls, function() {
    runSequence('tmpl', 'ng_annotate')
  });
  gulp.watch(paths.scripts.ctrls, function() {
    runSequence('ctrl', 'lint', 'ng_annotate')
  });
  gulp.watch('./www/js/app.js', function(){
    runSequence('lint', 'ng_annotate')
  });
});

