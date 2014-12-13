(function($, window) {
	
	var cidocs = {};

	// array of paper scope
	var papers = [];
	var COLOR_LINE_TO = '#00FF00';
	var COLOR_QUAD_TO = '#0000FF';
	var COLOR_CUBIC_TO = '#FF00FF';

	var SEGMENT_TYPES = [
		"MOVETO",
		"LINETO",
		"QUADTO",
		"CUBICTO"
	]
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


	Point = function( x, y ){
		return { 
		    x: x,
		    y: y
		};
	}

	// +———————————————————————————————————————+
	//	Path2d     
	//	wrap a paperjs path to perform more
	//	like a cinder path2d
	// +———————————————————————————————————————+

	cidocs.Path2d = function( paperScope ) {

		this.points		= [];	// to keep track of points
		this.segments	= [];	// to keep track of segment types
		this.ps = paperScope;

		this.path = new this.ps.Path();
		
	}

	cidocs.Path2d.prototype = {
		
		moveTo: function( point ) {

			var PaperPts = this.convertPoints( [point] );
			this.path.moveTo( PaperPts[0] );
			this.points.push( point );
			this.segments.push( SEGMENT_TYPES[0] );
		},

		lineTo: function( point ) {

			var PaperPts = this.convertPoints( [point] );
			this.path.lineTo( PaperPts[0] );
			this.points.push( point );
			this.segments.push( SEGMENT_TYPES[1] );
		},

		quadTo: function( handlePt, endPt ) {
			var PaperPts = this.convertPoints( [handlePt, endPt] );
			this.path.quadraticCurveTo( PaperPts[0], PaperPts[1] );
			this.points.push( handlePt, endPt );
			this.segments.push( SEGMENT_TYPES[2] );
		},

		cubicTo: function( handlePt1, handlePt2, endPt ) {

			var PaperPts = this.convertPoints( [handlePt1, handlePt2, endPt] );
			this.path.cubicCurveTo( PaperPts[0], PaperPts[1], PaperPts[2] );
			this.points.push( handlePt1, handlePt2, endPt );
			this.segments.push( SEGMENT_TYPES[3] );
		},

		convertPoints: function( points ){

			var paperPoints = [];
			var self = this;

			_.each( points, function( pt ){
				console.log( pt );
				paperPoints.push( new self.ps.Point( pt.x, pt.y ) );
			});

			return paperPoints;
		}

	}

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
			tolerance: 5
		};
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
            	// result.item._parent.selected = true;
            	result.item._parent.fullySelected = true;
            }
		},

		onToolMouseDown: function( event ) {

			this.selectedSegment = this.selectedPath = null;
			var hitResult = this.curPaper.project.hitTest( event.point, this.hitOptions );
			if( !hitResult )
				return;

			if( hitResult ) {
				this.selectedPath = hitResult.item;
				this.selectedPath.fullySelected = true;

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
			/*var curPaper = this.curPaper;
			console.log( "curPaper", this.curPaper );
			var path = new curPaper.Path();
				path.strokeColor = COLOR_LINE_TO;
				path.moveTo( new curPaper.Point(50.0, 50.0) );
				// this.moveTo( path, [ new curPaper.Point(50.0, 50.0) ] );
				path.lineTo( new curPaper.Point(150.0, 150.0) );
				path.lineTo( new curPaper.Point(250.0, 50.0));
				path.lineTo( new curPaper.Point(350.0, 150.0) );
				path.lineTo( new curPaper.Point(450.0, 50.0) );
			this.paths.push( path );*/

			
			// new Path2d wrapper
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.path.strokeColor = COLOR_LINE_TO;
			path2d.moveTo( Point( 50.0, 50.0 ) );
			path2d.lineTo( Point( 150.0, 150.0 ) );
			path2d.lineTo( Point( 250.0, 50.0 ) );
			path2d.lineTo( Point( 350.0, 150.0 ) );
			path2d.lineTo( Point( 450.0, 50.0 ) );
			this.paths.push( path2d.path );

			

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
			/*var path = new curPaper.Path();
			path.moveTo( new curPaper.Point(0.0, 50.0) );
			path.strokeColor = COLOR_QUAD_TO;
			for( var i = 0; i < 5; i++ ) {
				var startX = i * waveWidth;
				path.quadraticCurveTo( new curPaper.Point( startX, 0.0 ), new curPaper.Point( startX + waveWidth / 2.0, 0.0 ) );
				path.quadraticCurveTo( new curPaper.Point( startX + waveWidth / 2.0, 50.0 ), new curPaper.Point( startX + waveWidth, 50.0 ) );

			}
			this.paths.push( path );*/

			
			// Path2d wrapper
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.path.strokeColor = COLOR_QUAD_TO;
			path2d.moveTo( Point( 0.0, 50.0 ) );
				
			for( var i = 0; i < 5; i++ ) {
				var startX = i * waveWidth;
				path2d.quadTo( Point( startX, 0.0 ), Point( startX + waveWidth / 2.0, 0.0 ) );
				path2d.quadTo( Point( startX + waveWidth / 2.0, 50.0 ), Point( startX + waveWidth, 50.0 ) );
			}
			this.paths.push( path2d.path );
			console.log( "PATH", path2d.path );
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
			path.strokeColor = COLOR_CUBIC_TO;
			path.moveTo( new curPaper.Point( 50.0, 50.0 ) );
			path.cubicCurveTo( new curPaper.Point( 75.0, 50.0 ), new curPaper.Point( 100.0, 75.0 ), new curPaper.Point( 100.0, 100.0 ) );
			
			/*var path = new cidocs.Path2d( this.curPaper );
			path.moveTo( Point( 50.0, 50.0 ) );
			path.cubicTo( Point( 75.0, 50.0 ), Point( 100.0, 75.0 ), Point( 100.0, 100.0 ) );
			*/

			this.paths.push( path );
		}
	};
	cidocs.CubicToSketch.extend( cidocs.Path2dSketch );


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

			var leafGap = 10,
				leaf
			// var leafWidth = 100.0;
			var path = new curPaper.Path();
			path.strokeColor = COLOR_CUBIC_TO;
			path.moveTo( new curPaper.Point( 75.0, 140.0 ) );
			path.quadraticCurveTo( 	new curPaper.Point( 100.0, 140.0 ), 
									new curPaper.Point( 100.0, 100.0 ) );
			path.cubicCurveTo( 	new curPaper.Point( 40.0, 150.0 ), 	
								new curPaper.Point( 40.0, 40.0 ), 	
								new curPaper.Point( 100.0, 90.0 ) );
			path.cubicCurveTo( 	new curPaper.Point( 50.0, 30.0 ),
								new curPaper.Point( 160.0, 30.0 ),	
								new curPaper.Point( 110.0, 90.0 ) );
			path.cubicCurveTo( 	new curPaper.Point( 170.0, 40.0 ), 	
								new curPaper.Point( 170.0, 150.0 ), 	
								new curPaper.Point( 110.0, 100.0 ) );
			path.quadraticCurveTo( new curPaper.Point( 110.0, 140.0 ), new curPaper.Point( 135.0, 140.0 ) );
			path.lineTo( new curPaper.Point( 75.0, 140.0 ) );


			/*
			var path = new cidocs.Path2d( this.curPaper );
			path.moveTo( Point( 75.0, 140.0 ) );
			path.quadTo( Point( 100.0, 140.0 ), Point( 100.0, 100.0 ) );
			path.cubicTo( Point( 40.0, 150.0 ), Point( 40.0, 40.0 ), Point( 100.0, 90.0 ) );
			path.cubicTo( Point( 50.0, 30.0 ), Point( 160.0, 30.0 ), Point( 110.0, 90.0 ) );
			path.cubicTo( Point( 170.0, 40.0 ), Point( 170.0, 150.0 ), Point( 110.0, 100.0 ) );
			path.quadTo( Point( 110.0, 140.0 ), Point( 135.0, 140.0 ) );
			path.lineTo( Point( 75.0, 140.0 ) );*/


			this.paths.push( path );
		}
	};
	cidocs.CombinedSketch.extend( cidocs.Path2dSketch );



	// +———————————————————————————————————————+
	//	Path2dCode     
	//	Code area that displays code for a path
	// +———————————————————————————————————————+

	cidocs.CodeModule = function() {

		this.div = null;

		this.moveToTemplate = _.template( "mPath.moveTo( vec2( <%= pointX %>, <%= pointY %> ) );\n" );
		this.lineToTemplate = _.template( "mPath.lineTo( vec2( <%= pointX %>, <%= pointY %> ) );\n" );
		this.quadToTemplate = _.template( "mPath.quadTo( vec2( <%= h1x %>, <%= h1y %> ), vec2( <%= p2x %>, <%= p2y %> ) );\n" );
		this.curveToTemplate = _.template( "mPath.curveTo( vec2( <%= h1x %>, <%= h1y %> ), vec2( <%= h2x %>, <%= h2y %> ), vec2( <%= p2x %>, <%= p2y %> ) );\n" );
		// this.quadToTemplate = _.template( "mPath.quadTo( Vec2f( <%= pointX %>, <%= pointY %> ) );\n" );

		this.init = function(){
			this.div = $( '#output' );
		};

		this.update = function( path ){

			var segments = path.segments;
			log( "segments", segments, segments.length );
			var p = "mPath";
			var code = "Path2d mPath;\n";

			console.log( "CURVES",  path.curves );

			for(var i=0; i<segments.length; i++){
				var segment = segments[i];
				var hasHandleIn = ( segment.handleIn.x || segment.handleIn.y ) ? true : false;
				var hasHandleOut = ( segment.handleOut.x || segment.handleOut.y ) ? true: false;
				// console.log( "SEGMENT",  segment.toString(), hasHandleIn, hasHandleOut );
				

				var segmentType;

				if( i === 0 ) {
					code += this.moveToTemplate( { pointX: segment.point.x, pointY: segment.point.y } );
				} 

				if( segment.linear ) {
					code += this.lineToTemplate( { pointX: segment.point.x, pointY: segment.point.y } );
				} else if( hasHandleIn && hasHandleOut ) {
					segmentType = 3;
					code += this.curveToTemplate( { h1x: segment.handleIn.x, h1y: segment.handleIn.y, h2x: segment.handleOut.x, h2y: segment.handleOut.y, p2x: segment.point.x, p2y: segment.point.x } );
				} else if( hasHandleIn || hasHandleOut ) {
					segmentType = 2;
					var handle = ( hasHandleIn ) ? segment.handleIn : segment.handleOut;
					code += this.quadToTemplate( { h1x: handle.x, h1y: handle.y, p2x: segment.point.x, p2y: segment.point.x } );
				} 


				if( i === 0 ){
					
				}else{
					
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
			var combinedSketch	= new cidocs.CombinedSketch( { canvas:'#combined', output:this.codeModule } );

			this.sketches.push( lineToSketch, quadToSketch, cubicToSketch, combinedSketch );		
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
		// show("combined");

	});
	

}(jQuery, window));
