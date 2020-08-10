import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import buffer from 'vinyl-buffer';
import csso from 'postcss-csso';
import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import minmax from 'postcss-media-minmax';
import pimport from 'postcss-import';
import postcss from 'gulp-postcss';
import replace from 'gulp-replace';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import sync from 'browser-sync';
import terser from 'gulp-terser';

// HTML

export const html = () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

// Styles

export const styles = () => {
    return gulp.src('src/styles/index.css')
        .pipe(postcss([
            pimport,
            minmax,
            autoprefixer,
            csso,
        ]))
        .pipe(replace(/\.\.\//g, ''))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

// Scripts

export const scripts = () => {
    return rollup({
            input: 'src/scripts/index.js',
            format: 'es',
        })
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist'));
};

// Copy

export const copy = () => {
    return gulp.src([
            'src/fonts/**/*',
            'src/images/**/*',
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
};

// Paths

export const paths = () => {
    return gulp.src('dist/*.html')
        .pipe(replace(
            /(<link rel="stylesheet" href=")styles\/(index.css">)/, '$1$2'
        ))
        .pipe(replace(
            /(<script src=")scripts\/(index.js">)/, '$1$2'
        ))
        .pipe(gulp.dest('dist'));
};

// Server

export const server = () => {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist',
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
};

// Watch

export const watch = () => {
    gulp.watch('src/*.html', gulp.series(html, paths));
    gulp.watch('src/styles/**/*.css', gulp.series(styles));
    gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
    gulp.watch([
        'src/fonts/**/*',
        'src/images/**/*',
    ], gulp.series(copy));
};

// Build

export const build = gulp.series(
    gulp.parallel(
        html,
        styles,
        scripts,
        copy,
    ),
    paths
);

// Default

export default gulp.series(
    build,
    gulp.parallel(
        watch,
        server,
    ),
);
