(function($, window) {
	
	var cidocs = {};

	// array of paper scope
	var papers = [];
	var COLOR_LINE_TO = '#00FF00';
	var COLOR_QUAD_TO = '#0000FF';
	var COLOR_CUBIC_TO = '#FFFF00';
	// var paper = window.paper;
// console.log(paper);
	



	//
	// from http://codepen.io/MyHatIsAwesome/pen/DaptL
	// Function.extend( base )
	// sets up inheritance between two constructor functions
	// without needing to instantiate the base constructor
	//
	Function.prototype.extend = function( base )
	{
		// Define a surrogate constructor for base
		var Temp = function(){};
		Temp.prototype = base.prototype;

		// instantiate the surrogate
		var t = new Temp();
		t.constructor = this;

		// copy subclass prototype into surrogate object
		for( var key in this.prototype )
			t[key] = this.prototype[key];

		// set subclass prototype as the surrogate object
		this.prototype = t;

		this.prototype.superclass = base.prototype;
	};


	// +———————————————————————————————————————+
	//	Path2dSketch     
	//	all sketches should extend this
	// +———————————————————————————————————————+

	cidocs.Path2dSketch = function( options ) {

		this.canvas = null;
		this.output = null;
		this.paths = [];
		this.curPaper = null;
		this.tool = null;
		this.selectedSegment = null;
		this.selectedPath = null;
		this.selectedPoint = null;
		this.hitOptions = {
			segments: true,
			stroke: true,
			fill: true,
			tolerance: 10
		};
		this.segment = null;
		this.movePath = false;

		this.initialize( options );

		var test = "test";
	}

	cidocs.Path2dSketch.prototype = {

		initialize: function( opts ) {

			var options = opts || {};
			console.log( "PATH2DSKETCH INITIALIZE: output  ", options.output );

			// console.log( "options", options );
			// use defined options
			this.canvas = options.canvas;
			this.output = options.output;

			var paperScope = new paper.PaperScope();
			paperScope.setup( $( options.canvas )[0]);
			this.curPaper = paperScope;
			// console.log( "paths", this, this.paths, paperScope );
			// this.paths.push( paperScope );

			this.tool = new paperScope.Tool();
			// this.tool.minDistance = 0;
			// this.tool.maxDistance = 20;
			// this.tool.distanceThreshold = 10;
			console.log( "tool", this.tool );
			this.tool.onMouseMove = _.bind( this.onToolMouseMove, this );
			this.tool.onMouseDown = _.bind( this.onToolMouseDown, this );
			this.tool.onMouseDrag = _.bind( this.onToolMouseDrag, this );
		},

		onToolMouseMove: function( event ) {

			this.curPaper.project.activeLayer.selected = false;
			/*console.log( event.item );
			if( event.item ) {
				event.item.selected = true;
			}*/

			var result = this.curPaper.project.hitTest( event.point, this.hitOptions );
            if (result) {
            	result.item._parent.selected = true;
            }
		},

		onToolMouseDown: function( event ) {

			this.selectedSegment = this.selectedPath = null;
			var hitResult = this.curPaper.project.hitTest( event.point, this.hitOptions );
			if( !hitResult )
				return;

			if( hitResult ) {
				this.selectedPath = hitResult.item;
				this.selectedPath.selected = true;

				console.log( hitResult);
				if (hitResult.type == 'segment') {
					this.selectedSegment = hitResult.segment;
				}
			}
			
			// this.movePath = hitResult.type == 'fill';
			// if( this.movePath ) {
				// project.activeLayer.addChild( hitResult.item );
			// }
		},

		onToolMouseDrag: function( event ) {
			
			if( this.selectedSegment ) {
				this.selectedSegment.point = event.point;
			}

			// if( this.movePath ) {
				// this.selectedPath.position += event.delta;
			// }

			this.updatePath();
		},

		updatePath: function() {

			this.curPaper.view.draw();
			// console.log( this.paths[0] );
			this.output.update( this.paths[0] );
		},

		show: function() {
			$(this.canvas).addClass( "active" );
			this.updatePath();
		}
	};


	

	// +———————————————————————————————————————+
	//	LineToSketch
	// +———————————————————————————————————————+

	cidocs.LineToSketch = function( options ) {

		console.log("------------");
		console.log( "LINE TO SKETCH", cidocs.Path2dSketch.prototype );
		// LineToSketch.superclass.call( this, options );
		cidocs.Path2dSketch.call( this, options );

		this.name = "lineto";
		
	}

	cidocs.LineToSketch.prototype = {
		initialize: function( options ) {
			console.log( "LINE TO SKETCH INIT: superclass", this, this.superclass );
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updatePath();
		},
		drawInitialPath: function( ) {
			console.log( "DRAW INITIAL PATH" );

			// draw the initial path
			var curPaper = this.curPaper;
			console.log( "curPaper", this.curPaper );
			var path = new curPaper.Path();
				path.strokeColor = COLOR_LINE_TO;
				path.moveTo( new curPaper.Point(50.0, 50.0) );
				path.lineTo( new curPaper.Point(150.0, 150.0) );
				path.lineTo( new curPaper.Point(250.0, 50.0));
				path.lineTo( new curPaper.Point(350.0, 150.0) );
				path.lineTo( new curPaper.Point(450.0, 50.0) );
			this.paths.push( path );
		}
	};
	cidocs.LineToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	QuadToSketch
	// +———————————————————————————————————————+

	cidocs.QuadToSketch = function( options ) {

		console.log( "QUAD TO SKETCH", cidocs.Path2dSketch.prototype );
		cidocs.Path2dSketch.call( this, options );

		this.name = "quadto";
	}

	cidocs.QuadToSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			// this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// quadTo - waves
			var curPaper = this.curPaper;
			var waveWidth = 100.0;
			var path = new curPaper.Path();
			path.moveTo( new curPaper.Point(0.0, 50.0) );
			path.strokeColor = COLOR_QUAD_TO;
			for( var i = 0; i < 5; i++ ) {
				var startX = i * waveWidth;
				path.quadraticCurveTo( new curPaper.Point( startX, 0.0 ), new curPaper.Point( startX + waveWidth / 2.0, 0.0 ) );
				path.quadraticCurveTo( new curPaper.Point( startX + waveWidth / 2.0, 50.0 ), new curPaper.Point( startX + waveWidth, 50.0 ) );

			}
			this.paths.push( path );
		}
	};
	cidocs.QuadToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CubicToSketch
	// +———————————————————————————————————————+

	cidocs.CubicToSketch = function( options ) {

		console.log( "CUBIC TO SKETCH", cidocs.Path2dSketch.prototype );
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
			var waveWidth = 100.0;
			var path = new curPaper.Path();
			path.moveTo( new curPaper.Point(0.0, 50.0) );
			path.strokeColor = COLOR_CUBIC_TO;
			for( var i = 0; i < 5; i++ ) {
				var startX = i * waveWidth;
				path.quadraticCurveTo( new curPaper.Point( startX, 0.0 ), new curPaper.Point( startX + waveWidth / 2.0, 0.0 ) );
				path.quadraticCurveTo( new curPaper.Point( startX + waveWidth / 2.0, 50.0 ), new curPaper.Point( startX + waveWidth, 50.0 ) );

			}
			this.paths.push( path );
		}
	};
	cidocs.CubicToSketch.extend( cidocs.Path2dSketch );



	// +———————————————————————————————————————+
	//	Path2dCode     
	//	Code area that displays code for a path
	// +———————————————————————————————————————+

	cidocs.CodeModule = function() {

		this.div = null;

		this.init = function(){
			this.div = $( '#output' );
		};

		this.update = function( path ){

			var segments = path.segments;
			log( "segments", segments, segments.length );
			var p = "mPath";
			var code = "Path2d mPath;\n";

			for(var i=0; i<segments.length; i++){
				var segment = segments[i];
				// console.log( segment, segment.point);

				if( i === 0 ){
					code += "mPath.moveTo( Vec2f( " + segment.point.x + ", " + segment.point.y + " ) );\n";
				}else{
					code += "mPath.lineTo( Vec2f( " + segment.point.x + ", " + segment.point.y + " ) );\n";
				}

				// TODO: base the template for the line segment based on the segment type
			}

			code += "gl::draw( mPath );";
			// div.html( code );
			this.div.html( Prism.highlight( code, Prism.languages.cpp ) );

			log( code, Prism.highlight( code, Prism.languages.cpp ) );
		};

		this.init();
	};


	window.app = {

		sketches: [],

		codeModule: new cidocs.CodeModule(),

		init: function(){
			
			// init all the sketches
			var lineToSketch	= new cidocs.LineToSketch( { canvas:'#lineto', output:this.codeModule } );
			var quadToSketch	= new cidocs.QuadToSketch( { canvas:'#quadto', output:this.codeModule } );
			var cubicToSketch	= new cidocs.CubicToSketch( { canvas:'#cubicto', output:this.codeModule } );

			this.sketches.push( lineToSketch, quadToSketch, cubicToSketch );		
		}
	};

	this.show = function( moduleName ){
		console.log( "show", moduleName );

		// remove active from any active canvases
		var elements = document.querySelectorAll( "canvas" );
		Array.prototype.forEach.call(elements, function(el, i){
			removeClass( el, "active" );
		});

		/*_.each.call(  window.app.sketches, function(el, i){
			$( el, "active" );
		});*/


		// make the specified canvas active
		_.findWhere( window.app.sketches, {name:moduleName}).show();
	};

	function removeClass( el, className ){
		if (el.classList)
			el.classList.remove(className);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}


	
	

	$(document).ready( function(){
		
		window.app.init();

	});
	

}(jQuery, window));
