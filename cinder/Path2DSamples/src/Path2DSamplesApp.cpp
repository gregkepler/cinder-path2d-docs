#include "cinder/app/AppNative.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"
#include "cinder/Path2d.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class Path2DSamplesApp : public AppNative {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
	void update() override;
	void draw() override;
	void drawPath( const Path2d &path );
	
	Path2d path1;
	Path2d path2;
	Path2d path3;
	Path2d path4;
	Path2d path5;
};

void Path2DSamplesApp::setup()
{
	// lineTo
	path1.moveTo( vec2( 0.0, 0.0 ) );
	path1.lineTo( vec2( 100.0, 100.0 ) );
	path1.lineTo( vec2( 200.0, 0.0 ) );
	path1.lineTo( vec2( 300.0, 100.0 ) );
	path1.lineTo( vec2( 400.0, 0.0 ) );
	
	// quadTo - waves
	float waveWidth = 100.0;
	path2.moveTo( vec2( 0.0, 50.0 ) );
	for( int i = 0; i < 5; i++ ) {
		float startX = i * waveWidth;
		path2.quadTo( vec2( startX, 0.0 ), vec2( startX + waveWidth / 2.0, 0.0 ) );
		path2.quadTo( vec2( startX + waveWidth / 2.0, 50.0 ), vec2( startX + waveWidth, 50.0 ) );
	}
	
	// curveTo
	path3.moveTo( zero<vec2>() );
	path3.curveTo( vec2( 25.0, 0.0 ), vec2( 50.0, 25.0 ), vec2( 50.0, 50.0 ) );
	
	// arc & arcTo
//	path4.moveTo( zero<vec2>() );
	path4.arc( vec2( 25.0, 25.0 ), 25.0, 0.0, pi<float>() );
	
	path5.moveTo( vec2( 0.0, 0.0 ) );
	// end point, tangent position, radius
	path5.arcTo( vec2( 50.0, 50.0 ), vec2( 50.0, 0.0 ), 50.0 );
	
	// snowflake using 
	
}

void Path2DSamplesApp::mouseDown( MouseEvent event )
{
}

void Path2DSamplesApp::update()
{
}

void Path2DSamplesApp::draw()
{
	gl::enableAlphaBlending();
	
	gl::clear( Color( 0, 0, 0 ) );
		
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 50.0, 50.0 ) );
		drawPath( path1 );
	}
	
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 50.0, 200.0 ) );
		drawPath( path2 );
	}
	
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 50.0, 300.0 ) );
		drawPath( path3 );
	}
	
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 200.0, 300.0 ) );
		drawPath( path4 );
	}
	
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 350.0, 300.0 ) );
		drawPath( path5 );
	}
	// draw outlines
	// draw solid
}

void Path2DSamplesApp::drawPath( const cinder::Path2d &path )
{
	gl::color( Color( 1, 0 ,0 ) );
	
	// draw path
	gl::draw( path );
	
	//draw points
	gl::color( 1, 1, 0 );
	for( int i = 0; i < path.getPoints().size(); i++ ) {
		vec2 point = path.getPoint( i );
		gl::drawSolidRect( Rectf( -2.0, -2.0, 2.0, 2.0 ) + point );
		
//		gl::drawLine( path.getPosition( t ), mPath.getPosition( t ) + normalize( mPath.getTangent( t ) ) * 80.0f );
		
	}
	
	// draw point along the curve
	gl::color( 1, 0, 1 );
	float pos = ( getElapsedSeconds() * 0.25f );
	pos -= floor( pos );
	
	vec2 pt = path.getPosition( pos );
	gl::drawSolidCircle( pt, 4.0 );
	
	//
//	gl::color( 0, 1, 1 );
//	pt = path.getTangent( pos );
//	gl::drawSolidCircle( pt, 4.0 );
	
	
	//draw lines between points depending on their segment type
	gl::color( 1, 0, 1 );
	int ptCount = 0;
	for( int i = 0; i < path.getSegments().size(); i++ ) {
		auto segment = path.getSegments()[i];
//		console() << " --- " << segment << " --- "<< endl;
		auto points = path.getPoints();
		
		// if segment type == Path2d::SegmentType::CUBICTO
		// draw lines between
		if( segment == Path2d::SegmentType::QUADTO ) {
			vec2 pt1 = path.getPoints()[ptCount];
			vec2 pt2 = path.getPoints()[ptCount + 1];
			vec2 pt3 = path.getPoints()[ptCount + 2];
			if( segment == Path2d::SegmentType::QUADTO ) {
				gl::drawLine( pt1, pt2 );
				gl::drawLine( pt2, pt3 );
			}
		}
		
		if( segment == Path2d::SegmentType::CUBICTO ) {
			vec2 pt1 = path.getPoints()[ptCount + 0];
			vec2 pt2 = path.getPoints()[ptCount + 1];
			vec2 pt3 = path.getPoints()[ptCount + 2];
			vec2 pt4 = path.getPoints()[ptCount + 3];
			gl::drawLine( pt1, pt2 );
			gl::drawLine( pt3, pt4 );
		}
		
		
//		path.getSegmentTangent(size_t segment, float t)
//		console() << segment << endl;
//		vec2 point = path.getPoint( i );
//		gl::drawSolidRect( Rectf( -2.0, -2.0, 2.0, 2.0 ) + point );
		
		if( segment == Path2d::SegmentType::MOVETO || segment == Path2d::SegmentType::LINETO )
			ptCount += 1;
		if( segment == Path2d::SegmentType::CUBICTO )
			ptCount += 3;
		if( segment == Path2d::SegmentType::QUADTO )
			ptCount += 2;
	}
	
	
	gl::color( 1, 1, 1, 0.2 );
//	gl::drawSolidRect( path.calcBoundingBox() );			// box around everything (including points)
	gl::drawSolidRect( path.calcPreciseBoundingBox() );		// box around just the path itself
	
	// calculate length of path
	gl::drawString( "length: " + to_string( path.calcLength() ), vec2( 0.0, -10.0 ) );
	
	// not sure what these do
	/*static int		calcQuadraticBezierMonotoneRegions( const vec2 p[3], float resultT[2] );
	static vec2	calcQuadraticBezierPos( const vec2 p[3], float t );
	static vec2	calcQuadraticBezierDerivative( const vec2 p[3], float t );
	static int		calcCubicBezierMonotoneRegions( const vec2 p[4], float resultT[4] );
	static vec2	calcCubicBezierPos( const vec2 p[4], float t );
	static vec2	calcCubicBezierDerivative( const vec2 p[4], float t );*/
	
	{
		gl::color( 0, 0, 0 );
		float time = path.calcNormalizedTime( getElapsedSeconds() * 0.25 );		// should this be used when getting position based on time?
//		float time = path.calcTimeForDistance( getElapsedSeconds() * 0.25 );	// is this based on the actual curve? No. It's based on distance of the current part of the arc or something?
		vec2 pos = path.getPosition( time );
		gl::drawSolidCircle( pos, 2.0 );
	}
	
	//
	//path.calcSegmentLength( segment number, min, max )
	// highlight  0.25 - 0.75 or each segment
	
	// position based on teh actual curve?
//	path.calcTimeForDistance(float distance)
	
	
}

CINDER_APP_NATIVE( Path2DSamplesApp, RendererGl )
