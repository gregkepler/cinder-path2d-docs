(function($, window) {

	// +———————————————————————————————————————+
	//	LineToSketch
	// +———————————————————————————————————————+

	cidocs.LineToSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
		this.name = "lineto";
	}

	cidocs.LineToSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
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
			// this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// quadTo - waves
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, 0.0 ) );
			path2d.curveTo( new Point( 50.0, 0.0 ), new Point( 100.0, 50.0 ), new Point( 100.0, 100.0 ) );
			path2d.curveTo( new Point( 100.0, 250.0 ), new Point( 300.0, 250.0 ), new Point( 300.0, 100.0 ) );
			path2d.curveTo( new Point( 300.0, 50.0 ), new Point( 350.0, 0.0 ), new Point( 400.0, 0.0 ) );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.CubicToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	ArcSketch
	// +———————————————————————————————————————+

	cidocs.ArcSketch = function( options ) {

		this._radius = 100.0;
		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.ArcSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();

			this.addButton( 'radius', "radius", [5, 150] );
			this.addButton( 'reverseArc', "Reverse Arc" );

			// $(this.paths[0]).on( "change_radius", function() {
			//     console.log( "CHANGE RADIUS" );
			// });
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
			this.updateSketch();

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

	// getters and setters
	cidocs.ArcSketch.addGetter( 'radius', function(){ return this._radius } );
	cidocs.ArcSketch.addSetter( 'radius', function( val ){ 
		this._radius = val;
		this.paths[0].setArcRadius( this._radius );
		this.updateSketch();
	});


	// +———————————————————————————————————————+
	//	ArcToSketch
	// +———————————————————————————————————————+
	
	cidocs.ArcToSketch = function( options ) {

		this.ORIG_RADIUS = 25.0;
		this._radius = this.ORIG_RADIUS;
		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.ArcToSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.addButton( 'radius', 'radius', [1, 100] );
		},

		drawInitialPath: function( ) {
			
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );

			path2d.moveTo( new Point( 0.0, 150.0 ) );
			path2d.arcTo( new Point( 150.0, 0.0 ), new Point( 0.0, 0.0 ), this.radius );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		},

		reset: function() {
			this.radius = this.ORIG_RADIUS;
			this.superclass.reset.call( this );
		}

	};	

	cidocs.ArcToSketch.extend( cidocs.Path2dSketch );

	// getters and setters
	cidocs.ArcToSketch.addGetter( 'radius', function(){return this._radius});
	cidocs.ArcToSketch.addSetter( 'radius', function( val ){ 
		this._radius = val;
		this.paths[0].setArcRadius( this._radius );
		this.updateSketch();
	});

	
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
			path2d.curveTo( new Point( 80.0, 300.0 ), new Point( 80.0, 80.0 ), new Point( 200.0, 180.0 ) );
			path2d.curveTo( new Point( 100.0, 60.0 ), new Point( 320.0, 60.0 ), new Point( 220.0, 180.0 ) );
			path2d.curveTo( new Point( 340.0, 80.0 ), new Point( 340.0, 300.0 ), new Point( 220.0, 200.0 ) );
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

	cidocs.Part2App = function() {
		cidocs.app.call( this );
	};

	cidocs.Part2App.prototype = {

		init: function(){
			
			var self = this;

			// init all the sketches
			var lineToSketch	= new cidocs.LineToSketch( { canvas:'#lineto', name:'lineto', output:this.codeModule } );
			var quadToSketch	= new cidocs.QuadToSketch( { canvas:'#quadto', name:'quadto', output:this.codeModule } );
			var cubicToSketch	= new cidocs.CubicToSketch( { canvas:'#cubicto', name:'cubicto', output:this.codeModule } );
			var arcSketch		= new cidocs.ArcSketch( { canvas:'#arc', name:'arc', output:this.codeModule } );
			var arcToSketch		= new cidocs.ArcToSketch( { canvas:'#arcto', name:'arcto', output:this.codeModule } );
			var combinedSketch	= new cidocs.CombinedSketch( { canvas:'#combined', name:'combined', output:this.codeModule } );
			this.sketches.push( lineToSketch, quadToSketch, cubicToSketch, arcSketch, arcToSketch, combinedSketch );	

			this.superclass.init.call( this );
		}
	}

	cidocs.Part2App.extend( cidocs.app );

	$(document).ready( function(){
		
		window.app = new cidocs.Part2App();
		app.init();
		app.show( "lineto" );

	});
	

}(jQuery, window));