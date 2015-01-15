#include "cinder/app/AppNative.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"
#include "cinder/Path2d.h"
#include "cinder/Text.h"
#include "cinder/CinderMath.h"
#include "cinder/Rand.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class Path2DSamplesApp : public AppNative {
  public:
	void prepareSettings(Settings *settings) override;
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
	Path2d path6;	// test for contains
//	std::vector<vec2>	intersectPts;
	std::vector<std::pair<vec2,vec2>>	intersectPts;	// pt and velocity
	std::vector<Path2dCalcCache>		pathCaches;
};

void Path2DSamplesApp::prepareSettings( Settings *settings )
{
	settings->setWindowSize( 800, 600 );
}

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
	path3.moveTo( vec2( 0 ) );
	path3.curveTo( vec2( 25.0, 0.0 ), vec2( 50.0, 25.0 ), vec2( 50.0, 50.0 ) );
	
	// arc & arcTo
//	path4.moveTo( zero<vec2>() );
//	path4.arc( vec2( 25.0, 25.0 ), 25.0, 0.0, glm::pi<float> );
	path4.arc( vec2( 25.0, 25.0 ), 25.0, 0.0, M_PI );
	
	
	path5.moveTo( vec2( 0.0, 0.0 ) );
	// end point, tangent position, radius
	path5.arcTo( vec2( 50.0, 50.0 ), vec2( 50.0, 0.0 ), 25.0 );
	
	// path for contains
	path6.moveTo( vec2( 0.0, 0.0 ) );
	path6.quadTo( vec2( 80.0, 30.0), vec2( 100, 50) );
	path6.quadTo( vec2( 180.0, 50.0), vec2( 210.0, 20.0) );
	path6.quadTo( vec2( 270.0, 10.0), vec2( 280.0, 100.0) );
	path6.quadTo( vec2( 200.0, 150.0), vec2( 140.0, 100.0) );
	path6.quadTo( vec2( 100.0, 150.0), vec2( 50.0, 80.0) );
	path6.close();
	
	// points to look for intersection
	for( int i = 0; i < 50; i++ ) {
		auto bounds = path6.calcBoundingBox();
		std::pair<vec2, vec2> pair;
		pair.first = vec2( randFloat( bounds.x1 , bounds.x2), randFloat( bounds.y1, bounds.y2 ) );
		pair.second = vec2( randFloat( -1, 1), randFloat( -1, 1) );
		intersectPts.push_back( pair );
	}
	
	
	// move over a bit and dot affine matrix copies and rotate
	{
		int amount = 10;
		
		for( int i = 0; i < amount; i++ ){
			MatrixAffine2<float> affineMtrx;
			affineMtrx.scale( 0.3 );
			affineMtrx.rotate( ( ( M_PI * 2) / 8 ) * i );
			auto pathCopy = path2.transformCopy( affineMtrx );
			pathCaches.emplace_back( pathCopy );
		}
	}

	
	
	// snowflake using 
	
	
}

void Path2DSamplesApp::mouseDown( MouseEvent event )
{
}

void Path2DSamplesApp::update()
{
	auto bounds = path6.calcBoundingBox();
	for( auto &pt : intersectPts ){
		vec2 &pos = pt.first;
		vec2 &vel = pt.second;
		pos += vel;
		
		if( pos.x > bounds.x2 || pos.x < bounds.x1 ) {
			pos.x -= vel.x;
			pt.second.x *= -1.0;
		}
		
		if( pos.y > bounds.y2 || pos.y < bounds.y1 ) {
			pos.y -= vel.y;
			pt.second.y *= -1.0;
		}
	}
			
	
//			pt.second *= vec2( -1, 1 );
//		}
		/*
		if( pos.y > bounds.y2 || pos.y < bounds.y1 )
			pt.second *= vec2( 1, -1 );
		*/
		
//		Color ptColor = ( path6.contains( pt ) ) ? Color( 0, 1, 0 ) : Color( 1, 0, 0 );
//		gl::color( ptColor );
//		gl::drawSolidCircle( pt, 2.0 );
	
}

