var gulp 			= require( 'gulp' );
var stylus 			= require( 'gulp-stylus' );
var nib 			= require( 'nib' );
var concat 			= require( 'gulp-concat' );
var uglify 			= require( 'gulp-uglify' );
var notify 			= require( 'gulp-notify' );
var fileinclude 	= require( 'gulp-file-include' );
var useref 			= require( 'gulp-useref' );

gulp.task( 'wrap', function() {
	
	var assets = useref.assets();

	return gulp.src( [
		'html/part1.html',
		'html/part2.html',
		'html/part3.html'
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
    
    return gulp.src( [ 'stylus/*.styl'] )

        .pipe( stylus({
            import: [ 'nib' ],
            use: [ nib() ]
        }))
        // .pipe( concat('css/prism.css') )
        .pipe( gulp.dest( 'build' ) );
});

gulp.task( 'copy', function() {
	return gulp.src( [
		'js/ZeroClipboard.swf',
		'html/index.html',
		'css/prism.css'
		] )
		.pipe(gulp.dest('build'));
})

gulp.task( 'watch', [ 'styles' ], function() {
    
    gulp.watch( 'stylus/*.styl', [ 'styles' ] );
    // gulp.watch( 'js/**/*.js', ['scripts'] );
    gulp.watch( 'html/**/*.html', ['wrap'] );

});

gulp.task( 'default', [ 'watch' ] );

gulp.task( 'build', [
	'styles', 
	// 'scripts', 
	'copy', 
	'wrap'] );