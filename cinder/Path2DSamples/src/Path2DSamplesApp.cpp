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
		gl::translate( vec2( 150.0, 300.0 ) );
		drawPath( path4 );
	}
	
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 250.0, 300.0 ) );
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
	}
	
	// draw point along the curve
	gl::color( 1, 0, 1 );
	float pos = ( getElapsedSeconds() * 0.25f );
	pos -= floor( pos );
	
	vec2 pt = path.getPosition( pos );
	gl::drawSolidCircle( pt, 4.0 );
	
	//
	gl::color( 0, 1, 1 );
	pt = path.getTangent( pos );
	gl::drawSolidCircle( pt, 4.0 );
	
	/*//draw lines between points depending on their segment type
	gl::color( 1, 0, 1 );
	console() << " --- " << endl;
	for( int i = 0; i < path.getSegments().size(); i++ ) {
		auto segment = path.getSegments()[i];
//		path.getSegmentTangent(size_t segment, float t)
		console() << segment << endl;
//		vec2 point = path.getPoint( i );
//		gl::drawSolidRect( Rectf( -2.0, -2.0, 2.0, 2.0 ) + point );
	}*/
}

CINDER_APP_NATIVE( Path2DSamplesApp, RendererGl )
