(function($, window) {

	// +———————————————————————————————————————+
	//	CalcBoundsSketch
	// +———————————————————————————————————————+

	cidocs.CalcBoundsSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.CalcBoundsSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 126, 222 ) );
			path2d.curveTo( new Point( 82, 171 ), new Point( 173, 163 ), new Point( 189, 131 ) );
			path2d.curveTo( new Point( 200, 109 ), new Point( 209, 60 ), new Point( 254, 60 ) );
			path2d.curveTo( new Point( 299, 60 ), new Point( 307, 92 ), new Point( 315, 122 ) );
			path2d.curveTo( new Point( 327, 165 ), new Point( 414, 195 ), new Point( 375, 227 ) );
			path2d.curveTo( new Point( 336, 259 ), new Point( 293, 215 ), new Point( 250, 215 ) );
			path2d.curveTo( new Point( 211, 215 ), new Point( 150, 250 ), new Point( 126, 222 ) );
			path2d.close();
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
			this.drawBoundingBox();
		}
	};
	cidocs.CalcBoundsSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	CalcPreciseSketch
	// +———————————————————————————————————————+	

	cidocs.CalcPreciseSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.CalcPreciseSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 126, 222 ) );
			path2d.curveTo( new Point( 82, 171 ), new Point( 173, 163 ), new Point( 189, 131 ) );
			path2d.curveTo( new Point( 200, 109 ), new Point( 209, 60 ), new Point( 254, 60 ) );
			path2d.curveTo( new Point( 299, 60 ), new Point( 307, 92 ), new Point( 315, 122 ) );
			path2d.curveTo( new Point( 327, 165 ), new Point( 414, 195 ), new Point( 375, 227 ) );
			path2d.curveTo( new Point( 336, 259 ), new Point( 293, 215 ), new Point( 250, 215 ) );
			path2d.curveTo( new Point( 211, 215 ), new Point( 150, 250 ), new Point( 126, 222 ) );
			path2d.close();
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
			this.drawPreciseBoundingBox();
		}
	};

	cidocs.CalcPreciseSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	ContainsSketch
	// +———————————————————————————————————————+	

	cidocs.ContainsSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );

		var cols = Math.floor( this.canvas.width() / 15 ) - 1;
		var rows = Math.floor( (this.canvas.height() - 40) / 15 ) - 1;
		this.dots = [];

		for( var i = 0; i < cols; i++ ) {
			for( var j = 0; j < rows; j ++ ) {
				var pt = new Point( 15 + ( i * 15 ), 15 + (j * 15) );
				var circle = new Path.Circle( pt, 5 );
				circle.sendToBack();
				circle.fillColor = '#acacac';
				this.dots.push( circle );
			}
		}
	};

	cidocs.ContainsSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();

			this.loop = '\n' +
				'int cols = floor( getWindowWidth() / 15 ) - 1;\n' +
				'int rows = floor( getWindowHeight() / 15 ) - 1;\n' +
				'\n' +
				'for( int i = 0; i < cols; i++ ) {\n' +
				'	for( int j = 0; j < rows; j ++ ) {\n' +
				'		vec2 pt( 15.0 + ( i * 15.0 ), 15.0 + ( j * 15.0 ) );\n' +
				'		Color fillColor = mPath.contains( pt ) ? Color( 1.0, 0.0, 0.0 ) : Color( 0.8, 0.8, 0.8 );\n' +
				'		gl::color( fillColor );\n' +
				'		gl::drawSolidCircle( pt, 5 );\n' +
				'	}\n' +
				'}\n';				
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 126, 222 ) );
			path2d.curveTo( new Point( 82, 171 ), new Point( 173, 163 ), new Point( 189, 131 ) );
			path2d.curveTo( new Point( 200, 109 ), new Point( 209, 60 ), new Point( 254, 60 ) );
			path2d.curveTo( new Point( 299, 60 ), new Point( 307, 92 ), new Point( 315, 122 ) );
			path2d.curveTo( new Point( 327, 165 ), new Point( 414, 195 ), new Point( 375, 227 ) );
			path2d.curveTo( new Point( 336, 259 ), new Point( 293, 215 ), new Point( 250, 215 ) );
			path2d.curveTo( new Point( 211, 215 ), new Point( 150, 250 ), new Point( 126, 222 ) );
			path2d.close();
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		},

		drawPath: function() {
			this.superclass.drawPath.call( this );

			var self = this;
			_.each( this.dots, function( dot ) {
				dot.fillColor = self.contains( dot.position ) ? 'red' : '#acacac';
				dot.sendToBack();
			} );
		},

		updateSketch: function() {
			this.superclass.updateSketch.call( this );
			this.output.inject( this.loop );
		}

	};

	cidocs.ContainsSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	TransformCopySketch
	// +———————————————————————————————————————+	

	cidocs.TransformCopySketch = function( options ) {

		this._scale = 1.25;
		this._copyAmt = 8;

		cidocs.Path2dSketch.call( this, options );
		this.copies = [];
	};

	cidocs.TransformCopySketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );

			this.center = new Point( this.canvas.width()/2, this.canvas.height() / 2 );
			this.template = _.template('\n'+
				'gl::pushMatrices();\n' +
				'for( int i = 0; i < <%- amt %>; i++ ){\n' +
				'	gl::translate( vec2( <%- transX %>f, <%- transY %>f ) );\n' +
				'	MatrixAffine2<float> mtrx;\n' +
				'	mtrx.scale( <%- scale %>f );\n' +
				'	mtrx.rotate( ( ( M_PI * 2) / <%- amt %> ) * i );\n' +
				'	auto pathCopy = mPath.transformCopy( mtrx );\n' +
				'	gl::draw( pathCopy );\n' +
				'}\n' +
				'gl::popMatrices();\n'
			);

			this.drawInitialPath();
			this.updateSketch();

			this.addButton( 'scale', 'scale', {min:0.5, max:2.0} );
			this.addButton( 'copyAmt', 'copies', {min:2, max:15, step:1} );
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0, 0 ) );
			path2d.curveTo( new Point( 15.0, 15.0 ), new Point( 35.0, 35.0 ), new Point( 50.0, 50.0 ) );
			this.paths.push( path2d );
		},

		drawPath: function() {
			this.superclass.drawPath.call( this );

			_.each( this.copies, function( copy ) {
				copy.remove();
			} );

			this.copies = [];

			var self = this;
			var path2d = this.paths[0];
			for( var i = 0; i < this.copyAmt; i++ ) {
				var mtrx = new Matrix();
				mtrx.translate( this.center );
				mtrx.scale( this.scale );
				mtrx.rotate( ( ( 360 ) / this.copyAmt) * i );
				var pathCopy = path2d.path.clone();
				pathCopy.transform( mtrx );
				self.copies.push( pathCopy );
			}
		},

		updateSketch: function() {
			this.superclass.updateSketch.call( this );
			
			// generate code
			var code = this.template( { transX: toCiNum( this.center.x ), transY: toCiNum( this.center.y ), scale: toCiNum( this.scale ), amt: this.copyAmt } );
			this.output.inject( code );
		}
	};

	cidocs.TransformCopySketch.extend( cidocs.Path2dSketch );

	// getters and setters
	cidocs.TransformCopySketch.addGetter( 'scale', function(){ return this._scale; } );
	cidocs.TransformCopySketch.addSetter( 'scale', function( val ){ 
		this._scale = val;
		this.drawPath();
		this.updateSketch();
	});

	cidocs.TransformCopySketch.addGetter( 'copyAmt', function(){ return this._copyAmt; } );
	cidocs.TransformCopySketch.addSetter( 'copyAmt', function( val ){ 
		this._copyAmt = val;
		this.drawPath();
		this.updateSketch();
	});


	// +———————————————————————————————————————+
	//	SubdivideSketch
	// +———————————————————————————————————————+	

	cidocs.SubdivideSketch = function( options ) {

		this._scale = 0.1;
		cidocs.Path2dSketch.call( this, options );
		this.subs = [];
	};

	cidocs.SubdivideSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 100, 100 ) );
			path2d.curveTo( new Point( 100, 0 ), new Point( -50, 75 ), new Point( 25, 150 ) );
			path2d.curveTo( new Point( 100, 225 ), new Point( -50, 300 ), new Point( -50, 200 ) );

			// shange to sideways mustache
			
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );

			this.addButton( 'scale', 'scale', {min:0.01, max:1.0, step:0.01} );
		},

		drawPath: function() {
			this.superclass.drawPath.call( this );

			_.each( this.subs, function( sub ) {
				sub.remove();
			} );

			this.subs = [];

			var path2d = this.paths[0];
			var subPoints = path2d.subdivide( this.scale );

			_.each( subPoints, function( pt ){
				var circle = new Path.Circle( pt, 5 );
				circle.sendToBack();
				circle.fillColor = '#acacac';
				this.subs.push( circle );
			}, this );

			
		},
	};

	cidocs.SubdivideSketch.extend( cidocs.Path2dSketch );

	cidocs.SubdivideSketch.addGetter( 'scale', function(){ return this._scale; } );
	cidocs.SubdivideSketch.addSetter( 'scale', function( val ){ 
		this._scale = val;
		this.drawPath();
		this.updateSketch();
	});


	// +———————————————————————————————————————+
	//	CalcCacheSketch
	// +———————————————————————————————————————+	

	cidocs.CalcCacheSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	};

	cidocs.CalcCacheSketch.prototype = {

		initialize: function( options ) {
			this.superclass.initialize.call( this, options );
			this.drawInitialPath();
			this.updateSketch();
		},

		drawInitialPath: function( ) {
			
			// draw the initial path
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 50, 50 ) );
			// draw here
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};

	cidocs.CalcCacheSketch.extend( cidocs.Path2dSketch );

	// +———————————————————————————————————————+
	//	Main App
	// +———————————————————————————————————————+

	cidocs.Part2App = function() {
		cidocs.app.call( this );
	};

	cidocs.Part2App.prototype = {

		init: function(){
			
			var self = this;

			// init all the sketches
			var calcBoundsSketch	= new cidocs.CalcBoundsSketch( { canvas:'#calcbounds', name:'calcbounds', output:this.codeModule } );
			var calcPreciseSketch	= new cidocs.CalcPreciseSketch( { canvas:'#calcprecise', name:'calcprecise', output:this.codeModule } );
			var containsSketch		= new cidocs.ContainsSketch( { canvas:'#contains', name:'contains', output:this.codeModule } );
			var transformCopySketch	= new cidocs.TransformCopySketch( { canvas:'#transformcopy', name:'transformcopy', output:this.codeModule } );
			var subdivideSketch		= new cidocs.SubdivideSketch( { canvas:'#subdivide', name:'subdivide', output:this.codeModule } );
			var calcCacheSketch		= new cidocs.CalcCacheSketch( { canvas:'#calccache', name:'calccache', output:this.codeModule } );
			this.sketches.push( calcBoundsSketch, calcPreciseSketch, containsSketch, transformCopySketch, subdivideSketch, calcCacheSketch );
			
			this.superclass.init.call( this );
		}
	}

	cidocs.Part2App.extend( cidocs.app );

	$(document).ready( function(){
		
		window.app = new cidocs.Part2App();
		app.init();
		app.show( "calcbounds" );

	});
	

}(jQuery, window));