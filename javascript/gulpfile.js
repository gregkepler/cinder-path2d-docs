var gulp 			= require( 'gulp' );
var stylus 			= require( 'gulp-stylus' );
var nib 			= require( 'nib' );
var concat 			= require( 'gulp-concat' );
var uglify 			= require( 'gulp-uglify' );
var notify 			= require( 'gulp-notify' );
var fileinclude 	= require( 'gulp-file-include' );
var useref 			= require( 'gulp-useref' );
var clean			= require( 'gulp-clean' );
var Filter 			= require( 'gulp-filter');

gulp.task( 'wrap', function() {
	
	var assets = useref.assets();

	return gulp.src( [
		'src/part1.html',
		'src/part2.html',
		'src/part3.html',
		'src/tut_part1.html',
		'src/tut_part2.html',
		'src/tut_part3.html'
		])
		.pipe( fileinclude({
			prefix: '@@'
		}) )
        .pipe( assets )
        .pipe( assets.restore() )
        .pipe( useref() )
		.pipe( gulp.dest('build') )
		.pipe( notify({message:'Finished wrapping html'}) );
});

/*gulp.task( 'scripts', function() {

	return gulp.src( [
		'js/vendor/*.js',
		'bower_components/dat-gui/build/dat.gui.js',
		'bower_components/paper/dist/paper-core.js',
		'bower_components/underscore/underscore.js',
		'js/main.js',
		'js/part1.js',
		'js/part2.js',
		'js/part3.js'
		] )

		.pipe(concat('path2d.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('build'))
		.pipe(notify({message:'Finished compiling scripts'}));
});*/

gulp.task( 'styles', function() {
    
    var filter = Filter('**/*.styl');

    return gulp.src( [ 
    	'./stylus/*.styl',
    	'src/css/prism.css'
    	] )

    	.pipe(filter)
        .pipe( stylus({
            import: [ 'nib' ],
            use: [ nib() ]
        }))
        .pipe(filter.restore())
        // .pipe(concat('path2d.css'))
        .pipe( gulp.dest( 'build' ) );
});

gulp.task( 'copy', function() {
	return gulp.src( [
		'src/ZeroClipboard.swf',
		'src/index.html',
		'src/js/iframeResizer.min.js',
		'src/js/iframeResizer.contentWindow.min.js'
		])
		.pipe(gulp.dest('build'));
});

gulp.task('clean', function () {

  return gulp.src('build/*.*', {read: false})
    .pipe(clean());
});

gulp.task( 'watch', [ 'styles' ], function() {
    
    gulp.watch( 'stylus/*.styl', [ 'styles' ] );
    // gulp.watch( 'js/**/*.js', ['scripts'] );
    gulp.watch( ['src/**/*.html', 'src/js/**/*.js'], ['wrap'] );

});

gulp.task( 'default', [ 'clean', 'watch', 'copy' ] );

gulp.task( 'build', [
	'clean',
	'copy',
	'styles', 
	// 'scripts', 
	'wrap'] );