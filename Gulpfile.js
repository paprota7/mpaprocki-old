var gulp = require('gulp');
var mkdirp = require('mkdirp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlhint = require("gulp-htmlhint");
var cleanCSS = require('gulp-clean-css');
var streamqueue = require('streamqueue');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var browsers = [
    'last 2 versions',
    'ie >= 8',
    'ie_mob >= 10',
    'ios >= 7',
    'android >= 4.2',
    'bb >= 10'
];

gulp.task('sass', function() {
    gulp.src('css/**/*.css', {
            read: false
        })
        .pipe(clean());

    gulp.src('source/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: browsers,
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sprite', function() {
    var spriteData = gulp.src('source/sprites/**/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprites.scss',
            imgPath: '../images/sprite.png',
        }));
    spriteData.img.pipe(gulp.dest('images'));
    spriteData.css.pipe(gulp.dest('source/scss'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
    return streamqueue({ objectMode: true },
        gulp.src('source/js/vendor/*.js'),
        gulp.src('source/js/*.js')
    )
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function() {
    gulp.src("*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
});

gulp.task('browserSync:init', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    });
});

gulp.task('watch', ['browserSync:init', 'sprite', 'sass', 'js', 'html'], function() {
    gulp.watch('source/sprites/*.*', ['sprite']);
    gulp.watch('source/scss/**/*.scss', ['sass']);
    gulp.watch('source/js/**/*.js', ['js']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('*.html', ['html']);
});


gulp.task('default', ['sprite', 'sass', 'js', 'html'], function() {});
