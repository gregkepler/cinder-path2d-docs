// (function($, window) {
	
	var cidocs = {};

	// set paper scope
	paper.install( window );

	// array of paper scope
	var papers = [];
	var COLOR_MOVE_TO = '#c64b24';
	var COLOR_LINE_TO = '#00FF00';
	var COLOR_QUAD_TO = '#0000FF';
	var COLOR_CUBIC_TO = '#FF00FF';
	var COLOR_CLOSE = '#FF0000';
	var COLOR_PATH = '#000000';

	var SEGMENT_TYPES = [
		"MOVETO",
		"LINETO",
		"QUADTO",
		"CUBICTO",
		"CLOSE"
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

	if (!Number.prototype.getDecimals) {
		Number.prototype.getDecimals = function() {
			var num = this,
				match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
			if (!match)
				return 0;
			return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
		}
}

	function convertToCiNum( number ) {
		var places = number.getDecimals();
		if( places <= 1 ) {
			return number.toFixed( 1 );
		} else {
			return number.toFixed( 2 );
		}
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

		this.path = new Path();
		this.path.pivot = new Point();

		this.moveToTemplate = _.template( "mPath.moveTo( vec2( <%- pointX %>f, <%- pointY %>f ) );\n" );
		this.lineToTemplate = _.template( "mPath.lineTo( vec2( <%= pointX %>f, <%= pointY %>f ) );\n" );
		this.quadToTemplate = _.template( "mPath.quadTo( vec2( <%= h1x %>f, <%= h1y %>f ), vec2( <%= p2x %>f, <%= p2y %>f ) );\n" );
		this.curveToTemplate = _.template( "mPath.curveTo( vec2( <%= h1x %>f, <%= h1y %>f ), vec2( <%= h2x %>f, <%= h2y %>f ), vec2( <%= p2x %>f, <%= p2y %>f ) );\n" );
		this.closeTemplate = _.template( "mPath.close()\n" );
		
		this.ptRect = new Rectangle( new Point( -2, -2 ), new Size( 4, 4 ) );
		
		var star = new Path.Star( new Point( 0, 0 ), 5, 3, 5 );
		star.fillColor = COLOR_MOVE_TO;
		star.strokeColor = COLOR_MOVE_TO;
		star.type = 'star';
		// star.strokeColor = 'blue';
		star.rotation = 180;
		// this.ptStar = star;
		// this.ptStar.visible = false;
		// removeChild( this.ptStar );
		// this.ptStar.removeChild();
		this.ptStar = new Symbol( star );

		// var star = this.ps.project.importSVG( 'images/star.svg' );
		// this.starPt = new Symbol( star );
		// this.starPt.remove();
		// star.remove();
	}

	cidocs.Path2d.prototype = {
		
		moveTo: function( point ) {

			// var pt = new Shape.Rectangle( this.ptRect );
			// var pt = this.ptStar.clone();
			// pt.addChild( this.ptStar.place() );
			// var pt = new Shape.Rectangle( this.ptStar );
			// var pt = new Item( this.ptStar );
			var pt = this.ptStar.place();
			pt.translate( point );

			this.points.push( pt );
			this.segments.push( SEGMENT_TYPES[0] );
			this.drawPath();
		},

		lineTo: function( point ) {

			var pt = new Shape.Rectangle( this.ptRect );
			pt.translate( point );
			pt.strokeColor = 'blue';
			this.points.push( pt );
			this.segments.push( SEGMENT_TYPES[1] );
			this.drawPath();
		},

		quadTo: function( handlePt, endPt ) {

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

		close: function() {

			this.segments.push( SEGMENT_TYPES[4] );
			this.drawPath();
		},

		setPosition: function( pos ) {

			var tlPos = this.path.bounds.topLeft;
			_.each( this.points, function( pt ) {
				var relPos = (new Point(pt.position)).subtract( new Point( tlPos ) );
				pt.position.x = Math.round( relPos.x + pos.x );
				pt.position.y = Math.round( relPos.y + pos.y );
			} );

			this.drawPath();
		},

		centerInCanvas: function( canvas ) {

			// console.log( canvas[0].clientWidth, this.path.bounds );
			var posX = Math.round( (canvas[0].clientWidth - this.path.bounds.width) / 2 );
			var posY = Math.round( (canvas[0].clientHeight - this.path.bounds.height) / 2 );
			this.setPosition( new Point( posX, posY ) );
			// this.setPosition( new Point( posX, posY ) );
		},

		movePoint: function( selectedPoint, newPos ) {

			var ptIndex = 0;
			var points = this.points;
			var self = this;
			var mainPt = null;
			var newPos = newPos.round();

			_.each( this.segments, function( segment, index, segments ) {

				if( mainPt ) 
					return;

				var ptsToMove = [];
				var nextSegment = segments[index+1];

				switch( segment ) {
					
					case SEGMENT_TYPES[0]:
						mainPt = ptIndex;
						ptsToMove = [points[mainPt]];						
						if( nextSegment === SEGMENT_TYPES[3] ) {
							ptsToMove.push( points[ptIndex + 1] );
						}
						ptIndex++;
						break;

					case SEGMENT_TYPES[1]:
						mainPt = ptIndex;
						ptsToMove = [points[mainPt]];
						if( nextSegment === SEGMENT_TYPES[3] ) {
							ptsToMove.push( points[ptIndex + 1] );
						}
						ptIndex++;
						break;

					case SEGMENT_TYPES[2]:
						mainPt = ptIndex + 1;
						ptsToMove = [points[mainPt]];						
						if( nextSegment === SEGMENT_TYPES[3] ) {
							ptsToMove.push( points[ptIndex + 2] );
						}
						ptIndex+=2;
						break;

					case SEGMENT_TYPES[3]:
						mainPt = ptIndex + 2;
						ptsToMove = [points[mainPt], points[ptIndex + 1]];
						if( nextSegment === SEGMENT_TYPES[3] ) {
							ptsToMove.push( points[ptIndex + 3] );
						}
						ptIndex+=3;
						break;
				};

				// if we've found the point to move, move it aling with companion points
				if( selectedPoint === self.points[mainPt] ) {
					var mainPt = new Point( points[mainPt].position );
					var diff = newPos.subtract( mainPt );

					_.each( ptsToMove, function( pt ) {
						pt.position = new Point( pt.position ).add( diff );
					}, this );				
				}
			} );

			if( !mainPt ) {
				selectedPoint.position = newPos;
			}
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
						code += self.moveToTemplate( { pointX: convertToCiNum( points[ptIndex].position.x ), pointY: convertToCiNum( points[ptIndex].position.y ) } );
						ptIndex++;
						break;

					case SEGMENT_TYPES[1]:
						code += self.lineToTemplate( { pointX: convertToCiNum( points[ptIndex].position.x ), pointY: convertToCiNum( points[ptIndex].position.y ) } );
						ptIndex++;
						break;

					case SEGMENT_TYPES[2]:
						code += self.quadToTemplate( { h1x: convertToCiNum( points[ptIndex].position.x ), h1y: convertToCiNum( points[ptIndex].position.y ), 
														p2x: convertToCiNum( points[ptIndex+1].position.x ), p2y: convertToCiNum( points[ptIndex+1].position.y ) } );
						ptIndex+=2;
						break;

					case SEGMENT_TYPES[3]:
						code += self.curveToTemplate( { h1x: convertToCiNum( points[ptIndex].position.x ), h1y: convertToCiNum( points[ptIndex].position.y ), 
														h2x: convertToCiNum( points[ptIndex+1].position.x ), h2y: convertToCiNum( points[ptIndex+1].position.y ), 
														p2x: convertToCiNum( points[ptIndex+2].position.x ), p2y: convertToCiNum( points[ptIndex+2].position.y ) } );
						ptIndex+=3;
						break;

					case SEGMENT_TYPES[4]:
						code += self.closeTemplate();
						break;
				}
			} );

			// console.log( "getCinderPath", code);
			return code;
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
			self.path.strokeColor = COLOR_PATH;
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

						// var start = new Path.

						// var star = self.ptStar.place();
						// star.position = points[ptIndex].position;
						// self.extras.push(star);
						var pt = points[ptIndex].position;


						self.path.moveTo( new Point( pt ) );
						self.drawPointText.call( self, [pt] );
						ptIndex++;
						break;

					case SEGMENT_TYPES[1]:


						
						// console.log( "LINE TO", points[ptIndex].position.x, points[ptIndex].position.y );
						// self.lineTo( points[ptIndex] );

						var pt = points[ptIndex].position;

						// path line
						self.path.lineTo( new Point( pt ) );

						// segment line
						var seg = new Path();
						seg.moveTo( points[ptIndex-1].position );
						seg.strokeColor = COLOR_LINE_TO;
						seg.strokeWidth = 3.0;
						seg.lineTo( new Point( pt ) );
						self.extras.push( seg );

						self.drawPointText.call( self, [pt] );
						ptIndex++;
						break;

					case SEGMENT_TYPES[2]:

						// var pt = points[ptIndex].position;
						var l1 = new Path.Line( new Point( points[ptIndex].position ), new Point( points[ptIndex + 1].position ) );
						var l2 = new Path.Line( new Point( points[ptIndex].position ), new Point( points[ptIndex - 1].position ) );
						l1.strokeColor = 'cyan';
						l2.strokeColor = 'cyan';
						l1.sendToBack();
						l2.sendToBack();
						self.extras.push( l1, l2 );

						// self.quadTo(points[ptIndex], points[ptIndex+1] );
						// self.path.strokeColor = COLOR_QUAD_TO;
						self.path.quadraticCurveTo(
							new Point( points[ptIndex].position ),
							new Point( points[ptIndex + 1].position )
						);

						
						// segment line
						var seg = new Path();
						seg.moveTo( points[ptIndex-1].position );
						seg.strokeColor = COLOR_QUAD_TO;
						seg.strokeWidth = 3.0;
						seg.quadraticCurveTo(
							new Point( points[ptIndex].position ),
							new Point( points[ptIndex + 1].position )
						);
						self.extras.push( seg );

						self.drawPointText.call( self, [points[ptIndex].position, points[ptIndex+1].position] );
						ptIndex+=2;
						break;

					case SEGMENT_TYPES[3]:

						var h1 = points[ptIndex].position;
						var h2 = points[ptIndex+1].position;
						var pt = points[ptIndex+2].position;

						var l1 = new Path.Line( new Point( points[ptIndex - 1].position ), new Point( h1 ) );
						var l2 = new Path.Line( new Point( h2 ), new Point( pt ) );
						l1.strokeColor = 'cyan';
						l2.strokeColor = 'cyan';
						l1.sendToBack();
						l2.sendToBack();
						self.extras.push( l1, l2 );


						self.path.cubicCurveTo(
							new Point( h1 ),
							new Point( h2 ),
							new Point( pt )
						);


						// segment line
						var seg = new Path();
						seg.moveTo( points[ptIndex-1].position );
						seg.strokeColor = COLOR_CUBIC_TO;
						seg.strokeWidth = 3.0;
						seg.cubicCurveTo(
							new Point( h1 ),
							new Point( h2 ),
							new Point( pt )
						);
						self.extras.push( seg );

						self.drawPointText.call( self, [h1, h2, pt] );

						ptIndex+=3;
						break;

					case SEGMENT_TYPES[4]:

						self.path.closed = true;

						// segment line
						var seg = new Path();
						seg.strokeColor = COLOR_CLOSE;
						seg.strokeWidth = 3.0;
						seg.moveTo( points[points.length-1].position );
						seg.lineTo(
							points[0].position
						);
						self.extras.push( seg );
						break;
				}
			} );
	
			_.each( this.points, function( point ) {
				point.bringToFront();
			});

			// console.log( "PATH", this.path );
		},

		drawPointText: function( pts ) {

			var self = this;
			_.each( pts, function( pt ){
				var text = new PointText({
					point: [pt.x + 5, pt.y],
					content: '[' + pt.x + ', ' + pt.y + ']',
					fillColor: 'black',
					fontFamily: 'Courier New',
					fontSize: 8
				});
				self.extras.push( text );
			});
		},

		reset: function(){

			_.each( this.points, function( point ) {
				point.remove();
			});

			_.each( this.extras, function( extra ) {
				extra.remove();
			});

			this.path.remove();
			this.points		= [];
			this.segments	= [];
			this.extras		= [];
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
			this.canvas = $( options.canvas );
			this.output = options.output;
			this.name 	= options.name;

			var paperScope = new paper.PaperScope();
			paperScope.setup( this.canvas[0] );
			this.curPaper = paperScope;

			this.tool = new paperScope.Tool();
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
			if( hitResult && ( hitResult.item.type === 'rectangle' || hitResult.type === "segment" ) ){
				hitResult.item.fullySelected = true;
			}

		},

		onToolMouseDown: function( event ) {

			this.selectedSegment = this.selectedPath = this.selectedPoint = null;
			var hitResult = this.curPaper.project.hitTest( event.point, this.hitOptions );
			if( !hitResult )
				return;

			if( hitResult ) {
				// this.selectedPath = hitResult.item;
				// this.selectedPath.fullySelected = true;

				// console.log( hitResult.type );
				/*if (hitResult.type == 'segment') {
					this.selectedSegment = hitResult.segment;
				}*/

				if (hitResult.item.type === 'rectangle' || hitResult.type === "segment") {
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

			// console.log( "POINT", new paper.Point( event.point.x, event.point.y ).length );

			if( this.selectedPoint ) {

				this.paths[0].movePoint( this.selectedPoint, event.point );
				// this.selectedPoint.position = event.point;
				// console.log( "DRAG", this.selectedPoint.position.x, this.selectedPoint.position.y );
				// console.log( this.selectedPoint.position );
				this.paths[0].drawPath();	
				this.updatePath();
			}

			// if( this.movePath ) {
				// this.selectedPath.position += event.delta;
			// }

		},

		drawInitialPath: function(){
			// overwrite
		},

		reset: function(){
			this.paths[0].reset();
			this.paths = [];
			this.drawInitialPath();
			this.updatePath();
		},

		updatePath: function() {

			this.curPaper.view.draw();
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
			this.canvas.removeClass( "inactive" );
			this.canvas.addClass( "active" );
			this.updatePath();

			_.bindAll( this, 'toggleHandles', 'reset' );
			$("#handle-toggle").click( $.proxy( this.toggleHandles, this) );
			$("#reset").click( $.proxy( this.reset, this) );

		},

		hide: function() {

			this.canvas.removeClass( "active" );
			this.canvas.addClass( "inactive" );
			$("#handle-toggle").unbind('click')
			$("#reset").unbind('click')
		}
	};




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
			var p = "mPath";
			var code = "Path2d mPath;\n";
			code += path.getCinderPath();
			code += "gl::draw( mPath );";
			// div.html( code );
			this.div.html( Prism.highlight( code, Prism.languages.cpp ) );

			// log( code, Prism.highlight( code, Prism.languages.cpp ) );
		};

		this.init();
	};


	// +———————————————————————————————————————+
	//	Main App
	// +———————————————————————————————————————+

	cidocs.app = function() {

		this.sketches = [];

		this.codeModule = new cidocs.CodeModule();
	};

	cidocs.app.prototype = {

		init: function(){
			
			// extended class will define sketches
			var self = this;
			var linksDiv = $( '#sketchLinks' );
			_.each( this.sketches, function( sketch ){
				// create a link

				var li = $('<li>').appendTo( linksDiv );
				var link = $('<a>',{	
					text: sketch.canvas.data('name'),
					title: 'Blah',
					href: '#',
					'data-sketch': sketch.canvas[0].id,
					click: function(){ self.show( sketch.canvas[0].id );return false;}
				})
				link.appendTo( li );
			});
		},

		show: function( moduleName ){

			// remove active from any active canvases
			var elements = document.querySelectorAll( "canvas" );

			_.each( this.sketches, function( sketch, i ){
				sketch.hide();
			});


			// make the specified canvas active
			_.findWhere( this.sketches, {name:moduleName}).show();
			_.each( $( '#sketchLinks a' ), function( el ){
				var $el = $( el );
				if( $el.data('sketch') === moduleName )
					$el.addClass( 'active' );
				else
					$el.removeClass( 'active' );
			} )
		}
	};

	

	/*$(document).ready( function(){
		
		window.app.init();
		show( "moveto" );

	});*/
	

// }(jQuery, window));
