var gulp = require('gulp'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    argv  = require('minimist')(process.argv),
    rsync = require('gulp-rsync'),
    prompt = require('gulp-prompt'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    ftp_deploy = require('ftp-deploy'),
    config = require('./config.json'),
    dotenv = require('dotenv').config();

// Delete the dist directory
gulp.task('clean', function() {
  gulp.src(config.folder.dist)
    .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', function() {
  gulp.src(config.paths.scripts, {cwd: config.folder.app})
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(config.folder.dist + 'scripts'))
    .pipe(connect.reload());
});

// compile sass to css and compress it
gulp.task('sass', function () {
  gulp.src(config.paths.styles, {cwd: config.folder.app})
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(config.folder.dist + 'styles'))
    .pipe(connect.reload());
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', function() {
  gulp.src(config.paths.images, {cwd: config.folder.app})
    .pipe(imagemin())
    .pipe(gulp.dest(config.folder.dist + 'images'))
    .pipe(connect.reload());
});

// Copy all other files to dist directly
gulp.task('copy', function() {
  // Copy html
  console.log(config.paths.html);
  gulp.src(config.paths.html, {cwd: config.folder.app})
   .pipe(gulp.dest(config.folder.dist));

 // Copy lib scripts, maintaining the original directory structure
  gulp.src(config.paths.libs, {cwd: config.folder.app + '/**'})
    .pipe(gulp.dest(config.folder.dist));

 // Copy extra html5bp files
  gulp.src(config.paths.extras, {cwd: config.folder.app})
    .pipe(gulp.dest(config.folder.dist));
});

// A development task to run anytime a file changes
gulp.task('watch', function() {
  gulp.watch(config.folder.app + '/**/*', ['copy', 'imagemin', 'scripts', 'sass']);
});

gulp.task('webserver', function() {
  connect.server({
    root: 'dist/',
    host: '0.0.0.0',
    livereload: true
  });
});

gulp.task('ftp-deploy', function() {
  deploy = new ftp_deploy();

  ftp_config = {
    username: process.env.ftp_username,
    password: process.env.ftp_password,
    host: process.env.ftp_host,
    port: process.env.ftp_port,
    localRoot: process.env.ftp_localRoot,
    remoteRoot: process.env.ftp_remoteRoot
  }

  deploy.on('uploading', function(data) {
    data.totalFileCount;       // total file count being transferred
    data.transferredFileCount; // number of files transferred
    data.percentComplete;      // percent as a number 1 - 100
    data.filename;             // partial path with filename being uploaded
  });

  deploy.on('uploaded', function(data) {
    console.log(data);         // same data as uploading event
  });

  deploy.deploy(ftp_config, function(err) {
    console.log("deploy error: "+err);
    if (err) throwError('ftp-deploy', gutil.colors.red(err));
    else console.log('manual deploy finished');
  });
  

});

function throwError(taskName, msg) {
  throw new gutil.PluginError({
    plugin: taskName,
    message: msg
  });
}

// build task
gulp.task('build', ['clean', 'scripts', 'sass', 'imagemin', 'copy']);

// Define the default task as a sequence of the above tasks
gulp.task('default', ['clean', 'scripts', 'sass', 'imagemin', 'copy', 'webserver', 'watch']);
