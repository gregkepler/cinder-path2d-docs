;(function($, window) {
		
	// array of paper scope
	var papers = [];
	// var paper = window.paper;
// console.log(paper);

	

	// var Point = paper.Point;
	// var papers = [];

	window.app = {
		moveto_lineto: {
			// div: null,
			canvas: null,
			paperScope: null,
			tool: null,
			init: function(){
				var paper = window.paper;
				// paper.install(window);
				// window.paper.set
				papers[0] = new paper.PaperScope();
				papers[0].setup($('#moveto-lineto')[0]);

				// draw the initial path
				var _paper = papers[0];
				var path = new _paper.Path();
					path.strokeColor = '#ff0000';
					path.moveTo( new _paper.Point(50.0, 50.0) );
					path.lineTo( new _paper.Point(150.0, 150.0) );
					path.lineTo( new _paper.Point(250.0, 50.0));
					path.lineTo( new _paper.Point(350.0, 150.0) );
					path.lineTo( new _paper.Point(450.0, 50.0) );
				_paper.view.draw();
				
				tool = new _paper.Tool();
				tool.onMouseMove = function(event) {
					_paper.project.activeLayer.selected = false;
					log("item", event);
					if (event.item) {
						log("select item");
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
					var hitResult = _paper.project.hitTest(event.point, hitOptions);
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
			}
		},
		quadto: {
			div: null,
			canvas: null,
			init: function(){
				this.div = $( '#quadto' );
				this.canvas = document.getElementById('paperCanvas');

				// draw paperjs version
				// paper.setup(this.canvas);
				// var path = new paper.Path();
				/*path.strokeColor = '#ff0000';
				path.moveTo( new Point(50.0, 50.0) );
				path.lineTo( new Point(150.0, 150.0) );
				path.lineTo( new Point(250.0, 50.0));
				path.lineTo( new Point(350.0, 150.0) );
				path.lineTo( new Point(450.0, 50.0) );*/
			}
		},
		output: {
			div: null,
			init: function(){
				div = $( '#output' );
			},
			update: function( path ){
				log(path);
				var segments = path.segments;
				var p = "mPath";
				var code = "Path2d mPath;<br>";
				for(var i=0; i<segments.length; i++){
					var segment = segments[i];
					log(segment.point);
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
		if($( '#moveto-lineto' ).size() > 0) {window.app.moveto_lineto.init();}
		if($( '#output' ).size() > 0) {window.app.output.init();}
		// if($( '#quadto' ).size() > 0) {window.app.quadto.init();}	
	});
	

}(jQuery, window));
