let gulp          = require('gulp'),
	gutil         = require('gulp-util' ),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require("gulp-notify"),
	jade 		  = require('gulp-jade'),
	imagemin      = require('gulp-imagemin'),
	pngquant      = require('imagemin-pngquant'), 
	del           = require('del'), 
	rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('html', function() {
    return gulp.src('assets/jade/**/*.jade')
        .pipe(jade({
			pretty: true
		})) 
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('css', function() {
	return gulp.src('assets/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function() {
	return gulp.src([
	//	'assets/libs/jquery/dist/jquery.min.js',
	//	'assets/js/bootstrap.bundle.min.js',
	//	'assets/js/bootstrap.min.js',
		'assets/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
//	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('img', function() {
    return gulp.src('assets/img/**') 
        .pipe(imagemin({  
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant({quality: '65-70', speed: 5})]
        }))
        .pipe(gulp.dest('app/img')); 
});

gulp.task('fonts', function(){
	return gulp.src('assets/fonts/**')
	.pipe(gulp.dest('app/font'));
});

gulp.task('clean', function() {
    return del.sync('app'); 
});

gulp.task('build', ['clean', 'html', 'css', 'js', 'img', 'fonts'], function() {

});

gulp.task('watch', ['html','css', 'js', 'browser-sync'], function() {
	gulp.watch('assets/sass/**/*.sass', ['css']);
	gulp.watch(['assets/js/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('assets/**/*.jade', ['html']);
});

gulp.task('default', ['watch']);