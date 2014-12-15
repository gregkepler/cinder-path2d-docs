(function($, window) {
	
	var cidocs = {};

	// set paper scope
	paper.install( window );

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
		this.extras		= [];	// array of points, handles and lines
		this.ps = paperScope;

		this.path = new this.ps.Path();

		this.moveToTemplate = _.template( "mPath.moveTo( vec2( <%= pointX %>, <%= pointY %> ) );\n" );
		this.lineToTemplate = _.template( "mPath.lineTo( vec2( <%= pointX %>, <%= pointY %> ) );\n" );
		this.quadToTemplate = _.template( "mPath.quadTo( vec2( <%= h1x %>, <%= h1y %> ), vec2( <%= p2x %>, <%= p2y %> ) );\n" );
		this.curveToTemplate = _.template( "mPath.curveTo( vec2( <%= h1x %>, <%= h1y %> ), vec2( <%= h2x %>, <%= h2y %> ), vec2( <%= p2x %>, <%= p2y %> ) );\n" );
		
		this.ptRect = new Rectangle( new Point( -2, -2 ), new Size( 4, 4 ) );
	}

	cidocs.Path2d.prototype = {
		
		moveTo: function( point ) {

			var paperPts = this.convertPoints( [point] );
			this.path.moveTo( paperPts[0] );
			this.points.push( paperPts[0] );
			this.segments.push( SEGMENT_TYPES[0] );
		},

		lineTo: function( point ) {

			var paperPts = this.convertPoints( [point] );
			this.path.lineTo( paperPts[0] );
			this.points.push( paperPts[0] );
			this.segments.push( SEGMENT_TYPES[1] );
		},

		quadTo: function( handlePt, endPt ) {
			var paperPts = this.convertPoints( [handlePt, endPt] );
			this.path.quadraticCurveTo( paperPts[0], paperPts[1] );
			this.points.push( paperPts[0], paperPts[1] );
			this.segments.push( SEGMENT_TYPES[2] );
		},

		cubicTo: function( handlePt1, handlePt2, endPt ) {

			var paperPts = this.convertPoints( [handlePt1, handlePt2, endPt] );
			this.path.cubicCurveTo( paperPts[0], paperPts[1], paperPts[2] );
			this.points.push( paperPts[0], paperPts[1], paperPts[2] );
			this.segments.push( SEGMENT_TYPES[3] );
		},

		setPosition: function( pos ) {

			this.path.pivot = new this.ps.Point( 0, 0 );
			this.path.position = this.convertPoints( [pos] )[0];

			_.each( this.points, function( pt ) {
				pt.x += pos.x;
				pt.y += pos.y;
			} );
		},

		convertPoints: function( points ){

			var paperPoints = [];
			var self = this;

			_.each( points, function( pt ){
				paperPoints.push( new self.ps.Point( pt.x, pt.y ) );
			});

			return paperPoints;
		},

		getCinderPath: function() {

			var ptIndex = 0;
			var points = this.points;
			var code = "";
			var self = this;

			_.each( this.segments, function( segment ){
				switch( segment ) {
					
					case SEGMENT_TYPES[0]:
						code += self.moveToTemplate( { pointX: points[ptIndex].x, pointY: points[ptIndex].y } );
						ptIndex++;
						break;

					case SEGMENT_TYPES[1]:
						code += self.lineToTemplate( { pointX: points[ptIndex].x, pointY: points[ptIndex].y } );
						ptIndex++;
						break;

					case SEGMENT_TYPES[2]:
						code += self.quadToTemplate( { h1x: points[ptIndex].x, h1y: points[ptIndex].y, p2x: points[ptIndex+1].x, p2y: points[ptIndex+1].y } );
						ptIndex+=2;
						break;

					case SEGMENT_TYPES[3]:
						code += self.curveToTemplate( { h1x: points[ptIndex].x, h1y: points[ptIndex].y, h2x: points[ptIndex+1].x, h2y: points[ptIndex+1].y, p2x: points[ptIndex+2].x, p2y:points[ptIndex+2].y } );
						ptIndex+=3;
						break;
				}
			} );

			// console.log( "getCinderPath", code);
			return code;
		},

		drawHandles: function() {
			
			this.extras = [];
			var ptIndex = 0;
			var points = this.points;
			var self = this;

			// for each segment in the path, draw the 
			// point, a handles (if they exist), and 
			// lines between points and handles
			_.each( this.segments, function( segment ) {
				// var point = new Rectangle( new Point( segment ) );
				switch( segment ) {
					
					case SEGMENT_TYPES[0]:
						
						var pt = new Shape.Rectangle( self.ptRect );
						pt.translate( points[ptIndex] );
						pt.strokeColor = 'blue';
						ptIndex++;
						break;

					case SEGMENT_TYPES[1]:
						var pt = new Shape.Rectangle( self.ptRect );
						pt.translate( points[ptIndex] );
						pt.strokeColor = 'blue';
						ptIndex++;
						break;

					case SEGMENT_TYPES[2]:
						var pt = new Shape.Rectangle( self.ptRect );
						pt.translate( points[ptIndex+1] );
						pt.strokeColor = 'blue';

						var h1 = new Shape.Rectangle( self.ptRect );
						h1.translate( points[ptIndex] );
						h1.strokeColor = 'cyan';

						var l1 = new Path.Line(points[ptIndex], points[ptIndex+1]);
						var l2 = new Path.Line(points[ptIndex], points[ptIndex-1]);
						l1.strokeColor = 'cyan';
						l2.strokeColor = 'cyan';

						ptIndex+=2;
						break;

					case SEGMENT_TYPES[3]:
						var pt = new Shape.Rectangle( self.ptRect );
						pt.translate( points[ptIndex+2] );
						pt.strokeColor = 'blue';

						var h1 = new Shape.Rectangle( self.ptRect );
						h1.translate( points[ptIndex] );
						h1.strokeColor = 'cyan';

						var h2 = new Shape.Rectangle( self.ptRect );
						h2.translate( points[ptIndex+1] );
						h2.strokeColor = 'cyan';
						
						var l1 = new Path.Line(points[ptIndex-1], points[ptIndex]);
						var l2 = new Path.Line(points[ptIndex+1], points[ptIndex+2]);
						l1.strokeColor = 'cyan';
						l2.strokeColor = 'cyan';

						ptIndex+=3;
						break;
				}
			} );
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

				// console.log( hitResult);
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
			path2d.path.strokeColor = COLOR_LINE_TO;
			path2d.moveTo( Point( 50.0, 50.0 ) );
			path2d.lineTo( Point( 150.0, 150.0 ) );
			path2d.lineTo( Point( 250.0, 50.0 ) );
			path2d.lineTo( Point( 350.0, 150.0 ) );
			path2d.lineTo( Point( 450.0, 50.0 ) );
			this.paths.push( path2d );

			path2d.drawHandles();
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
			// this.updatePath();
		},

		drawInitialPath: function( ) {
			
			// quadTo - waves
			var curPaper = this.curPaper;
			var waveWidth = 100.0;
			
			// Path2d wrapper
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.path.strokeColor = COLOR_QUAD_TO;
			path2d.moveTo( Point( 0.0, 50.0 ) );
				
			for( var i = 0; i < 3; i++ ) {
				var startX = i * waveWidth;
				path2d.quadTo( Point( startX, 0.0 ), Point( startX + waveWidth / 2.0, 0.0 ) );
				path2d.quadTo( Point( startX + waveWidth / 2.0, 50.0 ), Point( startX + waveWidth, 50.0 ) );
			}
			
			// path2d.path.translate( new curPaper.Point( 100, 100 ) );
			// path2d.path.pivot = new curPaper.Point( 0, 0 );
			// path2d.path.position = new curPaper.Point( 100, 100 );
			// console.log("path pos", path2d.path);
			path2d.setPosition( Point( 100, 100 ) );
			this.paths.push( path2d );

			path2d.drawHandles();
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
			path2d.path.strokeColor = COLOR_CUBIC_TO;
			path2d.moveTo( Point( 50.0, 50.0 ) );
			path2d.cubicTo( Point( 75.0, 50.0 ), Point( 100.0, 75.0 ), Point( 100.0, 100.0 ) );
			path2d.cubicTo( Point( 100.0, 175.0 ), Point( 200.0, 175.0 ), Point( 200.0, 100.0 ) );
			path2d.cubicTo( Point( 200.0, 75.0 ), Point( 225.0, 50.0 ), Point( 250.0, 50.0 ) );
			this.paths.push( path2d );

			path2d.drawHandles();
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
			
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.path.strokeColor = COLOR_CUBIC_TO;
			path2d.moveTo( Point( 75.0, 140.0 ) );
			path2d.quadTo( Point( 100.0, 140.0 ), Point( 100.0, 100.0 ) );
			path2d.cubicTo( Point( 40.0, 150.0 ), Point( 40.0, 40.0 ), Point( 100.0, 90.0 ) );
			path2d.cubicTo( Point( 50.0, 30.0 ), Point( 160.0, 30.0 ), Point( 110.0, 90.0 ) );
			path2d.cubicTo( Point( 170.0, 40.0 ), Point( 170.0, 150.0 ), Point( 110.0, 100.0 ) );
			path2d.quadTo( Point( 110.0, 140.0 ), Point( 135.0, 140.0 ) );
			path2d.lineTo( Point( 75.0, 140.0 ) );
			this.paths.push( path2d );

			path2d.drawHandles();
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
			code += path.getCinderPath();
			/*// console.log( "CURVES",  path.curves );

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

				// TODO: base the template for the line segment based on the segment type
			}*/

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
