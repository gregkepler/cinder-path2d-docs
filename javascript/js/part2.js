(function($, window) {

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
			path2d.moveTo( new Point( 50.0, 50.0 ) );
			path2d.lineTo( new Point( 150.0, 150.0 ) );
			path2d.lineTo( new Point( 250.0, 50.0 ) );
			path2d.lineTo( new Point( 350.0, 150.0 ) );
			path2d.lineTo( new Point( 450.0, 50.0 ) );

			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
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
		},

		drawInitialPath: function( ) {
			
			// quadTo - waves
			var curPaper = this.curPaper;
			var waveWidth = 180.0;
			var waveHeight = waveWidth/2.0;
			
			// Path2d wrapper
			var path2d = new cidocs.Path2d( this.curPaper );
			path2d.moveTo( new Point( 0.0, waveHeight ) );
				
			for( var i = 0; i < 3; i++ ) {
				var startX = i * waveWidth;
				path2d.quadTo( new Point( startX, 0.0 ), new Point( startX + waveWidth / 2.0, 0.0 ) );
				path2d.quadTo( new Point( startX + waveWidth / 2.0, waveHeight ), new Point( startX + waveWidth, waveHeight ) );
			}
			
			// path2d.setPosition( new Point( 100, 100 ) );
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );

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
			path2d.moveTo( new Point( 0.0, 0.0 ) );
			path2d.cubicTo( new Point( 50.0, 0.0 ), new Point( 100.0, 50.0 ), new Point( 100.0, 100.0 ) );
			path2d.cubicTo( new Point( 100.0, 250.0 ), new Point( 300.0, 250.0 ), new Point( 300.0, 100.0 ) );
			path2d.cubicTo( new Point( 300.0, 50.0 ), new Point( 350.0, 0.0 ), new Point( 400.0, 0.0 ) );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.CubicToSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	ArcSketch
	// +———————————————————————————————————————+

	cidocs.ArcSketch = function( options ) {

		cidocs.Path2dSketch.call( this, options );
	}

	cidocs.ArcSketch.prototype = {

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();

			this.addButton( 'reverseArc', "Reverse Arc" );
		},

		drawInitialPath: function( ) {
			
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );

			path2d.arc( new Point( 25.0, 25.0 ), 100.0, Math.PI * 0.5, Math.PI * 2.0, true );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
		},

		reverseArc: function() {

			this.paths[0].reverseArc();
			this.updatePath();

		},

		show: function() {

			this.superclass.show.call( this );
			this.activateButton( 'reverseArc', this.reverseArc );

		},

		hide: function() {

			this.superclass.hide.call( this );
			this.deactivateButton( 'reverseArc' );
		}

	};
	cidocs.ArcSketch.extend( cidocs.Path2dSketch );


	// +———————————————————————————————————————+
	//	ArcToSketch
	// +———————————————————————————————————————+
	
	cidocs.ArcToSketch = function( options ) {

		this._radius = 10.0;
		// this._testVal = "TEST1";
		/*var radius = 25.0;

		Object.defineProperty(this, "radius", {
	        get: function(){ return this.radius },
	        set: function(new_value){
	            //Some business logic, upperCase, for example
	            this.radius = new_value;
	        }
	    })*/

		cidocs.Path2dSketch.call( this, options );
	}
/*
	cidocs.Test = function(){
		this._testVal = "THIS IS A TEST";
	}
	cidocs.Test.prototype = {
		get testVal(){
	        return this._testVal;
	    },
	    set testVal( val ){
	        console.log( 'TEST VAL', val);
	        this._testVal = val;
	       // this.updatePath();
	    }
	}*/
	/*Object.defineProperty( cidocs.Test.prototype, "test", {
	    get: function() {
	        return this._test;
	    },
	    set: function( val ) {
	    	this._test = val;
	    }
	});*/
