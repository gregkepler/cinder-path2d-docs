(function($, window) {

	// +———————————————————————————————————————+
	//	CalcBoundsSketch
	// +———————————————————————————————————————+

	cidocs.CalcBoundsSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.CalcBoundsSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			path2d.quadTo( new Point( 80.0, 0.0 ), new Point( 150.0, 0 ) );
			path2d.quadTo( new Point( 200.0, 25.0 ), new Point( 200.0, 50 ) );
			path2d.quadTo( new Point( 250.0, 100.0 ), new Point( 300.0, 100 ) );
			path2d.close();
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.CalcBoundsSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CalcPreciseSketch
	// +———————————————————————————————————————+	

	cidocs.CalcPreciseSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.CalcPreciseSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.CalcPreciseSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CalcPreciseSketch
	// +———————————————————————————————————————+	

	cidocs.CalcPreciseSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	};

	cidocs.CalcPreciseSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.CalcPreciseSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	ContainsSketch
	// +———————————————————————————————————————+	

	cidocs.ContainsSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	};

	cidocs.ContainsSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.ContainsSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	TransformCopySketch
	// +———————————————————————————————————————+	

	cidocs.TransformCopySketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	};

	cidocs.TransformCopySketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.TransformCopySketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	SubdivideSketch
	// +———————————————————————————————————————+	

	cidocs.SubdivideSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	};

	cidocs.SubdivideSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.SubdivideSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CalcCacheSketch
	// +———————————————————————————————————————+	

	cidocs.CalcCacheSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	};

	cidocs.CalcCacheSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.CalcCacheSketch.extend( cidocs.Path2dSketch );

	// +———————————————————————————————————————+
	//	Main App
	// +———————————————————————————————————————+

	cidocs.Part2App = function() {
		cidocs.app.call( this );
	};

	cidocs.Part2App.prototype = {

		init: function(){
			
			var self = this;

			// init all the sketches
			var calcBoundsSketch	= new cidocs.CalcBoundsSketch( { canvas:'#calcbounds', name:'calcbounds', output:this.codeModule } );
			var calcPreciseSketch	= new cidocs.CalcPreciseSketch( { canvas:'#calcprecise', name:'calcprecise', output:this.codeModule } );
			var containsSketch		= new cidocs.ContainsSketch( { canvas:'#contains', name:'contains', output:this.codeModule } );
			var transformCopySketch	= new cidocs.TransformCopySketch( { canvas:'#transformcopy', name:'transformcopy', output:this.codeModule } );
			var subdivideSketch		= new cidocs.SubdivideSketch( { canvas:'#subdivide', name:'subdivide', output:this.codeModule } );
			var calcCacheSketch		= new cidocs.CalcCacheSketch( { canvas:'#calccache', name:'calccache', output:this.codeModule } );
			this.sketches.push( calcBoundsSketch, calcPreciseSketch, containsSketch, transformCopySketch, subdivideSketch, calcCacheSketch );
			
			this.superclass.init.call( this );
		}
	}

	cidocs.Part2App.extend( cidocs.app );

	$(document).ready( function(){
		
		window.app = new cidocs.Part2App();
		app.init();
		app.show( "calcbounds" );

	});
	

}(jQuery, window));