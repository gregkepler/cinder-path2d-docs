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

	window.Path2dSketch = function(){

	}

	Path2dSketch.extend = function( classVars ) {

		classVars || (classVars = {});

		var obj = function(options) {

	        this.initialize && this.initialize();
	    };

		obj.prototype = Object.create( Path2dSketch.prototype );
	    obj.prototype = _.extend(obj.prototype, classVars);
	    obj.prototype.constructor = obj;

	    return obj;
	}

	// +———————————————————————————————————————+
	// 	LineToSketch
	// +———————————————————————————————————————+

	window.LineToSketch = Path2dSketch.extend( {

		name: "lineto",

		initialize: function(){

			// draw path
			this.drawInitialPath();
		},

		drawInitialPath: function() {

		}

	} );

	

	// +———————————————————————————————————————+
	// 	Path2dCode     
	// 	Code area that displays code for a path
	// +———————————————————————————————————————+

	var CodeModule = function() {

	}


	
	window.app = {

		sketches: [],

		init: function(){
			
			// init all the sketches
			var lineToSketch = new LineToSketch( { canvas:"#lineto", output:"#output"} );
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
				}
				
				var segment, path;

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
				}

				tool.onMouseDrag = function(event) {

					log( "drag", segment, movePath );
					if (segment) {
						segment.point = event.point;
					}

					if (movePath){
						path.position += event.delta;
					}

					app.output.update( path );
				}

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
				}
			},

			init: function() {

				extend( app.cubicto.Sketch, Path2dSketch );
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

					if(i == 0){
						code += "mPath.moveTo( Vec2f( " + segment.point.x + ", " + segment.point.y + " ) );\n" 
					}else{
						code += "mPath.lineTo( Vec2f( " + segment.point.x + ", " + segment.point.y + " ) );\n" 
					}
				}

				code += "gl::draw( mPath );";
				// div.html( code );
				div.html( Prism.highlight( code, Prism.languages.cpp ) );

				log( code, Prism.highlight( code, Prism.languages.cpp ) );
			}
		}
	}

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
	}

	function removeClass( el, className ){
		if (el.classList)
		  el.classList.remove(className);
		else
		  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}


	function extend(ChildClass, ParentClass) {
		ChildClass.prototype = new ParentClass();
		ChildClass.prototype.constructor = ChildClass;
	}

	

	$(document).ready( function(){

		// create the following interactive displays
		if( $( '#output' ).size() > 0 ) 	{ window.app.output.init(); }
		if( $( '#lineto' ).size() > 0 ) 	{ window.app.lineto.init(); }
		if( $( '#quadto' ).size() > 0 ) 	{ window.app.quadto.init(); }	
		if( $( '#cubicto' ).size() > 0 ) 	{ window.app.cubicto.init(); }	

		// ideal syntax
		// window.app.sketchLineTo( "#lineto" );
		window.app.init();

	});
	

}(jQuery, window));