/*	window.testObj = new cidocs.Test();
	window.testObj.testVal = "TESTIES"
	console.log( "TEST OBJ", testObj );
	// debugger;
*/
	
	

	// _.extend( cidocs.ArcToSketch.prototype, {
	cidocs.ArcToSketch.prototype = {

		// radius: 25,

		// _radius: 25,
		// _testVal: "TEST1",
		


		/*get radius(){
	        return this._radius;
	    },
	    set radius( val ){
	        this._radius = val;
	        console.log( 'RADIUS', this._radius);
	       // this.updatePath();
	    },*/

		//_test: "TEST1",
		// get testVal(){
	 //        return this._testVal;
	 //    },
	 //    set testVal( val ){
	 //        console.log( 'TEST VAL', val);
	 //        this._testVal = val;
	 //       // this.updatePath();
	 //    },

		initialize: function( options ) {

			this.superclass.initialize.call( this, options );
			this.drawInitialPath();

			// this.addButton( 'reverseArc', "Reverse Arc" );
			//this.radius = 25;
			this.addButton( 'radius', "radius" );
		},

		drawInitialPath: function( ) {
			
			var curPaper = this.curPaper;		
			var path2d = new cidocs.Path2d( this.curPaper );

			path2d.moveTo( new Point( 0.0, 150.0 ) );
			path2d.arcTo( new Point( 150.0, 0.0 ), new Point( 0.0, 0.0 ), this.radius );
			this.paths.push( path2d );

			path2d.centerInCanvas( this.canvas );
			// this.radius = 50.0;

			// this.test = "TEST2";
			console.log( "ARC TO SKETCH", this );
		}

		
		/*reverseArc: function() {

			this.paths[0].reverseArc();
			this.updatePath();

		},

		show: function() {

			this.superclass.show.call( this );
			this.activateButton( 'reverseArc', this.reverseArc );

		},

		hide: function() {

			this.superclass.hide.call( this );
			this.deactivateButton( 'reverseArc' );
		}*/

		

	};

	/*cidocs.ArcToSketch.prototype.getTest = function() {
	    return this._test;
	  };
	  
	cidocs.ArcToSketch.prototype.setTest = function( value ) {
	    this._test = value;
	};

/*
	cidocs.ArcToSketch.prototype.__get_name = function() {

	  return this.__name + ' oliver';
	}
	 
	cidocs.ArcToSketch.prototype.__set_name = function(val) {
	  this.__name = val;
	}
	
	
	*/

	

	/*Object.defineProperty( cidocs.ArcToSketch.prototype, "test", {
	    get: function() {
	        return this._test;
	    },
	    set: function( val ) {
	    	console.log("SET TEST");
	    	this._test = val;
	    }
	});
	/*Object.defineProperty(cidocs.ArcToSketch.prototype, _radius, {
    	get: function() {return this._radius },
    	set: function( value ) { this._radius = value }
	});*/

	/*Object.defineProperties( cidocs.ArcToSketch.prototype, {
	    "radius": { 
	    	get: function () { return this._radius; },
	    	set: function (val) { this._radius = val; } 
	    }

	});*/

	
	// window.testObj = new cidocs.Test();
	// window.testObj.test = "TESTIES"
	// cidocs.ArcToSketch.prototype.radius = 25;

	cidocs.ArcToSketch.extend( cidocs.Path2dSketch );
	cidocs.ArcToSketch.addGetter( 'radius', function(){return this._radius});
	cidocs.ArcToSketch.addSetter( 'radius', function( val ){ 
		this._radius = val;
		this.paths[0].setArcRadius( this._radius );
		this.updatePath();
	});

	// cidocs.ArcToSketch.prototype.

	/*get testVal(){
	        return this._testVal;
	    },
	    set testVal( val ){
	        console.log( 'TEST VAL', val);
	        this._testVal = val;
	       // this.updatePath();
	    },*/

	/*cidocs.ArcToSketch.generateProperty( 'test', {
		defaultValue: 'TEST1'
	});
*/

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
			path2d.moveTo( new Point( 150.0, 280.0 ) );
			path2d.quadTo( new Point( 200.0, 280.0 ), new Point( 200.0, 200.0 ) );
			path2d.cubicTo( new Point( 80.0, 300.0 ), new Point( 80.0, 80.0 ), new Point( 200.0, 180.0 ) );
			path2d.cubicTo( new Point( 100.0, 60.0 ), new Point( 320.0, 60.0 ), new Point( 220.0, 180.0 ) );
			path2d.cubicTo( new Point( 340.0, 80.0 ), new Point( 340.0, 300.0 ), new Point( 220.0, 200.0 ) );
			path2d.quadTo( new Point( 220.0, 280.0 ), new Point( 270.0, 280.0 ) );
			path2d.lineTo( new Point( 150.0, 280.0 ) );
			this.paths.push( path2d );
			path2d.centerInCanvas( this.canvas );
		}
	};
	cidocs.CombinedSketch.extend( cidocs.Path2dSketch );


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
			var lineToSketch	= new cidocs.LineToSketch( { canvas:'#lineto', name:'lineto', output:this.codeModule } );
			var quadToSketch	= new cidocs.QuadToSketch( { canvas:'#quadto', name:'quadto', output:this.codeModule } );
			var cubicToSketch	= new cidocs.CubicToSketch( { canvas:'#cubicto', name:'cubicto', output:this.codeModule } );
			var arcSketch		= new cidocs.ArcSketch( { canvas:'#arc', name:'arc', output:this.codeModule } );
			var arcToSketch		= new cidocs.ArcToSketch( { canvas:'#arcto', name:'arcto', output:this.codeModule } );
			// arcToSketch.testVal = "TESTIES IN YO MOUTH";
			var combinedSketch	= new cidocs.CombinedSketch( { canvas:'#combined', name:'combined', output:this.codeModule } );
			this.sketches.push( lineToSketch, quadToSketch, cubicToSketch, arcSketch, arcToSketch, combinedSketch );	

			this.superclass.init.call( this );
		}
	}

	cidocs.Part2App.extend( cidocs.app );

	$(document).ready( function(){
		
		window.app = new cidocs.Part2App();
		app.init();
		app.show( "lineto" );

	});
	

}(jQuery, window));