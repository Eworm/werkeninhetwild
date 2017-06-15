var gulp = require('gulp'),
    // Get packages from package.json
    plugins = require("gulp-load-plugins")(),
    // Livereload stuff
    lr = require('tiny-lr'),
    server = lr();


// Set source paths
var src_paths = {
    compass: 'sass/**/*.scss',
    autoprefixer: '*.css',
    htmlincluder: './html/**/*.html',
    imagemin: 'images/portfolio/*.*',
    responsiveimages: './images-src/episodes/7/*.jpg',
    headers: './images-src/episodes/*.jpg',
    uglify: ['bower_components/picturefill/external/matchmedia.js',
                'bower_components/picturefill/picturefill.js',
                'bower_components/blazy/blazy.js',
                'js-src/functions.js']
};


// Set destination paths
var dest_paths = {
    compass: '.',
    imagemin: 'images',
    uglify: 'js',
    yepnope: 'js'
};


// Compass
gulp.task('compass', function() {
    gulp.src(src_paths.compass)

        .pipe(plugins.plumber({errorHandler: plugins.notify.onError("Error: <%= error.message %>")}))

        .pipe(plugins.compass({
            config_file: 'config.rb',
            sourcemap: false,
            //debug: true,
            css: dest_paths.compass,
            sass: 'sass',
            import_path: 'bower_components/normalize.scss'
        }))

        .pipe(plugins.autoprefixer("last 2 versions", "> 1%", "ie 8"))
		.pipe(gulp.dest('.'))

        .pipe(plugins.livereload(server))
        .pipe(plugins.notify({ message: 'Compass complete' }))
});


// Uglify
gulp.task('uglify', function() {

    gulp.src(src_paths.uglify)

        .pipe(plugins.plumber({errorHandler: plugins.notify.onError("Error: <%= error.message %>")}))

        .pipe(plugins.concat('functions.min.js'))
        // Strip console and debugger statements from JavaScript code
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest_paths.uglify))

        .pipe(plugins.livereload(server))
        .pipe(plugins.notify({ message: 'Uglify complete' }))
});


// HTML includer
gulp.task('htmlincluder', function() {
    gulp.src(src_paths.htmlincluder)
        .pipe(plugins.htmlincluder())
        .pipe(gulp.dest('./'))

        .pipe(plugins.livereload(server))
        .pipe(plugins.notify({ message: 'HTML includer complete' }))
});


// SCSS lint
gulp.task('lint', function() {
    gulp.src(src_paths.compass)
        .pipe(plugins.scssLint())
});


// Create all responsive images
gulp.task('images', function () {

    gulp.src(src_paths.responsiveimages)
        .pipe(plugins.imageResize({ width: 480, quality: .8, imageMagick: true }))
        .pipe(plugins.rename(function (path) { path.basename += "-wrist"; }))
        .pipe(gulp.dest('./images/episodes/7'));

    gulp.src(src_paths.responsiveimages)
        .pipe(plugins.imageResize({ width: 750, quality: .8, imageMagick: true }))
        .pipe(plugins.rename(function (path) { path.basename += "-palm"; }))
        .pipe(gulp.dest('./images/episodes/7'));

    gulp.src(src_paths.responsiveimages)
        .pipe(plugins.imageResize({ width: 970, quality: .8, imageMagick: true }))
        .pipe(plugins.rename(function (path) { path.basename += "-lap"; }))
        .pipe(gulp.dest('./images/episodes/7'));

});


// Create all responsive header images
gulp.task('headers', function () {

    gulp.src(src_paths.headers)
        .pipe(plugins.imageResize({ width: 750, quality: .8, imageMagick: true }))
        .pipe(plugins.rename(function (path) { path.basename += "-palm"; }))
        .pipe(gulp.dest('./images/episodes'));

    gulp.src(src_paths.headers)
        .pipe(plugins.imageResize({ width: 1500, quality: .8, imageMagick: true }))
        .pipe(plugins.rename(function (path) { path.basename += "-lap"; }))
        .pipe(gulp.dest('./images/episodes'));

    gulp.src(src_paths.headers)
        .pipe(plugins.imageResize({ width: 2200, quality: .8, imageMagick: true }))
        .pipe(plugins.rename(function (path) { path.basename += "-desk"; }))
        .pipe(gulp.dest('./images/episodes'));

});


// Watch
gulp.task('watch', function() {
    server.listen(35729, function(err) {
    	gulp.watch(src_paths.compass, ['compass']);
    	gulp.watch(src_paths.uglify, ['uglify']);
    	gulp.watch(src_paths.responsiveimages, ['images']);
    })
});


// Default
gulp.task('default', ['watch']);
