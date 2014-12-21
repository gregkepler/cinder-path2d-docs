var gulp = require('gulp');
var stylus = require( 'gulp-stylus' )
var nib = require( 'nib' )

gulp.task( 'scripts', function() {

	return gulp.src( 'js/main.js' );
})

gulp.task( 'styles', function() {
    
    return gulp.src( [ 'stylus/*.styl'] )

        .pipe( stylus({
            import: [ 'nib' ],
            use: [ nib() ]
        }))

        .pipe( gulp.dest( 'css/' ) )
})

gulp.task( 'watch', [ 'styles' ], function() {
    
    gulp.watch( 'stylus/*.styl', [ 'styles' ] )
    gulp.watch('js/**/*.js', ['scripts']);

})

gulp.task( 'default', [ 'watch' ] )