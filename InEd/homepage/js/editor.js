var Canvas = null;

function resizeCanvas() {
    $('#canvas').attr('width', window.innerWidth*75/100);
    $('#canvas').attr('height', window.innerHeight*75/100);
}

$(document).ready(function() {
    resizeCanvas();
    Canvas = new fabric.Canvas('canvas');



    // console.log(fabric)
    $("#export").click(function (e) {
        e.preventDefault();
        $("#exportContainer").toggle();
    });
    $("#exportSVG").click(function () {
        var data = Canvas.toSVG();
        $(this).attr('href', "data:application/octet-stream," + encodeURIComponent(data) );
    });
    $("#exportPNG").click(function () {
        var data = Canvas.toDataURL({
            format: 'png'
        });
        $(this).attr('href', data );

    });
    $("#exportJPG").click(function () {
        var data = Canvas.toDataURL({
            format: 'jpg'
        });
        $(this).attr('href', data );

    });
    $("#AddImage").click(function (e) {
        e.preventDefault();
        $("#AddImg").toggle();
    });

    $("#addText").click(function () {
        $("#textOptions").toggle();
    });

    $( "#paintText" ).click(function() {
        var newtxt =  new fabric.IText($( "#textInput" ).val() ,
        {
          fontFamily: $("#fontFamily").val(),
          fill: $("#textStrokeColor").val(),
          fontSize: $("#sizeOfFont").val(),
          textAlign: $("#textAlign").val()
        });
        Canvas.add(newtxt);
        $( "#textInput" ).val('');
    });

    $('#imgInput').change(function (e) {
        $(this).data("file", e.target.files[0]);
    });

    $("#imgSubmit").click(function(){
        var reader = new FileReader();

        reader.onload = function(event) {
            var imgObj = new Image();
            imgObj.src = event.target.result;

            imgObj.onload = function() {

                fabric.Image.fromURL(imgObj.src, function(img) {
                    Canvas.add(img).renderAll();
                    img.myClass = "image";
                    img.name = e.target.files[0].name.split('.')[0];
                    Canvas.setActiveObject( img );
                });
            };
        };

        reader.readAsDataURL($('#imgInput').data("file"));
    });

    Canvas.on('object:selected', function(options) {
        $("#removeContainer").show();
    });

    Canvas.on('selection:cleared', function(options) {
        $("#removeContainer").hide();
    });

    $("#removeButton").click(function () {
        Canvas.remove( Canvas.getActiveObject() )

    });

    $("#addShape").click(function () {
        $("#shapeOptions").toggle();
    });

    $( "#paintSquare" ).click(function() {
      var shape = new fabric.Rect({
          left: 100,
          top: 100,
          fill: $("#shapeStrokeColor").val(),
          width: 20,
          height: 20
      });
      Canvas.add(shape);
    })

    $( "#paintCircle" ).click(function() {
      var shape = new fabric.Circle({
          left: 100,
          top: 100,
          fill: $("#shapeStrokeColor").val(),
          radius: 20
      });
      Canvas.add(shape);
    })

    $( "#paintTriangle" ).click(function() {
      var shape = new fabric.Triangle({
          left: 100,
          top: 100,
          fill: $("#shapeStrokeColor").val(),
          width: 30,
          height: 30
      });
      Canvas.add(shape);
    })


});
