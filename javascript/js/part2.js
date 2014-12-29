(function($, window) {

	// +———————————————————————————————————————+
	//	LineToSketch
	// +———————————————————————————————————————+

	cidocs.LineToSketch = function( options ) {

		// LineToSketch.superclass.call( this, options );
		cidocs.Path2dSketch.call( this, options );

		this.name = "lineto";
	}

	cidocs.LineToSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50.0, 50.0 ) );
			path2d.lineTo( new Point( 150.0, 150.0 ) );
			path2d.lineTo( new Point( 250.0, 50.0 ) );
			path2d.lineTo( new Point( 350.0, 150.0 ) );
			path2d.lineTo( new Point( 450.0, 50.0 ) );

			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.LineToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	QuadToSketch
	// +———————————————————————————————————————+

	cidocs.QuadToSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
		this.name = "quadto";
	}

	cidocs.QuadToSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
		},

		drawInitialPath: function( ) {
			
			// quadTo - waves
			var curPaper = this.curPaper;
			var waveWidth = 180.0;
			var waveHeight = waveWidth/2.0;
			
			// Path2d wrapper
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, waveHeight ) );
				
			for( var i = 0; i < 3; i++ ) {
				var startX = i * waveWidth;
				path2d.quadTo( new Point( startX, 0.0 ), new Point( startX + waveWidth / 2.0, 0.0 ) );
				path2d.quadTo( new Point( startX + waveWidth / 2.0, waveHeight ), new Point( startX + waveWidth, waveHeight ) );
			}
			
			// path2d.setPosition( new Point( 100, 100 ) );
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );

		}
	};
	cidocs.QuadToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CubicToSketch
	// +———————————————————————————————————————+

	cidocs.CubicToSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
		this.name = "cubicto";
	}

	cidocs.CubicToSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			// this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// quadTo - waves
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, 0.0 ) );
			path2d.cubicTo( new Point( 50.0, 0.0 ), new Point( 100.0, 50.0 ), new Point( 100.0, 100.0 ) );
			path2d.cubicTo( new Point( 100.0, 250.0 ), new Point( 300.0, 250.0 ), new Point( 300.0, 100.0 ) );
			path2d.cubicTo( new Point( 300.0, 50.0 ), new Point( 350.0, 0.0 ), new Point( 400.0, 0.0 ) );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.CubicToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	ArcSketch
	// +———————————————————————————————————————+

	cidocs.ArcSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.ArcSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();

			this.addButton( 'reverseArc', "Reverse Arc" );
		},

		drawInitialPath: function( ) {
			
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );

			path2d.arc( new Point( 25.0, 25.0 ), 100.0, Math.PI * 0.5, Math.PI * 2.0, true );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		},

		reverseArc: function() {

			this.paths[0].reverseArc();
			this.updatePath();

		},

		show: function() {

			this.superclass.show.call( this );
			this.activateButton( 'reverseArc', this.reverseArc );

		},

		hide: function() {

			this.superclass.hide.call( this );
			this.deactivateButton( 'reverseArc' );
		}

	};
	cidocs.ArcSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	ArcToSketch
	// +———————————————————————————————————————+
	
	cidocs.ArcToSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.ArcToSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();

			// this.addButton( 'reverseArc', "Reverse Arc" );
		},

		drawInitialPath: function( ) {
			
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );

			path2d.moveTo( new Point( 0.0, 150.0 ) );
			path2d.arcTo( new Point( 150.0, 0.0 ), new Point( 0.0, 0.0 ), 25.0 );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		}

		/*reverseArc: function() {

			this.paths[0].reverseArc();
			this.updatePath();

		},

		show: function() {

			this.superclass.show.call( this );
			this.activateButton( 'reverseArc', this.reverseArc );

		},

		hide: function() {

			this.superclass.hide.call( this );
			this.deactivateButton( 'reverseArc' );
		}*/

	};
	cidocs.ArcToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CombinedSketch
	// +———————————————————————————————————————+

	cidocs.CombinedSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );

		this.name = "combined";
	}

	cidocs.CombinedSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
		},

		drawInitialPath: function( ) {
			
			var curPaper = this.curPaper;
			
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 150.0, 280.0 ) );
			path2d.quadTo( new Point( 200.0, 280.0 ), new Point( 200.0, 200.0 ) );
			path2d.cubicTo( new Point( 80.0, 300.0 ), new Point( 80.0, 80.0 ), new Point( 200.0, 180.0 ) );
			path2d.cubicTo( new Point( 100.0, 60.0 ), new Point( 320.0, 60.0 ), new Point( 220.0, 180.0 ) );
			path2d.cubicTo( new Point( 340.0, 80.0 ), new Point( 340.0, 300.0 ), new Point( 220.0, 200.0 ) );
			path2d.quadTo( new Point( 220.0, 280.0 ), new Point( 270.0, 280.0 ) );
			path2d.lineTo( new Point( 150.0, 280.0 ) );
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.CombinedSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	Main App
	// +———————————————————————————————————————+

	cidocs.Part1App = function() {
		cidocs.app.call( this );
	};

	cidocs.Part1App.prototype = {

		init: function(){
			
			var self = this;

			// init all the sketches
			var lineToSketch	= new cidocs.LineToSketch( { canvas:'#lineto', output:this.codeModule } );
			var quadToSketch	= new cidocs.QuadToSketch( { canvas:'#quadto', output:this.codeModule } );
			var cubicToSketch	= new cidocs.CubicToSketch( { canvas:'#cubicto', output:this.codeModule } );
			var arcSketch		= new cidocs.ArcSketch( { canvas:'#arc', name:'arc', output:this.codeModule } );
			var arcToSketch		= new cidocs.ArcToSketch( { canvas:'#arcto', name:'arcto', output:this.codeModule } );
			var combinedSketch	= new cidocs.CombinedSketch( { canvas:'#combined', output:this.codeModule } );
			this.sketches.push( lineToSketch, quadToSketch, cubicToSketch, arcSketch, arcToSketch, combinedSketch );	

			this.superclass.init.call( this );
		}
	}

	cidocs.Part1App.extend( cidocs.app );

	$(document).ready( function(){
		
		window.app = new cidocs.Part1App();
		app.init();
		app.show( "lineto" );

	});
	

}(jQuery, window));