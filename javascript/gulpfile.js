var gulp = require('gulp');
var stylus = require( 'gulp-stylus' )
var nib = require( 'nib' )

gulp.task( 'styles', function() {
    
    return gulp.src( [ '/**/*.styl'] )

        .pipe( stylus({
            import: [ 'nib' ],
            use: [ nib() ]
        }))

        .pipe( gulp.dest( 'css/' ) )
})

gulp.task( 'watch', [ 'styles' ], function() {
    
    gulp.watch( SOURCE + '/**/*.styl', [ 'styles' ] )

})

gulp.task( 'default', [ 'watch' ] )