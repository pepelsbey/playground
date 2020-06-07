var gulp = require('gulp');
var babel = require('gulp-babel');
var postcss = require('gulp-postcss');
var replace = require('gulp-replace');
var htmlmin = require('gulp-htmlmin');
var terser = require('gulp-terser');
var sync = require('browser-sync');

// HTML

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
});

// Styles

gulp.task('styles', function() {
    return gulp.src('src/styles/index.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-media-minmax'),
            require('autoprefixer'),
            require('postcss-csso')
        ]))
        .pipe(replace(/\.\.\//g, ''))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
});

// Scripts

gulp.task('scripts', function() {
    return gulp.src('src/scripts/index.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
});

// Copy

gulp.task('copy', function() {
    return gulp.src([
            'src/fonts/**/*',
            'src/images/**/*'
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
});

// Paths

gulp.task('paths', function() {
    return gulp.src('dist/*.html')
        .pipe(replace(
            /(<link rel="stylesheet" href=")styles\/(index.css">)/, '$1$2'
        ))
        .pipe(replace(
            /(<script src=")scripts\/(index.js">)/, '$1$2'
        ))
        .pipe(gulp.dest('dist'));
});

// Server

gulp.task('server', function() {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
});

// Watch

gulp.task('watch', function() {
    gulp.watch('src/*.html', gulp.series('html', 'paths'));
    gulp.watch('src/styles/**/*.css', gulp.series('styles'));
    gulp.watch('src/scripts/**/*.js', gulp.series('scripts'));
    gulp.watch([
        'src/fonts/**/*',
        'src/images/**/*'
    ], gulp.series('copy'));
});

// Default

gulp.task('default', gulp.series(
    gulp.parallel(
        'html',
        'styles',
        'scripts',
        'copy'
    ),
    'paths',
    gulp.parallel(
        'watch',
        'server'
    )
));
