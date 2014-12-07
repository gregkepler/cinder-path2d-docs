;(function($, window) {
		
	// array of paper scope
	var papers = [];
	var COLOR_LINE_TO = '#00FF00';
	var COLOR_QUAD_TO = '#0000FF';
	var COLOR_CUBIC_TO = '#FFFF00';
	// var paper = window.paper;
// console.log(paper);
	

	// +———————————————————————————————————————+
	// 	Path2dSketch     
	// 	all sketches should extend this
	// +———————————————————————————————————————+
/*
	var Path2dSketch = function( _canvas, _output ) {

		this.canvas = _canvas;
		this.output = _output;
		this.paths = [];
		this.curPaper;
		this.tool;
		this.selectedSegment;
		this.selectedPath;
		this.selectedPoint;

		this.hitOptions = {
			segments: true,
			stroke: true,
			fill: true,
			tolerance: 5
		};

		function init(  ){

			this.curPaper = new paper.PaperScope();
			this.curPaper.setup( this.canvas );
			log( this );
			this.papers.push( this.curPaper );

			this.tool = new curPaper.Tool();
			this.tool.onMouseMove = onToolMouseMove;
			this.tool.onMouseDown = onToolMouseDown;
			// this.output.update( this.path );
		}

		function onToolMouseMove( event ) {

			curPaper.project.activeLayer.selected = false;
			if (event.item) {
				event.item.selected = true;
			}
		}

		function onToolMouseDown( event ) {

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
		}

		function onToolMouseDrag( event ) {
			
			if( selectedSegment ) {
				segment.point = event.point;
			}

			// if( movePath ) {
			// 	path.position += event.delta;
			// }

			this.output.update( path );
		}

		init.apply( this );
		log( "this", this );
	}

	Path2dSketch.prototype.updatePath = function() {

		this.curPaper.draw();
		this.output.update( path );
	}

	Path2dSketch.prototype.extend = function( classVars ) {

		classVars || (classVars = {});

		var obj = function(options) {

			this.initialize && this.initialize();
		};

		obj.prototype = Object.create( Path2dSketch.prototype );
		obj.prototype = _.extend(obj.prototype, classVars);
		obj.prototype.constructor = obj;

		return obj;
	}
*/

	/*window.Path2dSketch = function(){

		this.canvas = null;
		this.output = null;
		this.paths = [];
		this.curPaper = null;
		this.tool = null;
		this.selectedSegment = null;
		this.selectedPath = null;
		this.selectedPoint = null;

	};*/


	// extending classes
	/*function surrogateCtor() {}
	function extend(base, sub) {
		surrogateCtor.prototype = base.prototype;
		sub.prototype = new surrogateCtor();
		sub.prototype.constructor = sub;
		sub.superclass = base;
	}*/

	//
	// from http://codepen.io/MyHatIsAwesome/pen/DaptL
	// Function.extend( base )
	// sets up inheritance between two constructor functions
	// without needing to instantiate the base constructor
	//
	Function.prototype.extend = function( base )
	{
	  // Define a surrogate constructor for base
	  var Temp = function(){}
	  Temp.prototype = base.prototype

	  // instantiate the surrogate
	  var t = new Temp()
	  t.constructor = this

	  // copy subclass prototype into surrogate object
	  for( key in this.prototype )
	    t[key] = this.prototype[key]

	  // set subclass prototype as the surrogate object
	  this.prototype = t

	  // this.prototype.superclass = base;
	  this.prototype.superclass = base.prototype;
	  // console.log( "SUPERCLASS", this, this.superclass );
	}


	function Path2dSketch( options ) {

		this.canvas = null;
		this.output = null;
		this.paths = [];
		this.curPaper = null;
		this.tool = null;
		this.selectedSegment = null;
		this.selectedPath = null;
		this.selectedPoint = null;

		console.log( "Path2dSketch", this.prototype, options );
		// how to call a function from constructor which doesn't exist yet\

		/*this.initialize = function( opts ) {

			console.log( "Path2dSketch INIT" );
			var options = opts || {};

			this.canvas = options.canvas;
			this.output = options.output;

			var paperScope = new paper.PaperScope();
			paperScope.setup( $( options.canvas )[0]);
			this.curPaper = paperScope;
			this.paths.push( paperScope );
		};*/

		this.initialize( options );
	}

	Path2dSketch.prototype = {

		initialize: function( opts ) {

			console.log( "PATH2DSKETCH INITIALIZE" );

			var options = opts || {};

			console.log( "options", options );
			this.canvas = options.canvas;
			this.output = options.output;

			var paperScope = new paper.PaperScope();
			paperScope.setup( $( options.canvas )[0]);
			this.curPaper = paperScope;
			console.log( "paths", this, this.paths, paperScope );
			this.paths.push( paperScope );
		}
	};

	// Path2dSketch.prototype.canvas = null;
	// Path2dSketch.prototype.paths = [];

	/*window.Path2dSketch = function() {

		return {

			canvas: null,
			output: null,
			paths: []
		};

	};*/



	// window.Path2dSketch.initialize = function( opts ) {
	/*Path2dSketch.prototype.initialize = function( opts ) {

		var options = opts || {};

		console.log( "options", options );
		this.canvas = options.canvas;
		this.output = options.output;

		var paperScope = new paper.PaperScope();
		paperScope.setup( $( options.canvas )[0]);
		this.curPaper = paperScope;
		console.log( "paths", this, this.paths, paperScope );
		this.paths.push( paperScope );
	};*/

	/*// window.Path2dSketch.extend = function( vars ) {
	Path2dSketch.prototype.extend = function( vars ) {

		var classVars = vars || {};

		var obj = function( options ) {

			this.initialize( options );
		};

		console.log( "OBJ PROTOTYPE", Path2dSketch.prototype, this );
		obj.prototype = Object.create( Path2dSketch.prototype );
		obj.prototype = _.extend( obj.prototype, classVars );
		obj.prototype.constructor = obj;

		return obj;
	};*/


	


	// +———————————————————————————————————————+
	//	LineToSketch
	// +———————————————————————————————————————+

	function LineToSketch( options ) {

		console.log("------------");
		console.log( "LINE TO SKETCH", Path2dSketch.prototype );
		// LineToSketch.superclass.call( this, options );
		Path2dSketch.call( this, options );

		

		this.name = "lineto";

		/*this.initialize = function( options ){

			console.log( "LINE TO SKETCH INIT" );
			// super
			Path2dSketch.prototype.initialize.call( this, options );
			// Path2dSketch.call( this, options );

			// draw path
			this.drawInitialPath();
		};*/

		/*this.drawInitialPath = function() {
			console.log( "DRAW INITIAL PATH" );

			// draw the initial path
			var curPaper = this.curPaper;
			console.log( "curPaper", curPaper );
			var path = new curPaper.Path();
				path.strokeColor = COLOR_LINE_TO;
				path.moveTo( new curPaper.Point(50.0, 50.0) );
				path.lineTo( new curPaper.Point(150.0, 150.0) );
				path.lineTo( new curPaper.Point(250.0, 50.0));
				path.lineTo( new curPaper.Point(350.0, 150.0) );
				path.lineTo( new curPaper.Point(450.0, 50.0) );
			
		};*/
		// console.log( " ", this );
		// this.initialize();
		
	}
	// this needs to come before new prototype functions are added
	// extend( Path2dSketch, LineToSketch );
	

	LineToSketch.prototype = {
		initialize: function( options ) {
		console.log( "LINE TO SKETCH INIT: superclass", this, this.superclass );
		this.superclass.initialize.call( this, options );
		this.drawInitialPath();
	},
	drawInitialPath: function( ) {
			console.log( "DRAW INITIAL PATH" );

			// draw the initial path
			var curPaper = this.curPaper;
			console.log( "curPaper", curPaper );
			var path = new curPaper.Path();
				path.strokeColor = COLOR_LINE_TO;
				path.moveTo( new curPaper.Point(50.0, 50.0) );
				path.lineTo( new curPaper.Point(150.0, 150.0) );
				path.lineTo( new curPaper.Point(250.0, 50.0));
				path.lineTo( new curPaper.Point(350.0, 150.0) );
				path.lineTo( new curPaper.Point(450.0, 50.0) );
		}
	};
	LineToSketch.extend( Path2dSketch );



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
			var lineToSketch = new LineToSketch( { canvas:"#lineto", output:"#output"} );
			// console.log("lineToSketch", lineToSketch.canvas );
			// sketches.push( lineToSketch );
		
		},

		lineto: {
			
			canvas: null,
			paperScope: null,
			tool: null,
			init: function(){

				var curPaper = new paper.PaperScope();
				curPaper.setup($('#lineto')[0]);
				papers.push( curPaper );

				// draw the initial path
				var path = new curPaper.Path();
					path.strokeColor = COLOR_LINE_TO;
					path.moveTo( new curPaper.Point(50.0, 50.0) );
					path.lineTo( new curPaper.Point(150.0, 150.0) );
					path.lineTo( new curPaper.Point(250.0, 50.0));
					path.lineTo( new curPaper.Point(350.0, 150.0) );
					path.lineTo( new curPaper.Point(450.0, 50.0) );
				curPaper.view.draw();
				
				tool = new curPaper.Tool();
				tool.onMouseMove = function(event) {
					curPaper.project.activeLayer.selected = false;
					// log("item", event);
					if (event.item) {
						// log("select item");
						event.item.selected = true;

					}
				};
				
				var segment;

				var hitOptions = {
					segments: true,
					stroke: true,
					fill: true,
					tolerance: 5
				};

				tool.onMouseDown = function(event) {
					segment = path = null;
					var hitResult = curPaper.project.hitTest(event.point, hitOptions);
					if (!hitResult)
						return;

					if (hitResult) {
						path = hitResult.item;
						if (hitResult.type == 'segment') {
							segment = hitResult.segment;
							console.log("SEGMENT");
						}
					}
					movePath = hitResult.type == 'fill';
					if (movePath)
						project.activeLayer.addChild(hitResult.item);
				};

				tool.onMouseDrag = function(event) {

					log( "drag", segment, movePath );
					if (segment) {
						segment.point = event.point;
					}

					if (movePath){
						path.position += event.delta;
					}

					app.output.update( path );
				};

				app.output.update( path );
			}
		},

		quadto: {

			div: null,

			canvas: null,

			init: function(){
				
				var curPaper = new paper.PaperScope();
				curPaper.setup($('#quadto')[0]);
				papers.push( curPaper );

				
				var path = new curPaper.Path();

				/*path.strokeColor = '#ff0000';
				path.moveTo( new curPaper.Point(50.0, 50.0) );
				path.lineTo( new curPaper.Point(150.0, 150.0) );
				path.lineTo( new curPaper.Point(250.0, 50.0));
				path.lineTo( new curPaper.Point(350.0, 150.0) );
				path.lineTo( new curPaper.Point(450.0, 50.0) );
				curPaper.view.draw();*/


				// quadTo - waves
				var waveWidth = 100.0;
				path.moveTo( new curPaper.Point(0.0, 50.0) );
				path.strokeColor = COLOR_QUAD_TO;
				for( var i = 0; i < 5; i++ ) {
					var startX = i * waveWidth;
					path.quadraticCurveTo( new curPaper.Point( startX, 0.0 ), new curPaper.Point( startX + waveWidth / 2.0, 0.0 ) );
					path.quadraticCurveTo( new curPaper.Point( startX + waveWidth / 2.0, 50.0 ), new curPaper.Point( startX + waveWidth, 50.0 ) );

				}
				curPaper.view.draw();
			}
		},

		cubicto: {

			sketch: null,

			Sketch: function(){

				this.drawPath = function(){
					log( "DRAW CUBIC TO");
				};
			},

			init: function() {

				// extend( app.cubicto.Sketch, Path2dSketch );
				var sketch = new app.cubicto.Sketch( $('#cubicto')[0], output  );
				
				// var sketch = _.extend( Path2dSketch, {} );
				// sketch.init( $('#cubicto')[0] );
				// log( "extended sketch", sketch );
				// var sketch = new Path2dSketch( $('#cubicto')[0], output );

				// sketch.drawInitialPath = function(){

				// 	console.log( this );
				// 	var path = new this.curPaper.Path();
				// 		path.strokeColor = COLOR_LINE_TO;
				// 		path.moveTo( new curPaper.Point(50.0, 50.0) );
				// 		path.lineTo( new curPaper.Point(150.0, 150.0) );
				// 		path.lineTo( new curPaper.Point(250.0, 50.0));
				// 		path.lineTo( new curPaper.Point(350.0, 150.0) );
				// 		path.lineTo( new curPaper.Point(450.0, 50.0) );
				// 	this.curPaper.view.draw();
				// 	this.updatePath();
				// }

				// sketch.drawInitialPath();

				/*sketch.drawInitialPath() {
					// draw the initial path
					
				}*/

			}


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
		if( $( '#lineto' ).size() > 0 )		{ window.app.lineto.init(); }
		if( $( '#quadto' ).size() > 0 )		{ window.app.quadto.init(); }
		if( $( '#cubicto' ).size() > 0 )	{ window.app.cubicto.init(); }

		// ideal syntax
		// window.app.sketchLineTo( "#lineto" );
		window.app.init();

	});
	

}(jQuery, window));
