var Canvas = null;

function resizeCanvas() {
    Canvas.setWidth($('#boardwidth').val());
    Canvas.setHeight($('#boardheight').val());
    Canvas.renderAll();
}

        charts={
            chart: null,

            chartsOnCanvas: [],

            options: {},

            addFileButon: function (){
             
                 charts.options = {
                    chart: {
                        renderTo: 'container',
                        defaultSeriesType: $('#chartType').val(),
                        borderRadius: 0,
                    },
                    title: {
                        text: ''
                    },
                    subtitle :{
                        text: ''
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [],
                    credits: {
                        enabled: false
                    }
                };

                $('#file').on('change', function(evt) {
    
                    //Retrieve the first (and only!) File from the FileList object
                    var file = evt.target.files[0];
                    // file = file;
                     charts.options.series = [];
                     charts.options.title.text = $('#title').val();
                     charts.options.subtitle.text = $('#subtitle').val();

                    $('#dummy-chart-file').val(file.name.split(".")[0]);

                    if(file) {

                        var r = new FileReader();

                        r.onload = function(e) {
                            var data = e.target.result;

                            // Split the lines
                            var lines = data.split('\n');

                            // Iterate over the lines and add categories or series
                            $.each(lines, function(lineNo, line) {
                                var items = line.split(',');

                                // header line containes categories
                                if(lineNo == 0) {
                                    $.each(items, function(itemNo, item) {
                                        if (itemNo > 0)  charts.options.xAxis.categories.push(item);
                                    });
                                }

                                    // the rest of the lines contain data with their name in the first 
                                    // position
                                else {

                                    var series = {
                                        data: []
                                    };

                                    $.each(items, function(itemNo, item) {
                                        if (itemNo == 0) {
                                            series.name = item;
                                        } else {
                                            series.data.push(parseFloat(item));
                                        }
                                    });

                                     charts.options.series.push(series);
                                }
                            });
                            // Create the chart
                            // chart = new Highcharts.Chart( charts.options);
                             charts.chart = new Highcharts.Chart( charts.options);
                        };

                        r.readAsText(file);
                    }
                });
            },

            dropdownOptions: function(){

                $('#chartType').on('change', function() {

                     charts.chart = $('#container').highcharts();

                    if( charts.chart) {
                         charts.chart.destroy();
                        var chartType = $('#chartType').val();

                         charts.options.chart.defaultSeriesType = chartType;


                         charts.chart = new Highcharts.Chart( charts.options);
                    }
                });

                $('#charts-panel #add-chart').on('click', function() {
                     loadInfographic();
                    $('#charts-wrapper').addClass('hide');
                });

                $('#charts-panel .back-button').on('click', function() {
                    $('#charts-wrapper').addClass('hide');
                });
            },
        },


        loadInfographic = function() {

                var chart = $('#charts-panel svg')[0].outerHTML;

                var dataUrl = 'data:image/svg+xml,' + encodeURIComponent(chart);

                fabric.Image.fromURL(dataUrl, function(img) {

                    img.top = 100;
                    img.left = 100;
                     Canvas.add(img);
                     charts.chartsOnCanvas.push( img );
                    img.myClass = "chart";

                });
        },

listeners= {

            menuItemButton: function() {
	$("#addChart").click(function () {

		$('#charts-wrapper').removeClass('hide');
        $('#file').val("");
        $('#dummy-chart-file').val("");
        $('#container').empty();
    });
			}
};

$(document).ready(function() {
    //resizeCanvas();
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
    $("#borderSettings").click(function (e) {
        e.preventDefault();
        $("#border").toggle();
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

    $('#boardwidth, #boardheight').change(resizeCanvas);
    $('#color').change(function () {
        Canvas.backgroundColor=$(this).val();
        //Canvas.renderTop();
        Canvas.renderAll();
    });

    // create a rectangle object
    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
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

listeners.menuItemButton();
charts.addFileButon();
         charts.dropdownOptions();
});
