;(function($, window) {
		
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

	function Path2dSketch( options ) {

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
			tolerance: 5
		};

		this.initialize( options );
	}

	Path2dSketch.prototype = {

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
		},

		onToolMouseMove: function( event ) {

			curPaper.project.activeLayer.selected = false;
			if (event.item) {
				event.item.selected = true;
			}
		},

		onToolMouseDown: function( event ) {

			selectedSegment = selectedPath = null;
			var hitResult = curPaper.project.hitTest( event.point, hitOptions );
			if( !hitResult )
				return;

			if( hitResult ) {
				selectedPath = hitResult.item;
				if (hitResult.type == 'segment') {
					selectedSegment = hitResult.segment;
					console.log("SEGMENT");
				}
			}
			
			// var movePath = hitResult.type == 'fill';
			// if( movePath ) {
				// project.activeLayer.addChild( hitResult.item );
			// }
		},

		onToolMouseDrag: function( event ) {
			
			if( selectedSegment ) {
				segment.point = event.point;
			}

			// if( movePath ) {
			//	path.position += event.delta;
			// }

			this.output.update( path );
		},

		updatePath: function() {

			this.curPaper.view.draw();
			console.log( this.paths[0] );
			this.output.update( this.paths[0] );
		}
	};


	

	// +———————————————————————————————————————+
	//	LineToSketch
	// +———————————————————————————————————————+

	function LineToSketch( options ) {

		console.log("------------");
		console.log( "LINE TO SKETCH", Path2dSketch.prototype );
		// LineToSketch.superclass.call( this, options );
		Path2dSketch.call( this, options );

		this.name = "lineto";
		
	}

	LineToSketch.prototype = {
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
	LineToSketch.extend( Path2dSketch );


	// +———————————————————————————————————————+
	//	QuadToSketch
	// +———————————————————————————————————————+

	function QuadToSketch( options ) {

		console.log( "QUAD TO SKETCH", Path2dSketch.prototype );
		Path2dSketch.call( this, options );

		this.name = "quadto";
	}

	QuadToSketch.prototype = {

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
	QuadToSketch.extend( Path2dSketch );


	// +———————————————————————————————————————+
	//	CubicToSketch
	// +———————————————————————————————————————+

	function CubicToSketch( options ) {

		console.log( "CUBIC TO SKETCH", Path2dSketch.prototype );
		Path2dSketch.call( this, options );

		this.name = "cubicto";
	}

	CubicToSketch.prototype = {

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
	CubicToSketch.extend( Path2dSketch );



	// +———————————————————————————————————————+
	//	Path2dCode     
	//	Code area that displays code for a path
	// +———————————————————————————————————————+

	var CodeModule = function() {

	};


	window.app = {

		sketches: [],

		init: function(){
			
			// init all the sketches
			var lineToSketch	= new LineToSketch( { canvas:"#lineto", output:window.app.output } );
			var quadToSketch	= new QuadToSketch( { canvas:"#quadto", output:window.app.output } );
			var cubicToSketch	= new CubicToSketch( { canvas:"#cubicto", output:window.app.output } );
			// console.log("lineToSketch", lineToSketch.canvas );
			// sketches.push( lineToSketch );
		
		},

		output: {

			div: null,

			init: function(){
				div = $( '#output' );
				// div.html( Prism.highlight( "", Prism.languages.cpp ) );
			},

			update: function( path ){

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
				div.html( Prism.highlight( code, Prism.languages.cpp ) );

				log( code, Prism.highlight( code, Prism.languages.cpp ) );
			}
		}
	};

	this.show = function( moduleName ){
		console.log( "show", moduleName );

		// remove active from any active canvases
		var elements = document.querySelectorAll( "canvas" );
		Array.prototype.forEach.call(elements, function(el, i){
			removeClass( el, "active" );
		});

		// make the specified canvas active
		console.log( document.querySelectorAll('canvas#' + moduleName ) );
		$('canvas#' + moduleName).addClass( "active" );
	};

	function removeClass( el, className ){
		if (el.classList)
			el.classList.remove(className);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}


	
	

	$(document).ready( function(){

		// create the following interactive displays
		if( $( '#output' ).size() > 0 )		{ window.app.output.init(); }
		// if( $( '#quadto' ).size() > 0 )		{ window.app.quadto.init(); }
		// if( $( '#cubicto' ).size() > 0 )	{ window.app.cubicto.init(); }

		// ideal syntax
		// window.app.sketchLineTo( "#lineto" );
		window.app.init();

	});
	

}(jQuery, window));