void Path2DSamplesApp::draw()
{
	gl::enableAlphaBlending();
	
	gl::clear( Color( 0, 0, 0 ) );
	
	gl::lineWidth( 1.0 );
		
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
	
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 50.0, 400.0 ) );
		
		gl::color( Color( 1, 0 ,0 ) );
		gl::draw( path6 );

		
		for( auto &pt : intersectPts ){
			Color ptColor = ( path6.contains( pt.first ) ) ? Color( 0, 1, 0 ) : Color( 1, 0, 0 );
			gl::color( ptColor );
			gl::drawSolidCircle( pt.first, 2.0 );
		}
		
		gl::color( 1, 1, 1, 0.2);
		gl::drawSolidRect( path6.calcBoundingBox() );
	}
	
	gl::lineWidth( 2.0 );
	
	{
		gl::ScopedMatrices mtrx;
		gl::translate( vec2( 600, 400 ) );
		
		float timePos =  ( getElapsedSeconds() * 10.0f );
		int amt = 10;
	
			
		for( int i = 0; i < pathCaches.size()-1; i++ ) {
			auto path1 = pathCaches[i];
			
			Path2dCalcCache path2 = pathCaches[i + 1];
			
			
			float time = timePos;
			
			for( int j = 0; j < amt; j++ ) {
				time += 20.0;
				float time1 = path1.calcTimeForDistance( time );
				vec2 pt1 = path1.getPosition( time1 );
			
				float time2 = path2.calcTimeForDistance( time );
				vec2 pt2 = path2.getPosition( time2 );
				
				gl::color( 1, 1, 1, 1);
				gl::drawLine( pt1, pt2 );


		}
			gl::color( 1, 1, 1, 0.2);
			gl::draw(path1.getPath2d());
		}
		
	}
	
	// draw outlines
	// draw solid
	
//	console() << " _ " << endl;
	
	
	
	
	gl::pushMatrices();
	gl::translate( vec2( 600, 50 ) );
	gl::color( 1, 1, 1 );
	vec2 toPt = vec2( 100, 100 );
	vec2 tanPt = vec2( 0, 50 );
	Path2d arcTo1;
	arcTo1.moveTo( 0, 0 );
	arcTo1.arcTo( toPt, tanPt, 100.0 );
	gl::draw( arcTo1 );
	
	gl::drawSolidCircle( vec2(0, 0), 3 );
	gl::drawSolidCircle( toPt, 3 );
	gl::drawSolidCircle( tanPt, 3 );
	
	
	for( int i = 0; i < arcTo1.getPoints().size(); i++ ) {
		auto point = arcTo1.getPoints()[i];
		gl::color( 1, 0, 0 );
		gl::drawSolidCircle( point, 2 );
	}
	
	gl::popMatrices();
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
	

	gl::drawLine( pt, pt + normalize(path.getTangent( pos )) * 25.0f );
	gl::drawLine( pt, pt - normalize(path.getTangent( pos )) * 25.0f );
	
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
		
		/*if( segment == Path2d::SegmentType::MOVETO || segment == Path2d::SegmentType::LINETO )
			ptCount += 1;
		if( segment == Path2d::SegmentType::CUBICTO )
			ptCount += 3;
		if( segment == Path2d::SegmentType::QUADTO )
			ptCount += 2;*/
		
		ptCount += path.sSegmentTypePointCounts[segment];
	}
	
	
	gl::color( 1, 1, 1, 0.2 );
//	gl::drawSolidRect( path.calcBoundingBox() );			// box around everything (including points)
	gl::drawSolidRect( path.calcPreciseBoundingBox() );		// box around just the path itself
//	gl::drawStrokedRect(path.calcPreciseBoundingBox());
	
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
//		float time = path.calcNormalizedTime( getElapsedSeconds() * 0.25 );		// should this be used when getting position based on time?
		float time = path.calcTimeForDistance( getElapsedSeconds() * 20.0 );		// distance based. so 100 is 100 pixels along the path. It loops. Returns a time
//		console() << getElapsedSeconds() * 20.0 << " " << time << endl;
		vec2 pos = path.getPosition( time );
		gl::drawSolidCircle( pos, 2.0 );
	}
	
	
	// subdivides curves into points. You can construct a simplified curve that way
	auto subdivided = path.subdivide( 0.1 );
	for( auto d : subdivided ) {
		gl::color( 0, 1, 1 );
		gl::drawStrokedCircle( d, 3.0 );
	}
	
	
	// move over a bit and dot affine matric copies and rotate
	{
		gl::ScopedMatrices mtrx;
		gl::translate( path.calcBoundingBox().getWidth(), 0 );
		
		for( int i = 0; i < 8; i++ ){
			MatrixAffine2<float> affineMtrx;
			affineMtrx.scale( 0.25 );
			affineMtrx.rotate( ( ( M_PI * 2) / 8 ) * i );
			auto pathCopy = path.transformCopy( affineMtrx );
			gl::draw( pathCopy );
		}
	}
	
	
	//
	//path.calcSegmentLength( segment number, min, max )
	// highlight  0.25 - 0.75 or each segment
	
//	path.getSegmentRelativeT(float t, size_t *segment, float *relativeT) // used internally when getting positions. tangents, etx
	
	//path.segmentSolveTimeForDistance(size_t segment, float segmentLength, float segmentRelativeDistance, float tolerance, int maxIterations) // should use calcNormalizedTime or calcTimeForDistance
	

	
	
	// Path2d article
	
	// simple drawing
	
	// drawing and adding points after
	
	// drawing and then moving handles
	
	
	
	// idea: draw path that then controls sound - pitch, volume, and other stuff - using the curve
}

CINDER_APP_NATIVE( Path2DSamplesApp, RendererGl )
