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


	/*Point = function( x, y ){
		return { 
		    x: x,
		    y: y
		};
	}*/

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

		this.path = new Path();

		this.moveToTemplate = _.template( "mPath.moveTo( vec2( <%- pointX %>f, <%- pointY %>f ) );\n" );
		this.lineToTemplate = _.template( "mPath.lineTo( vec2( <%= pointX %>f, <%= pointY %>f ) );\n" );
		this.quadToTemplate = _.template( "mPath.quadTo( vec2( <%= h1x %>f, <%= h1y %>f ), vec2( <%= p2x %>f, <%= p2y %>f ) );\n" );
		this.curveToTemplate = _.template( "mPath.curveTo( vec2( <%= h1x %>f, <%= h1y %>f ), vec2( <%= h2x %>f, <%= h2y %>f ), vec2( <%= p2x %>f, <%= p2y %>f ) );\n" );
		
		this.ptRect = new Rectangle( new Point( -2, -2 ), new Size( 4, 4 ) );
		// this.ptRect = new Rectangle( new Point( -4, -4 ), new Size( 8, 8 ) );
	}

	cidocs.Path2d.prototype = {
		
		moveTo: function( point ) {

			// var paperPts = this.convertPoints( [point] );

			// this.path.moveTo( paperPts[0] );

			console.log( "point", point );

			var pt = new Shape.Rectangle( this.ptRect );
			pt.translate( point );
			pt.strokeColor = 'blue';

			this.points.push( pt );
			this.segments.push( SEGMENT_TYPES[0] );
			this.drawPath();
			// console.log( "SCOPE", pt.position );
		},

		lineTo: function( point ) {

			/*var paperPts = this.convertPoints( [point] );
			this.path.lineTo( paperPts[0] );
			this.points.push( paperPts[0] );
			this.segments.push( SEGMENT_TYPES[1] );*/

			var pt = new Shape.Rectangle( this.ptRect );
			pt.translate( point );
			pt.strokeColor = 'blue';
			this.points.push( pt );
			this.segments.push( SEGMENT_TYPES[1] );
			this.drawPath();
			// console.log( "SCOPE", this.ps );
		},

		quadTo: function( handlePt, endPt ) {
			/*var paperPts = this.convertPoints( [handlePt, endPt] );
			this.path.quadraticCurveTo( paperPts[0], paperPts[1] );
			this.points.push( paperPts[0], paperPts[1] );
			this.segments.push( SEGMENT_TYPES[2] );*/


			var h1 = new Shape.Rectangle( this.ptRect );
			h1.translate( handlePt );
			h1.strokeColor = 'cyan';

			var pt = new Shape.Rectangle( this.ptRect );
			pt.translate( endPt );
			pt.strokeColor = 'blue';

			this.points.push( h1, pt );
			this.segments.push( SEGMENT_TYPES[2] );
			this.drawPath();
		},

		cubicTo: function( handlePt1, handlePt2, endPt ) {

			/*var paperPts = this.convertPoints( [handlePt1, handlePt2, endPt] );
			this.path.cubicCurveTo( paperPts[0], paperPts[1], paperPts[2] );
			this.points.push( paperPts[0], paperPts[1], paperPts[2] );
			this.segments.push( SEGMENT_TYPES[3] );*/


			var h1 = new Shape.Rectangle( this.ptRect );
			h1.translate( handlePt1 );
			h1.strokeColor = 'cyan';

			var h2 = new Shape.Rectangle( this.ptRect );
			h2.translate( handlePt2 );
			h2.strokeColor = 'cyan';

			var pt = new Shape.Rectangle( this.ptRect );
			pt.translate( endPt );
			pt.strokeColor = 'blue';

			this.points.push( h1, h2, pt );
			this.segments.push( SEGMENT_TYPES[3] );
			this.drawPath();
		},

		setPosition: function( pos ) {

			this.path.pivot = new this.ps.Point( 0, 0 );
			this.path.position = pos;

			_.each( this.points, function( pt ) {
				console.log( "SET POS", pt.position );
				pt.position.x += pos.x;
				pt.position.y += pos.y;
			} );

			this.drawPath();
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
						code += self.moveToTemplate( { pointX: points[ptIndex].position.x, pointY: points[ptIndex].position.y } );
						ptIndex++;
						break;

					case SEGMENT_TYPES[1]:
						code += self.lineToTemplate( { pointX: points[ptIndex].position.x, pointY: points[ptIndex].position.y } );
						ptIndex++;
						break;

					case SEGMENT_TYPES[2]:
						code += self.quadToTemplate( { h1x: points[ptIndex].position.x, h1y: points[ptIndex].position.y, 
														p2x: points[ptIndex+1].position.x, p2y: points[ptIndex+1].position.y } );
						ptIndex+=2;
						break;

					case SEGMENT_TYPES[3]:
						code += self.curveToTemplate( { h1x: points[ptIndex].position.x, h1y: points[ptIndex].position.y, 
														h2x: points[ptIndex+1].position.x, h2y: points[ptIndex+1].position.y, 
														p2x: points[ptIndex+2].position.x, p2y:points[ptIndex+2].position.y } );
						ptIndex+=3;
						break;
				}
			} );

			// console.log( "getCinderPath", code);
			return code;
		},

		drawHandles: function( segmentType ) {
			
			console.log( "DRAW HANDLES" );
			this.extras = [];
			var ptIndex = 0;
			var points = this.points;
			var self = this;

			// for each segment in the path, draw the 
			// point, a handles (if they exist), and 
			// lines between points and handles
			_.each( this.segments, function( segment ) {
				// var point = new Rectangle( new Point( segment ) );

				console.log("SEGMENT", segment);

				switch( segment ) {
					
					case SEGMENT_TYPES[0]:
						
						var pt = new Shape.Rectangle( self.ptRect );
						pt.translate( points[ptIndex].position.x, points[ptIndex].position.y );
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
			
			// make all of the extras selectable

		},

		handlesOn: function() {
			_.each( this.points, function( point ) {
				point.visible = true;
			} );

			_.each( this.extras, function( extra ) {
				extra.visible = true;
			} );
		},

		handlesOff: function() {
			_.each( this.points, function( point ) {
				point.visible = false;
			} );
			_.each( this.extras, function( extra ) {
				extra.visible = false;
			} );

		},

		drawPath: function() {

			// redraw the path using the original directions
			var ptIndex = 0;
			var points = this.points;
			var segments = this.segments;
			var self = this;

			// reset the path and send to below the points
			this.path.remove();
			this.path = new Path();
			this.path.sendToBack();

			// lines between handles and points
			_.each( this.extras, function( extra ) {
				extra.remove();
			});
			this.extras = [];


			_.each( segments, function( segment ){
				switch( segment ) {
					
					case SEGMENT_TYPES[0]:
						// console.log( "MOVE TO", points[ptIndex].position.x, points[ptIndex].position.y );
						// self.moveTo( points[ptIndex] );
						// var pt = new paper.Point( points[ptIndex].position.x, points[ptIndex].position.y );

						self.path.strokeColor = COLOR_LINE_TO;
						self.path.moveTo( new Point( points[ptIndex].position ) );
						ptIndex++;
						break;

					case SEGMENT_TYPES[1]:
						// console.log( "LINE TO", points[ptIndex].position.x, points[ptIndex].position.y );
						// self.lineTo( points[ptIndex] );
						self.path.strokeColor = COLOR_LINE_TO;
						self.path.lineTo( new Point( points[ptIndex].position ) );
						ptIndex++;
						break;

					case SEGMENT_TYPES[2]:

						var l1 = new Path.Line( new Point( points[ptIndex].position ), new Point( points[ptIndex + 1].position ) );
						var l2 = new Path.Line( new Point( points[ptIndex].position ), new Point( points[ptIndex - 1].position ) );
						l1.strokeColor = 'cyan';
						l2.strokeColor = 'cyan';
						l1.sendToBack();
						l2.sendToBack();
						self.extras.push( l1, l2 );

						// self.quadTo(points[ptIndex], points[ptIndex+1] );
						self.path.strokeColor = COLOR_QUAD_TO;
						self.path.quadraticCurveTo(
							new Point( points[ptIndex].position ),
							new Point( points[ptIndex + 1].position )
						);

						

						ptIndex+=2;
						break;

					case SEGMENT_TYPES[3]:

						var l1 = new Path.Line( new Point( points[ptIndex - 1].position ), new Point( points[ptIndex].position ) );
						var l2 = new Path.Line( new Point( points[ptIndex + 1].position ), new Point( points[ptIndex + 2].position ) );
						l1.strokeColor = 'cyan';
						l2.strokeColor = 'cyan';
						l1.sendToBack();
						l2.sendToBack();
						self.extras.push( l1, l2 );

						self.path.strokeColor = COLOR_CUBIC_TO;
						// self.curveTo( points[ptIndex], points[ptIndex+1], points[ptIndex+2] );
						self.path.cubicCurveTo(
							new Point( points[ptIndex].position ),
							new Point( points[ptIndex + 1].position ),
							new Point( points[ptIndex + 2].position )
						);
						ptIndex+=3;
						break;
				}
			} );

			console.log( "PATH", this.path );
			
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
		this.handlesOn = true;

		this.initialize( options );

		var test = "test";
	}

	cidocs.Path2dSketch.prototype = {

		initialize: function( opts ) {

			var options = opts || {};

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

			/*var result = this.curPaper.project.hitTest( event.point, this.hitOptions );
			console.log( result );
            if( result ) {
            	// if( result == this)
            	// result.item._parent.selected = true;
            	result.item._parent.fullySelected = true;
            }*/

            var hitResult = this.curPaper.project.hitTest( event.point, this.hitOptions );
			if( hitResult && hitResult.item.type === 'rectangle') {
				hitResult.item.fullySelected = true;
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
				/*if (hitResult.type == 'segment') {
					this.selectedSegment = hitResult.segment;
				}*/

				if (hitResult.item.type === 'rectangle') {
					console.log( "DOWN", hitResult.item.position );
					this.selectedPoint = hitResult.item;
				}

			}
			
			// this.movePath = hitResult.type == 'fill';
			// if( this.movePath ) {
				// project.activeLayer.addChild( hitResult.item );
			// }
		},

		onToolMouseDrag: function( event ) {
			
			/*if( this.selectedSegment ) {
				this.selectedSegment.point = event.point;
			}*/

			if( this.selectedPoint ) {
				this.selectedPoint.position = event.point;
				console.log( "DRAG", this.selectedPoint.position.x, this.selectedPoint.position.y );
				// console.log( this.selectedPoint.position );
				this.paths[0].drawPath();	
				this.updatePath();
			}

			// if( this.movePath ) {
				// this.selectedPath.position += event.delta;
			// }
			

		},

		updatePath: function() {

			this.curPaper.view.draw();
			
			console.log( this.curPaper.view );
			this.output.update( this.paths[0] );
		},

		toggleHandles: function() {

			this.handlesOn = !this.handlesOn;

			if( this.handlesOn ){
				_.each( this.paths, function( path ) {
					path.handlesOn();
				} );
			} else {
				_.each( this.paths, function( path ) {
					path.handlesOff();
				} );
			}

			this.updatePath();
		},

		show: function() {
			$(this.canvas).addClass( "active" );
			this.updatePath();

			console.log("BUTTON", $("#handle-toggle"));
			_.bindAll( this, 'toggleHandles' );
			$("#handle-toggle").click( $.proxy( this.toggleHandles, this) );

		},

		hide: function() {

			console.log( "HIDE" );
			$(this.canvas).removeClass( "active" );
			$("#handle-toggle").unbind('click')
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
			
			console.log( "DRAW LINE PATH" );
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			// path2d.path.strokeColor = COLOR_LINE_TO;
			path2d.moveTo( new Point( 50.0, 50.0 ) );
			
			// var rect = new Rectangle( new Point( -4, -4 ), new Size( 8, 8 ) );
			// var pt = new Shape.Rectangle( rect );
			// pt.translate( new Point( 50.0, 50.0 ) );
			// pt.strokeColor = 'blue';

			path2d.lineTo( new Point( 150.0, 150.0 ) );
			path2d.lineTo( new Point( 250.0, 50.0 ) );
			path2d.lineTo( new Point( 350.0, 150.0 ) );
			path2d.lineTo( new Point( 450.0, 50.0 ) );

			

			this.paths.push( path2d );

			// path2d.drawHandles();
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
			// path2d.path.strokeColor = COLOR_QUAD_TO;
			path2d.moveTo( new Point( 0.0, 50.0 ) );
				
			for( var i = 0; i < 3; i++ ) {
				var startX = i * waveWidth;
				path2d.quadTo( new Point( startX, 0.0 ), new Point( startX + waveWidth / 2.0, 0.0 ) );
				path2d.quadTo( new Point( startX + waveWidth / 2.0, 50.0 ), new Point( startX + waveWidth, 50.0 ) );
			}
			
			// path2d.path.translate( new curPaper.Point( 100, 100 ) );
			// path2d.path.pivot = new curPaper.Point( 0, 0 );
			// path2d.path.position = new curPaper.Point( 100, 100 );
			// console.log("path pos", path2d.path);
			path2d.setPosition( new Point( 100, 100 ) );
			this.paths.push( path2d );

			// path2d.drawHandles();
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
			// path2d.path.strokeColor = COLOR_CUBIC_TO;
			path2d.moveTo( new Point( 50.0, 50.0 ) );
			path2d.cubicTo( new Point( 75.0, 50.0 ), new Point( 100.0, 75.0 ), new Point( 100.0, 100.0 ) );
			path2d.cubicTo( new Point( 100.0, 175.0 ), new Point( 200.0, 175.0 ), new Point( 200.0, 100.0 ) );
			path2d.cubicTo( new Point( 200.0, 75.0 ), new Point( 225.0, 50.0 ), new Point( 250.0, 50.0 ) );
			this.paths.push( path2d );

			// path2d.drawHandles();
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
			// path2d.path.strokeColor = COLOR_CUBIC_TO;
			path2d.moveTo( new Point( 75.0, 140.0 ) );
			path2d.quadTo( new Point( 100.0, 140.0 ), new Point( 100.0, 100.0 ) );
			path2d.cubicTo( new Point( 40.0, 150.0 ), new Point( 40.0, 40.0 ), new Point( 100.0, 90.0 ) );
			path2d.cubicTo( new Point( 50.0, 30.0 ), new Point( 160.0, 30.0 ), new Point( 110.0, 90.0 ) );
			path2d.cubicTo( new Point( 170.0, 40.0 ), new Point( 170.0, 150.0 ), new Point( 110.0, 100.0 ) );
			path2d.quadTo( new Point( 110.0, 140.0 ), new Point( 135.0, 140.0 ) );
			path2d.lineTo( new Point( 75.0, 140.0 ) );
			this.paths.push( path2d );

			// path2d.drawHandles();
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

		_.each( window.app.sketches, function( sketch, i ){
			sketch.hide();
		});


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
		show("lineto");

	});
	

}(jQuery, window));
