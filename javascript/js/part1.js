(function($, window) {

	// +———————————————————————————————————————+
	//	MoveToSketch
	// +———————————————————————————————————————+

	cidocs.MoveToSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );

		this.name = "moveto";
	}

	cidocs.MoveToSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, 0.0 ) );
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.MoveToSketch.extend( cidocs.Path2dSketch );

	// +———————————————————————————————————————+
	//	LineToSegmentSketch
	// +———————————————————————————————————————+

	cidocs.LineToSegmentSketch = function( options ) {

		// LineToSketch.superclass.call( this, options );
		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.LineToSegmentSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, 0.0 ) );
			path2d.lineTo( new Point( 200.0, 200.0 ) );

			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.LineToSegmentSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	QuadToSegmentSketch
	// +———————————————————————————————————————+

	cidocs.QuadToSegmentSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.QuadToSegmentSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, 200.0 ) );
			path2d.quadTo( new Point( 0.0, 0.0 ), new Point( 200.0, 0.0 ) );

			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.QuadToSegmentSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CubicToSegmentSketch
	// +———————————————————————————————————————+

	cidocs.CubicToSegmentSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.CubicToSegmentSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, 200.0 ) );
			path2d.curveTo( new Point( 100.0, 200.0 ), new Point( 100.0, 0.0 ), new Point( 200.0, 0.0 ) );

			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.CubicToSegmentSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CloseSketch
	// +———————————————————————————————————————+

	cidocs.CloseSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
		this.name = "close";
	}

	cidocs.CloseSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			// this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// quadTo - waves
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, 200.0 ) );
			path2d.lineTo( new Point( 150.0, 0.0 ) );
			path2d.lineTo( new Point( 300.0, 200.0 ) );
			path2d.close();
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.CloseSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	Main App
	// +———————————————————————————————————————+

	cidocs.Part1App = function() {
		cidocs.app.call( this );
	};

	cidocs.Part1App.prototype = {

		init: function(){
			
			var self = this;

			console.log( "CODE MODULE", this.codeModule );

			// init all the sketches
			var moveToSketch			= new cidocs.MoveToSketch( { canvas:'#moveto', output:this.codeModule } );
			var lineToSegmentSketch		= new cidocs.LineToSegmentSketch( { canvas:'#linetosegment', name:'linetosegment', output:this.codeModule } );
			var quadToSegmentSketch		= new cidocs.QuadToSegmentSketch( { canvas:'#quadtosegment', name:'quadtosegment', output:this.codeModule } );
			var cubicToSegmentSketch	= new cidocs.CubicToSegmentSketch( { canvas:'#cubictosegment', name:'cubictosegment', output:this.codeModule } );
			var closeSketch				= new cidocs.CloseSketch( { canvas:'#close', output:this.codeModule } );
			this.sketches.push( moveToSketch, lineToSegmentSketch, quadToSegmentSketch, cubicToSegmentSketch, closeSketch );		


			this.superclass.init.call( this );
		}
	}

	cidocs.Part1App.extend( cidocs.app );

	$(document).ready( function(){
		
		window.app = new cidocs.Part1App();
		app.init();
		app.show( "moveto" );

	});
	

}(jQuery, window));