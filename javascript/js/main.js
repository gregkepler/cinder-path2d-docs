
var cidocs = {};

// set paper scope
paper.install( window );

// array of paper scope
var papers = [];
var COLOR_MOVE_TO	= '#c64b24';
var COLOR_LINE_TO	= '#00FF00';
var COLOR_QUAD_TO	= '#0000FF';
var COLOR_CUBIC_TO	= '#FF00FF';
var COLOR_CLOSE		= '#FF0000';
var COLOR_PATH		= '#000000';
var COLOR_CENTER	= '#f48a00';
var COLOR_INACTIVE	= '#999999';


var SEGMENT_TYPES = Object.freeze( {
	"MOVETO": 1,
	"LINETO": 2,
	"QUADTO": 3,
	"CUBICTO": 4,
	"ARC": 5,
	"ARCTO": 6,
	"CLOSE": 7
} );


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


Function.prototype.addGetter = function( val,fn ){
	this.prototype.__defineGetter__( val,fn );
	return this;
};

Function.prototype.addSetter = function( val,fn ){
	this.prototype.__defineSetter__( val,fn );
	return this;
};


if ( !Number.prototype.getDecimals ) {
	Number.prototype.getDecimals = function() {
		var num = this,
			match = ( '' + num ).match( /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/ );
		if ( !match )
			return 0;
		return Math.max( 0, ( match[1] ? match[1].length : 0 ) - ( match[2] ? +match[2] : 0 ) );
	};
}

function toCiNum( number ) {
	var places = number.getDecimals();
	if( places <= 1 ) {
		return Number( number.toString().match( /^\d+(?:\.\d{0,1})?/ ) );
		// return number.toFixed( 1 );
	} else {
		return Number( number.toString().match( /^\d+(?:\.\d{0,2})?/ ) );
		// return number.toFixed( 2 ); // this here rounds before lopping off everything after the hundredths place
	}
}

function toCiRadians( radians ) {
	
	var PI2 = ( Math.PI * 2.0 );
	if( radians < 0 ) radians += PI2;
	if( radians >= PI2 ) radians -= PI2;
	radians = Number( toCiNum( radians ) );

	var piRadians = toCiNum( radians / Math.PI );
	var displayRadians;
	
	if( piRadians === 0.0 ) {
		displayRadians = '0.0f';
	} else if( piRadians == 1.0 ) {
		displayRadians = "M_PI";
	} else {
		displayRadians = "M_PI * " + piRadians + 'f';
	}
	return displayRadians;
}



// +———————————————————————————————————————+
//	Segments     
//	directions for how to draw and
//	describe each drawing command
// +———————————————————————————————————————+

cidocs.Segment = function( path2d, type, points ) {

	this.path2d = path2d;
	// this.path2d.points.push( points );
	this.path = this.path2d.path;
	this.type = type;
	this.points = points;
	this.extras = [];

	if( this.path2d.points.length )
		this.pointIndex = this.path2d.points.length-1;
};

