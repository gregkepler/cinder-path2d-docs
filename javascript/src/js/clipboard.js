
$(document).ready(function(){

    
    $('a#copy-button').zclip( {
        path: 'ZeroClipboard.swf',
        copy: function(){ 
            console.log( "COPY", $( 'code#output' ).text() );
            var output = $( 'code#output' ).text();
            return output;
        },
        beforeCopy: function(){
            console.log( "BEFORE COPY" );
            return "";
        },
        afterCopy: function(){
           console.log( "COPIED", $( 'code#output' ).text() );
           return "";
        }                           
    });

});
                