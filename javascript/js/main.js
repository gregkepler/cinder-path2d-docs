;(function($, window) {
		
	// array of paper scope
	var papers = [];
	var COLOR_LINE_TO = '#00FF00';
	var COLOR_QUAD_TO = '#0000FF';
	var COLOR_CUBIC_TO = '#FFFF00';
	// var paper = window.paper;
// console.log(paper);

	

	window.app = {

		lineto: {
			
			canvas: null,
			paperScope: null,
			tool: null,
			init: function(){

				var curPaper = new paper.PaperScope();
				curPaper.setup($('#lineto')[0]);
				papers.push( curPaper );

				// draw the initial path
				var path = new curPaper.Path();
					path.strokeColor = COLOR_LINE_TO;
					path.moveTo( new curPaper.Point(50.0, 50.0) );
					path.lineTo( new curPaper.Point(150.0, 150.0) );
					path.lineTo( new curPaper.Point(250.0, 50.0));
					path.lineTo( new curPaper.Point(350.0, 150.0) );
					path.lineTo( new curPaper.Point(450.0, 50.0) );
				curPaper.view.draw();
				
				tool = new curPaper.Tool();
				tool.onMouseMove = function(event) {
					curPaper.project.activeLayer.selected = false;
					// log("item", event);
					if (event.item) {
						// log("select item");
						event.item.selected = true;

					}
				}
				
				var segment, path;

				var hitOptions = {
					segments: true,
					stroke: true,
					fill: true,
					tolerance: 5
				};

				tool.onMouseDown = function(event) {
					segment = path = null;
					var hitResult = curPaper.project.hitTest(event.point, hitOptions);
					if (!hitResult)
						return;

					if (hitResult) {
						path = hitResult.item;
						if (hitResult.type == 'segment') {
							segment = hitResult.segment;
							console.log("SEGMENT");
						}
					}
					movePath = hitResult.type == 'fill';
					if (movePath)
						project.activeLayer.addChild(hitResult.item);
				}

				tool.onMouseDrag = function(event) {
					if (segment) {
						segment.point = event.point;
					}

					if (movePath){
						path.position += event.delta;
					}

					app.output.update( path );
				}

				app.output.update( path );
			}
		},

		quadto: {

			div: null,

			canvas: null,

			init: function(){
				
				var curPaper = new paper.PaperScope();
				curPaper.setup($('#quadto')[0]);
				papers.push( curPaper );

				
				var path = new curPaper.Path();

				/*path.strokeColor = '#ff0000';
				path.moveTo( new curPaper.Point(50.0, 50.0) );
				path.lineTo( new curPaper.Point(150.0, 150.0) );
				path.lineTo( new curPaper.Point(250.0, 50.0));
				path.lineTo( new curPaper.Point(350.0, 150.0) );
				path.lineTo( new curPaper.Point(450.0, 50.0) );
				curPaper.view.draw();*/


				// quadTo - waves
				var waveWidth = 100.0;
				path.moveTo( new curPaper.Point(0.0, 50.0) );
				path.strokeColor = COLOR_QUAD_TO;
				for( var i = 0; i < 5; i++ ) {
					var startX = i * waveWidth;
					path.quadraticCurveTo( new curPaper.Point( startX, 0.0 ), new curPaper.Point( startX + waveWidth / 2.0, 0.0 ) );
					path.quadraticCurveTo( new curPaper.Point( startX + waveWidth / 2.0, 50.0 ), new curPaper.Point( startX + waveWidth, 50.0 ) );

				}
				curPaper.view.draw();
			}
		},

		output: {

			div: null,

			init: function(){
				div = $( '#output' );
			},

			update: function( path ){

				var segments = path.segments;
				log( "segments", segments );
				var p = "mPath";
				var code = "Path2d mPath;<br>";

				for(var i=0; i<segments.length; i++){
					var segment = segments[i];
					console.log( segment, segment.point);

					if(i == 0){
						code += "mPath.moveTo( Vec2f( " + segment.point.x + ", " + segment.point.y + " ) );<br>" 
					}else{
						code += "mPath.lineTo( Vec2f( " + segment.point.x + ", " + segment.point.y + " ) );<br>" 
					}
				}

				code += "gl::draw( mPath );";
				div.html( code );
				log(code);
			}
		}
	}

	$(document).ready( function(){
		if($( '#output' ).size() > 0) {window.app.output.init();}
		if($( '#lineto' ).size() > 0) {window.app.lineto.init();}
		if($( '#quadto' ).size() > 0) {window.app.quadto.init();}	
	});
	

}(jQuery, window));