cidocs.Segment.prototype = {

	reset: function() {

		_.each( this.extras, function( extra ) {
			extra.remove();
		});
		this.extras = [];
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

	getCode: function() {
		// override
	}
};


cidocs.MoveToSegment = function( path2d, points ){

	cidocs.Segment.call( this, path2d, SEGMENT_TYPES.MOVETO, points );
	this.template = _.template( "mPath.moveTo( vec2( <%- pointX %>f, <%- pointY %>f ) );\n" );
};

cidocs.MoveToSegment.prototype = {

	getCode: function() {
		return this.template( { pointX: toCiNum( this.points[0].position.x ), pointY: toCiNum( this.points[0].position.y ) } );
	}
	
};

cidocs.MoveToSegment.extend( cidocs.Segment );


cidocs.LineToSegment = function( path2d, points ){

	cidocs.Segment.call( this, path2d, SEGMENT_TYPES.LINETO, points );
	this.template = _.template( "mPath.lineTo( vec2( <%= pointX %>f, <%= pointY %>f ) );\n" );
};

cidocs.LineToSegment.prototype = {

	getCode: function() {
		return this.template( { pointX: toCiNum( this.points[0].position.x ), pointY: toCiNum( this.points[0].position.y ) } );		
	}
	
};

cidocs.LineToSegment.extend( cidocs.Segment );


cidocs.QuadToSegment = function( path2d, points ){

	cidocs.Segment.call( this, path2d, SEGMENT_TYPES.QUADTO, points );
	this.template = _.template( "mPath.quadTo( vec2( <%= h1x %>f, <%= h1y %>f ), vec2( <%= p2x %>f, <%= p2y %>f ) );\n" );
};

cidocs.QuadToSegment.prototype = {

	getCode: function() {
		return this.template( { h1x: toCiNum( this.points[0].position.x ), h1y: toCiNum( this.points[0].position.y ), 
								p2x: toCiNum( this.points[1].position.x ), p2y: toCiNum( this.points[1].position.y ) } );
	}
};

cidocs.QuadToSegment.extend( cidocs.Segment );


cidocs.CubicToSegment = function( path2d, points ){

	cidocs.Segment.call( this, path2d, SEGMENT_TYPES.CUBICTO, points );
	this.template = _.template( "mPath.curveTo( vec2( <%= h1x %>f, <%= h1y %>f ), vec2( <%= h2x %>f, <%= h2y %>f ), vec2( <%= p2x %>f, <%= p2y %>f ) );\n" );
};

cidocs.CubicToSegment.prototype = {

	getCode: function() {
		return this.template( { h1x: toCiNum( this.points[0].position.x ), h1y: toCiNum( this.points[0].position.y ), 
								h2x: toCiNum( this.points[1].position.x ), h2y: toCiNum( this.points[1].position.y ), 
								p2x: toCiNum( this.points[2].position.x ), p2y: toCiNum( this.points[2].position.y ) } );
	}
};

cidocs.CubicToSegment.extend( cidocs.Segment );


cidocs.ArcSegment = function( path2d, points, radius, startRadians, endRadians, forward ){

	cidocs.Segment.call( this, path2d, SEGMENT_TYPES.ARC, points );
	this._radius = radius;
	// this.radius = radius;
	this.startRadians = startRadians;
	this.endRadians = endRadians;
	this.forward = forward;
	this.template = _.template( "mPath.arc( vec2( <%= pointX %>f, <%= pointY %>f ), <%= radius %>f, <%= startRadians %>, <%= endRadians %>, <%= forward %> );\n" );
};

cidocs.ArcSegment.prototype = {

	getCode: function() {
		return this.template( { pointX: toCiNum( this.points[0].position.x ), pointY: toCiNum( this.points[0].position.y ),
								radius: toCiNum( this.radius ), startRadians: toCiRadians( this.startRadians ), 
								endRadians: toCiRadians( this.endRadians ), forward: this.forward } );
	}

};

cidocs.ArcSegment.extend( cidocs.Segment );

// getters and setters
cidocs.ArcSegment.addGetter( 'radius', function() { return this._radius; } );
cidocs.ArcSegment.addSetter( 'radius', function( val ){ 
	this._radius = val;
	// console.log( "SET ARC RADIUS, SO DISPATCH AN UPDATE");
	// $(this).trigger( "change_radius" );
});


cidocs.ArcToSegment = function( path2d, points, radius ){

	cidocs.Segment.call( this, path2d, SEGMENT_TYPES.ARCTO, points );
	this.radius = radius;
	this.template = _.template( "mPath.arcTo( vec2( <%= pointX %>f, <%= pointY %>f ), vec2( <%= tanX %>f, <%= tanY %>f ), <%= radius %>f );\n" );
};

cidocs.ArcToSegment.prototype = {

	getCode: function() {
		return this.template( { pointX: toCiNum( this.points[0].position.x ), pointY: toCiNum( this.points[0].position.y ),
								tanX: toCiNum( this.points[1].position.x ), tanY: toCiNum( this.points[1].position.y ),
								radius: toCiNum( this.radius ) } );
	}
};

cidocs.ArcToSegment.extend( cidocs.Segment );


cidocs.CloseSegment = function( path2d ){

	cidocs.Segment.call( this, path2d, SEGMENT_TYPES.CLOSE, [] );
	this.template = _.template( "mPath.close()\n" );
};

cidocs.CloseSegment.prototype = {

	getCode: function() {
		return this.template();
	}
};

cidocs.CloseSegment.extend( cidocs.Segment );


// +———————————————————————————————————————+
//	PathPoint     
//	Serves as the points along a path.
//	Sometimes they are draggable. Sometimes
//	they are just visual
// +———————————————————————————————————————+
cidocs.PathPoint = function( pos, active, color ) {

	var ptRect = new Rectangle( new Point( -2, -2 ), new Size( 4, 4 ) );
	var pt = new Shape.Rectangle( ptRect );
	pt.translate( pos );
	pt.active = ( _.isBoolean( active ) ) ? active : true;
	pt.strokeColor = pt.active ? color || 'blue' : COLOR_INACTIVE;

	return pt;
};

cidocs.StartPoint = function( pos, active ) {

	var star = new Path.Star( new Point( 0, 0 ), 5, 3, 5 );
	star.fillColor = COLOR_MOVE_TO;
	star.strokeColor = COLOR_MOVE_TO;
	star.type = 'star';
	star.rotation = 180;
	var ptStar = new Symbol( star );
	var pt = ptStar.place();
	pt.translate( pos );
	pt.active = ( _.isBoolean( active ) ) ? active : true;

	return pt;
};

cidocs.HandlePoint = function( pos, active ) {

	return new cidocs.PathPoint( pos, active, 'cyan' );
};

cidocs.CenterPoint = function( pos, active ) {

	var circle = new Path.Circle( new Point( 0, 0 ), 3 );
	circle.strokeColor = COLOR_CENTER;
	var circleSymbol = new Symbol( circle );

	var pt = circleSymbol.place();
	pt.translate( pos );
	pt.active = active;

	return pt;
};


// +———————————————————————————————————————+
//	Path2d     
//	wrap a paperjs path to perform more
//	like a cinder path2d
// +———————————————————————————————————————+

cidocs.Path2d = function( paperScope ) {

	this.points		= [];	// to keep track of points
	this.segs		= [];
	this.extras		= [];	// array of points, handles and lines
	this.ps = paperScope;

	this.path = new Path();
	this.path.pivot = new Point();
			
	var star = new Path.Star( new Point( 0, 0 ), 5, 3, 5 );
	star.fillColor = COLOR_MOVE_TO;
	star.strokeColor = COLOR_MOVE_TO;
	star.type = 'star';
	star.rotation = 180;
	this.ptStar = new Symbol( star );

};

cidocs.Path2d.prototype = {
	
	moveTo: function( point ) {

		var pt = new cidocs.StartPoint( point );
		this.points.push( pt );

		var segment = new cidocs.MoveToSegment( this, [_.last( this.points )] );
		this.segs.push( segment );

		this.drawPath();
	},

	lineTo: function( point ) {

		var pt = new cidocs.PathPoint( point );

		this.points.push( pt );

		var segment = new cidocs.LineToSegment( this, [pt] );
		this.segs.push( segment );

		this.drawPath();
	},

	quadTo: function( handlePt, endPt ) {

		var h1 = new cidocs.HandlePoint( handlePt );
		var pt = new cidocs.PathPoint( endPt );
		this.points.push( h1, pt );

		var segment = new cidocs.QuadToSegment( this, [h1, pt] );
		this.segs.push( segment );

		this.drawPath();
	},

	curveTo: function( handlePt1, handlePt2, endPt ) {

		var h1 = new cidocs.HandlePoint( handlePt1 );
		var h2 = new cidocs.HandlePoint( handlePt2 );
		var pt = new cidocs.PathPoint( endPt );
		this.points.push( h1, h2, pt );

		var segment = new cidocs.CubicToSegment( this, [h1, h2, pt] );
		this.segs.push( segment );

		this.drawPath();
	},

	arc: function( center, radius, startRadians, endRadians, frwd ) {

		var pt = new cidocs.CenterPoint( center );

		// get pt at start radians
		var start = new Point( Math.cos( startRadians ), Math.sin( startRadians ) ).multiply( radius ).add( center );
		var startPt = new cidocs.PathPoint( start );

		// get pt at end radians
		var end = new Point( Math.cos( endRadians ), Math.sin( endRadians ) ).multiply( radius ).add( center );
		var endPt = new cidocs.PathPoint( end );

		this.points.push( pt, startPt, endPt );

		var segment = new cidocs.ArcSegment( this, [pt, startPt, endPt], radius, startRadians, endRadians, frwd );
		this.segs.push( segment );
		this.drawPath();
	},

	arcTo: function( targetPt, tangentPt, radius ) {

		var endPt = new cidocs.PathPoint( targetPt );
		var tanPt = new cidocs.PathPoint( tangentPt );
		this.points.push( endPt, tanPt );

		var segment = new cidocs.ArcToSegment( this, [endPt, tanPt], radius );
		this.segs.push( segment );
		this.drawPath();
	},

	reverseArc: function() {

		// for all the segments in the path, reverse the arc directions
		_.each( this.segs, function( segment ) {
			if( segment.type === SEGMENT_TYPES.ARC ) {
				segment.forward = !segment.forward;
			}
		} );
		this.drawPath();
	},

	setArcRadius: function( radius ) {

		// for all the segments in the path, reverse the arc directions
		_.each( this.segs, function( segment ) {

			if( segment.type === SEGMENT_TYPES.ARC ) {

				segment.radius = radius;
				var center = segment.points[0].position;
				var startPt = segment.points[1].position;
				var endPt = segment.points[2].position;
				segment.points[1].position =  new Point( Math.cos( segment.startRadians ), Math.sin( segment.startRadians ) ).multiply( segment.radius ).add( center );
				segment.points[2].position = new Point( Math.cos( segment.endRadians ), Math.sin( segment.endRadians ) ).multiply( segment.radius ).add( center );
			
			} else if ( segment.type === SEGMENT_TYPES.ARCTO ) {
				segment.radius = radius;
			}
		} );
		this.drawPath();
	},

	drawCubicSegment: function( path, segment, options ) {

		var segmentPoints = segment.points;
		var h1 = segmentPoints[0].position;
		var h2 = segmentPoints[1].position;
		var pt = segmentPoints[2].position;
		var drawPointText = _.isBoolean( options.drawPointText ) ? options.drawPointText : true;

		path.cubicCurveTo(
			new Point( h1 ),
			new Point( h2 ),
			new Point( pt )
		);

		if( options.extras ) {

			var l1 = new Path.Line( options.prevPoint, new Point( h1 ) );
			var l2 = new Path.Line( new Point( h2 ), new Point( pt ) );
			var strokeColor = segmentPoints[0].active ? 'cyan' : COLOR_INACTIVE;
			l1.strokeColor = strokeColor;
			l2.strokeColor = strokeColor;
			l1.sendToBack();
			l2.sendToBack();
			this.addExtras( "handle-line", [l1, l2] );
		}

		if( drawPointText ) {
			this.drawPointText.call( this, [h1, h2, pt] );
		}
		
	},

	drawArcSegment: function( path, segment, options ) {

		var center = segment.points[0].position;
		var startPt = segment.points[1].position;
		var endPt = segment.points[2].position;
		var radius = startPt.getDistance( center );
		var startRadians = startPt.subtract( center ).angleInRadians;
		var endRadians = endPt.subtract( center ).angleInRadians;
		var forward = segment.forward;
		var points = this.points;

		if( forward ) {
			while( endRadians < startRadians )
				endRadians += 2 * Math.PI;
		}
		else {
			while( endRadians > startRadians )
				endRadians -= 2 * Math.PI;
		}

		var start =  new Point( Math.cos( startRadians ), Math.sin( startRadians ) ).multiply( radius ).add( center );
		var startMid =  new Point( Math.cos( startRadians ), Math.sin( startRadians ) ).multiply( radius / 2 ).add( center );
		if( points.length === 0 ) {
			path.moveTo( start );
		} else {
			path.lineTo( start );
		}

		if( forward )
			this.arcHelper( path, center, radius, startRadians, endRadians, forward, options );
		else
			this.arcHelper( path, center, radius, endRadians, startRadians, forward, options );

		var radiusLine = new Path.Line( center, start );
		radiusLine.strokeColor = COLOR_CENTER;
		this.addExtras( "radius-line", [radiusLine] );

		this.drawPointText.call( this, [center] );
		this.drawTextAtPoint.call( this, startPt, toCiRadians( startRadians ) );
		this.drawTextAtPoint.call( this, endPt, toCiRadians( endRadians ) );
		this.drawTextAtPoint.call( this, startMid, toCiNum( radius ) + 'f' );
	},

	arcHelper: function( path, center, radius, startRadians, endRadians, forward, options ) {

		// wrap the angle difference around to be in the range [0, 4*pi]
		while( endRadians - startRadians > 4 * Math.PI )
			endRadians -= 2 * Math.PI;


		// Recurse if angle delta is larger than PI
		if( endRadians - startRadians > Math.PI ) {

			var midRadians = startRadians + (endRadians - startRadians) * 0.5;
			if( forward ) {
				this.arcHelper( path, center, radius, startRadians, midRadians, forward, options );
				this.arcHelper( path, center, radius, midRadians, endRadians, forward, options );
			}
			else {
				this.arcHelper( path, center, radius, midRadians, endRadians, forward, options );
				this.arcHelper( path, center, radius, startRadians, midRadians, forward, options );
			}
		}
		else if( Math.abs( endRadians - startRadians ) > 0.000001 ) {

			var segments = Math.ceil( Math.abs( endRadians - startRadians ) / ( Math.PI / 2.0 ) );
			var angle;
			var angleDelta = ( endRadians - startRadians ) / segments;
			if( forward )
				angle = startRadians;
			else {
				angle = endRadians;
				angleDelta = -angleDelta;
			}

			for( var seg = 0; seg < segments; seg++, angle += angleDelta ) {
				// drawArcSegment
				options.prevPoint = path.getLastSegment().point;
				this.arcSegmentAsCubicBezier( path, center, radius, angle, angle + angleDelta, options );
			}
		}
	},

	arcSegmentAsCubicBezier: function( path, center, radius, startRadians, endRadians, options )
	{
		var r_sin_A, r_cos_A;
		var r_sin_B, r_cos_B;
		var h;

		r_sin_A = radius * Math.sin( startRadians );
		r_cos_A = radius * Math.cos( startRadians );
		r_sin_B = radius * Math.sin( endRadians );
		r_cos_B = radius * Math.cos( endRadians );

		h = 4.0/3.0 * Math.tan( (endRadians - startRadians) / 4 );


		var h1 = new Point( center.x + r_cos_A - h * r_sin_A, center.y + r_sin_A + h * r_cos_A );
		var h2 = new Point( center.x + r_cos_B + h * r_sin_B, center.y + r_sin_B - h * r_cos_B );
		var pt = new Point( center.x + r_cos_B, center.y + r_sin_B );
		// path.cubicCurveTo( h1, h2, pt );

		var h1Pt = new cidocs.HandlePoint( h1, false );
		var h2Pt = new cidocs.HandlePoint( h2, false );
		var ptPt = new cidocs.PathPoint( pt, false );
		this.addExtras( "point", [h1Pt, h2Pt, ptPt] );

		var tempSeg = new cidocs.CubicToSegment( this, [h1Pt, h2Pt, ptPt] );
		options.drawPointText = false;
		this.drawCubicSegment( path, tempSeg, options );
	},

	// coverted from cinder's pathTo
	drawArcToSegment: function( path, segment, options ) {

		if( path.closed || path.isEmpty() ) {
			console.error( "can only arcTo as non-first point" );
			return;
		}

		var epsilon = 1e-8;
		var radius = segment.radius;
		

		// Get current point.
		var p0 = this.getCurrentPoint( path );
		var p1 = new Point( segment.points[0].position );
		var t = new Point( segment.points[1].position );
		
		// Calculate the tangent vectors tangent1 and tangent2.
		var p0t = p0.subtract( t );
		var p1t = p1.subtract( t );
		
		// Calculate tangent distance squares.
		var p0tSquare = p0t.length * p0t.length;
		var p1tSquare = p1t.length * p1t.length;

		// Calculate tan(a/2) where a is the angle between vectors tangent1 and tangent2.
		//
		// Use the following facts:
		//
		//  p0t * p1t  = |p0t| * |p1t| * cos(a) <=> cos(a) =  p0t * p1t  / (|p0t| * |p1t|)
		// |p0t x p1t| = |p0t| * |p1t| * sin(a) <=> sin(a) = |p0t x p1t| / (|p0t| * |p1t|)
		//
		// and
		//
		// tan(a/2) = sin(a) / ( 1 - cos(a) )
		
		var numerator = p0t.y * p1t.x - p1t.y * p0t.x;
		var denominator = Math.sqrt( p0tSquare * p1tSquare ) - ( p0t.x * p1t.x + p0t.y * p1t.y );
		
		// The denominator is zero <=> p0 and p1 are colinear.
		if( Math.abs( denominator ) < epsilon ) {
			// console.log( denominator, epsilon, "LINE" );
			path.lineTo( t );
		}
		else {
			// |b0 - t| = |b3 - t| = radius * tan(a/2).
			var distanceFromT = Math.abs( radius * numerator / denominator );
			
			// b0 = t + |b0 - t| * (p0 - t)/|p0 - t|.
			var b0 = t.add( p0t.normalize().multiply( distanceFromT ) );
			
			// If b0 deviates from p0, add a line to it.
			if( Math.abs(b0.x - p0.x) > epsilon || Math.abs(b0.y - p0.y) > epsilon ) {
				path.lineTo( b0 );
			}
			
			// b3 = t + |b3 - t| * (p1 - t)/|p1 - t|.
			var b3 = t.add( p1t.normalize().multiply( distanceFromT ) );
			
			// The two bezier-control points are located on the tangents at a fraction
			// of the distance[ tangent points <-> tangent intersection ].
			// See "Approxmiation of a Cubic Bezier Curve by Circular Arcs and Vice Versa" by Aleksas Riskus 
			// http://itc.ktu.lt/itc354/Riskus354.pdf
			
			var b0tSquare = (t.x - b0.x) *  (t.x - b0.x) + (t.y - b0.y) *  (t.y - b0.y);
			var radiusSquare = radius * radius;
			var fraction;
			
			// Assume dist = radius = 0 if the radius is very small.
			if( Math.abs( radiusSquare / b0tSquare ) < epsilon )
				fraction = 0.0;
			else
				fraction = ( 4.0 / 3.0 ) / ( 1.0 + Math.sqrt( 1.0 + b0tSquare / radiusSquare ) );
			
			
			var b1 = b0.add( ( t.subtract( b0 ) ).multiply( fraction ) );
			var b2 = b3.add( ( t.subtract( b3 ) ).multiply( fraction ) );
			
			// add the points as path points
			var curPt = new cidocs.PathPoint( this.getCurrentPoint( path ), false );
			var b1Pt = new cidocs.HandlePoint( b1, false );
			var b2Pt = new cidocs.HandlePoint( b2, false );
			var b3Pt = new cidocs.PathPoint( b3, false );
			this.addExtras( "point", [curPt, b1Pt, b2Pt, b3Pt] );
			
			var tempSeg = new cidocs.CubicToSegment( this, [b1Pt, b2Pt, b3Pt] );
			options.drawPointText = false;
			options.prevPoint = curPt.position;
			this.drawCubicSegment( path, tempSeg, options );
		}

		this.drawPointText.call( this, [p1, t] );
	},

	calcBounds: function()
	{
		return this.path.bounds;
	},

	drawLineExtra: function( pt1, pt2 )
	{
		var l1 = new Path.Line( pt1, pt2 );
		l1.strokeColor = 'cyan';
		l1.sendToBack();
		this.addExtras( "line-extra", [l1] );
	},

	addExtras: function( type, items ) {

		var self = this;

		_.each( items, function( item ){
			item._extraType = type;
			self.extras.push( item );
		} );

		// bring certain points to the front
		_.each( this.extras, function( extra ){
			if( extra._extraType === "point" || extra._extraType === "handle-line" ){
				extra.bringToFront();
			}
		});

		return this.extras;
	},

	close: function() {


		var segment = new cidocs.CloseSegment( this );
		this.segs.push( segment );

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

		console.log( this.path.bounds.width, this.path.bounds.height );
		var posX = Math.round( (canvas[0].clientWidth - this.path.bounds.width) / 2 );
		var posY = Math.round( (canvas[0].clientHeight - this.path.bounds.height) / 2 );
		this.setPosition( new Point( posX, posY ) );
	},

	movePoint: function( selectedPoint, pos ) {

		var ptIndex = 0;
		var points = this.points;
		var self = this;
		var mainPt = null;
		var newPos = pos.round();

		_.each( this.segs, function( segment, index, segments ) {

			if( mainPt )
				return;

			var ptsToMove = [];
			var nextSegment = (segments[index+1]) ? segments[index+1].type : null;

			switch( segment.type ) {
				
				case SEGMENT_TYPES.MOVETO:
					mainPt = ptIndex;
					ptsToMove = [points[mainPt]];
					if( nextSegment === SEGMENT_TYPES.CUBICTO ) {
						ptsToMove.push( points[ptIndex + 1] );
					}
					ptIndex++;
					break;

				case SEGMENT_TYPES.LINETO:
					mainPt = ptIndex;
					ptsToMove = [points[mainPt]];
					if( nextSegment === SEGMENT_TYPES.CUBICTO ) {
						ptsToMove.push( points[ptIndex + 1] );
					}
					ptIndex++;
					break;

				case SEGMENT_TYPES.QUADTO:
					mainPt = ptIndex + 1;
					ptsToMove = [points[mainPt]];
					if( nextSegment === SEGMENT_TYPES.CUBICTO ) {
						ptsToMove.push( points[ptIndex + 2] );
					}
					ptIndex+=2;
					break;

				case SEGMENT_TYPES.CUBICTO:
					mainPt = ptIndex + 2;
					ptsToMove = [points[mainPt], points[ptIndex + 1]];
					if( nextSegment === SEGMENT_TYPES.CUBICTO ) {
						ptsToMove.push( points[ptIndex + 3] );
					}
					ptIndex+=3;
					break;

				case SEGMENT_TYPES.ARC:
					
					mainPt = ptIndex;
					ptsToMove = [points[mainPt]];

					var center = points[ptIndex];
					var pt1 = points[ptIndex + 1];
					var pt2 = points[ptIndex + 2];

					var rad, angle1, angle2, startPt, endPt;
					if( selectedPoint == pt1 || selectedPoint == pt2 ) {
						if( selectedPoint == pt1 ) {
							rad = pt1.position.getDistance( center.position );
						}else if (selectedPoint == pt2 ) {
							rad = pt2.position.getDistance( center.position );
						}

						angle1 = pt1.position.subtract( center.position ).angleInRadians;
						angle2 = pt2.position.subtract( center.position ).angleInRadians;

						startPt = new Point( Math.round( Math.cos( angle1 ) * rad ),
							Math.round( Math.sin( angle1 ) * rad ) ).add( center.position );
						endPt = new Point( Math.round( Math.cos( angle2 ) * rad ),
							Math.round( Math.sin( angle2 ) * rad ) ).add( center.position );

						pt1.position = startPt;
						pt2.position = endPt;

						segment.radius = rad;
						segment.startRadians = angle1;
						segment.endRadians = angle2;
					}
					else{

						ptsToMove = [center, pt1, pt2];
					}

					if( nextSegment === SEGMENT_TYPES.CUBICTO ) {
						ptsToMove.push( points[ptIndex + 3] );
					}
					ptIndex+=3;
					break;
			}

			// if we've found the point to move, move it aling with companion points
			if( selectedPoint === self.points[mainPt] ) {
				var mainPt = new Point( points[mainPt].position );
				var diff = newPos.subtract( mainPt );

				_.each( ptsToMove, function( pt ) {
					pt.position = new Point( pt.position ).add( diff );
				}, this );
			}
		} );

		if( ! mainPt ) {
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

	getCinderCode: function() {

		var code = "";

		_.each( this.segs, function( segment ){
			code += segment.getCode();
		});
		
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

		this.ps.activate();

		// redraw the path using the original directions
		var ptIndex = 0;
		var points = this.points;
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

		_.each( this.segs, function( segment, index ) {

			var segmentPoints = segment.points;
			var prevPoint = ( ptIndex === 0 ) ? null : points[ptIndex-1].position;
			var pt = null;
			// console.log( segment.type );
			// segment.draw();

			switch( segment.type ) {
				
				case SEGMENT_TYPES.MOVETO:
					
					var pt = segmentPoints[0].position;
					self.path.moveTo( new Point( pt ) );
					self.drawPointText.call( self, [pt] );
					ptIndex++;
					break;

				case SEGMENT_TYPES.LINETO:
					
					var pt = segmentPoints[0].position;

					// path line
					self.path.lineTo( new Point( pt ) );

					// segment line
					var seg = new Path();
					seg.moveTo( prevPoint );
					seg.strokeColor = COLOR_LINE_TO;
					seg.strokeWidth = 3.0;
					seg.lineTo( new Point( pt ) );
					self.addExtras( "segment", [seg] );

					self.drawPointText.call( self, [pt] );
					ptIndex++;
					break;

				case SEGMENT_TYPES.QUADTO:

					var h1 = segmentPoints[0].position;
					var pt1 = segmentPoints[1].position;

					var l1 = new Path.Line( new Point( h1 ), new Point( pt1 ) );
					var l2 = new Path.Line( new Point( h1 ), new Point( prevPoint ) );
					l1.strokeColor = 'cyan';
					l2.strokeColor = 'cyan';
					l1.sendToBack();
					l2.sendToBack();
					self.addExtras( "handle-line", [l1, l2] );

					self.path.quadraticCurveTo(
						new Point( h1 ),
						new Point( pt1 )
					);

					
					// segment line
					var seg = new Path();
					seg.moveTo( prevPoint );
					var strokeColor = segmentPoints[0].active ? COLOR_QUAD_TO : COLOR_INACTIVE;
					seg.strokeColor = strokeColor;
					seg.strokeWidth = 3.0;
					seg.quadraticCurveTo(
						new Point( h1 ),
						new Point( pt1 )
					);
					self.addExtras( "segment", [seg] );

					self.drawPointText.call( self, [h1, pt1] );
					ptIndex+=2;
					break;

				case SEGMENT_TYPES.CUBICTO:

					var seg = new Path();
					seg.moveTo( prevPoint );
					seg.strokeColor = COLOR_CUBIC_TO;
					seg.strokeWidth = 3.0;
					self.addExtras( "segment", [seg] );

					self.drawCubicSegment( self.path, segment, { prevPoint: prevPoint, extras:true } );
					self.drawCubicSegment( seg, segment, prevPoint, { prevPoint: prevPoint, extras:false } );

					ptIndex+=3;
					break;

				case SEGMENT_TYPES.ARC:

					// main path segment
					self.drawArcSegment( self.path, segment, { prevPoint: prevPoint, extras:true } );

					// special segment
					var seg = new Path();
					seg.strokeColor = COLOR_CUBIC_TO;
					seg.strokeWidth = 3.0;
					self.drawArcSegment( seg, segment, { prevPoint: prevPoint, extras:false } );
					self.addExtras( "segment", [seg] );

					ptIndex += 3;

					break;

				case SEGMENT_TYPES.ARCTO:

					// main path segment
					self.drawArcToSegment( self.path, segment, { prevPoint: prevPoint, extras:true } );

					// overlay segment
					var seg = new Path();
					seg.moveTo( prevPoint );
					seg.strokeColor = COLOR_CUBIC_TO;
					seg.strokeWidth = 3.0;
					self.drawArcToSegment( seg, segment, { prevPoint: prevPoint, extras:false } );
					self.addExtras( "segment", [seg] );

					ptIndex += segment.points.length;

					break;

				case SEGMENT_TYPES.CLOSE:

					self.path.closed = true;

					// segment line
					var seg = new Path();
					seg.strokeColor = COLOR_CLOSE;
					seg.strokeWidth = 3.0;
					seg.moveTo( prevPoint );
					seg.lineTo(
						points[0].position
					);
					self.addExtras( "segment", [seg] );
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
			self.addExtras( "text", [text] );
		});
	},

	drawTextAtPoint: function( pt, text ) {

		var self = this;
		var ptText = new PointText( {
			point: [pt.x + 5, pt.y],
			content: text,
			fillColor: 'black',
			fontFamily: 'Courier New',
			fontSize: 8
		});
		self.addExtras( "text", [ptText] );
	},

	getCurrentPoint: function( path ) {

		return path.getLastSegment().point;
	},

	reset: function() {

		_.each( this.points, function( point ) {
			point.remove();
		});

		_.each( this.extras, function( extra ) {
			extra.remove();
		});

		this.path.remove();
		this.points		= [];
		this.segs		= [];
		this.extras		= [];

		
	}
};

// +———————————————————————————————————————+
//	Path2dSketch     
//	all sketches should extend this
// +———————————————————————————————————————+

cidocs.Path2dSketch = function( options ) {

	this.sketch = null;
	this.canvas = null;
	this.output = null;
	this.paths = [];
	this.extras = [];
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
	this.buttons = [];
	this.gui = new dat.GUI( { autoPlace: false } );

	this.initialize( options );
};

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

		// wrap canvas in div
		this.gui.name = 'gui_' + this.name;
		// $(this.gui.domElement);//.addClass( this.name );
		$(this.gui.domElement).find('.close-button').remove();
		var canvasWrapper = $("<div class='sketch'></div>");
		canvasWrapper.addClass( options.name );
		canvasWrapper.append( this.canvas );
		canvasWrapper.append( this.gui.domElement );
		$("#tutorial .canvases").append( canvasWrapper );
		this.sketch = canvasWrapper;
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
		var active = ( hitResult && _.isBoolean( hitResult.item.active ) ) ? hitResult.item.active : undefined;
		
		if( hitResult && active !== false && ( hitResult.item.type === 'rectangle' || hitResult.type === "segment" ) ){
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

			// console.log( "MOUSE DOWN", hitResult.item.type );
			/*if (hitResult.type == 'segment') {
				this.selectedSegment = hitResult.segment;
			}*/

			// if (hitResult.item.type === 'rectangle' || hitResult.type === "segment") {
			if( hitResult.item.active !== false && (hitResult.item.type === 'rectangle' || hitResult.type === "segment") ) {
				// console.log( "SELECT ME" )
				this.selectedPoint = hitResult.item;
			}
		}
	},

	onToolMouseDrag: function( event ) {
		
		if( this.selectedPoint ) {

			this.paths[0].movePoint( this.selectedPoint, event.point );
			this.drawPath();
			this.updateSketch();
		}
	},

	drawInitialPath: function() {
		// overwrite
	},

	drawBoundingBox: function() {
		var boundingBox = new cidocs.BoundingBox( this.paths[0] );
		this.extras.push( boundingBox );
	},

	reset: function(){
		this.paths[0].reset();
		this.paths = [];
		this.extras = [];
		this.drawInitialPath();

		if( ! this.handlesOn ){
			_.each( this.paths, function( path ) {
				path.handlesOff();
			} );
		}

		this.updateSketch();
	},

	updateSketch: function() {

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

		this.updateSketch();
	},

	show: function() {

		this.sketch.removeClass( "inactive" );
		this.sketch.addClass( "active" );
		
		this.drawPath();

		if( ! this.handlesOn ){
			_.each( this.paths, function( path ) {
				path.handlesOff();
			} );
		}
		
		this.updateSketch();

		_.bindAll( this, 'toggleHandles', 'reset' );
		$("#handle-toggle").click( $.proxy( this.toggleHandles, this) );
		$("#reset").click( $.proxy( this.reset, this) );

		// show buttons
		_.each( this.buttons, function( button ) {
			button.removeClass( 'invisible' );
		} );
	},

	hide: function() {

		this.sketch.removeClass( "active" );
		this.sketch.addClass( "inactive" );
		$( "#handle-toggle" ).unbind( 'click' );
		$( "#reset" ).unbind( 'click' );

		// hide buttons
		// show buttons
		_.each( this.buttons, function( button ) {
			button.addClass( 'invisible' );
		} );
	},

	addButton: function( id, name, options ) {

		var exists = _.find( $('.canvasButtons .right button'), function( button ) { return button.id === id;  } );

		// add to dat-gui
		var param1 = ( options && options[0] ) ? options[0] : null;
		var param2 = ( options && options[1] ) ? options[1] : null;
		var btn = this.gui.add( this, id, param1, param2 );
		btn.name( name );
		btn.updateDisplay();
	},

	activateButton: function( buttonId, func ) {

		var btn = _.find( this.buttons, function( btn ){ return btn[0].id === buttonId; } );
		if( btn ) {
			btn.click( $.proxy( func, this) );
		}
	},

	deactivateButton: function( buttonId ) {

		var btn = _.find( this.buttons, function( btn ){ return btn[0].id === buttonId; } );
		if( btn ) {
			btn.unbind('click');
		}
	},

	drawPath: function() {

		this.paths[0].drawPath();

		_.every( this.extras, function( extra ){
			extra.draw();
		} );
	}
};


// +———————————————————————————————————————+
//	Extra drawing commands     
//	Additional commands for the sketch
//	such as drawBoundbox calls
// +———————————————————————————————————————+

cidocs.BoundingBox = function( path2d ) {
	this.path2d = path2d;
	this.template = "";
	this.box = null;
};

cidocs.BoundingBox.prototype = {

	draw: function() {
		if( this.box ) {
			this.box.remove();
		}
		var bounds = this.path2d.calcBounds();
		var box = new Path.Rectangle( bounds );
		box.strokeColor = 'red';
		this.box = box;
		console.log( "DRAW BOUNDS", box );
	},

	getCinderCode: function() {

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

		var code = "";

		if( path ) {
			var segments = path.segments;
			var p = "mPath";
			code = "Path2d mPath;\n";
			code += path.getCinderCode();
			code += "gl::draw( mPath );";
		}

		this.div.html( Prism.highlight( code, Prism.languages.cpp ) );
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
			var link = $('<a>', {
				text: sketch.canvas.data('name'),
				title: 'Blah',
				href: '#',
				'data-sketch': sketch.canvas[0].id,
				click: function(){ self.show( sketch.canvas[0].id );return false;}
			});
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
		} );
	}
};

