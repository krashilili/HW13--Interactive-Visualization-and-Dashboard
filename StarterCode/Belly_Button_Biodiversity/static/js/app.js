function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var metaDataUrl = `metadata/${sample}`;
    d3.json(metaDataUrl).then(function(data){
        // Use d3 to select the panel with id of `#sample-metadata`
        var panel = d3.select('#sample-metadata');
        // Use `.html("") to clear any existing metadata
        panel.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(data).forEach(function([key, value]){
            panel.append('span').text(`${key}: ${value}`);
            panel.append('br');
        });
        // console.log(entries);
        // BONUS: Build the Gauge Chart
        buildGauge(data.WFREQ);
    })

}




// function buildGauge(sample){
//     var gaugeDataUrl = `wfreq/${sample}`;
//
//     d3.json(gaugeDataUrl).then(function(data) {
//         var wfreq = data.WFREQ;
//         // Enter a speed between 0 and 180
//         var level = 20* wfreq;
//
//         // Trig to calc meter point
//         var degrees = 180-level,
//             radius = .5;
//         var radians = degrees * Math.PI / 180;
//         var x = radius * Math.cos(radians);
//         var y = radius * Math.sin(radians);
//
//         // Path: may have to change to create a better triangle
//         var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//             pathX = String(x),
//             space = ' ',
//             pathY = String(y),
//             pathEnd = ' Z';
//         var path = mainPath.concat(pathX, space, pathY, pathEnd);
//
//         var data = [
//             {
//                 type: 'scatter',
//                 x: [0],
//                 y: [0],
//                 marker: {size: 28, color: '850000'},
//                 showlegend: false,
//                 name: 'speed',
//                 text: level,
//                 hoverinfo: 'text+name'
//             },
//             {
//                 values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
//                 rotation: 90,
//                 text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1'],
//                 textinfo: 'text',
//                 textposition: 'inside',
//                 marker: {
//                     colors: ['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//                         'rgba(255, 255, 255, 0)','rgba(255, 255, 255, 0)',
//                         'rgba(14, 127, 0, .5)']
//                 },
//                 // labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
//                 hoverinfo: 'label',
//                 hole: .5,
//                 type: 'pie',
//                 showlegend: false
//             }];
//
//         var layout = {
//             shapes: [{
//                 type: 'path',
//                 path: path,
//                 fillcolor: '850000',
//                 line: {
//                     color: '850000'
//                 }
//             }],
//             title: '<b>Gauge</b> <br> Speed 0-100',
//             height: 500,
//             width: 500,
//             xaxis: {
//                 zeroline: false, showticklabels: false,
//                 showgrid: false, range: [-1, 1]
//             },
//             yaxis: {
//                 zeroline: false, showticklabels: false,
//                 showgrid: false, range: [-1, 1]
//             }
//         };
//
//         Plotly.newPlot('gauge', data, layout);
//     })
//
//
// }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sample_data_url = `samples/${sample}`;

    d3.json(sample_data_url).then(function(data){

        // Grab the top 10 values
        var topTenOtuIds = data.otu_ids.slice(0,10);
        var topTenOtuLabels = data.otu_labels.slice(0,10);
        var topTenSampleValues = data.sample_values.slice(0,10);

        // display on the console
        // console.log(topTenOtuIds);
        // console.log(topTenOtuLabels);
        // console.log(topTenSampleValues);

        // @TODO: Build a Bubble Chart using the sample data
        var BubbleChartTraceData =  [{
              x: data.otu_ids,
              y: data.sample_values,
              // type: 'scatter',
              mode: 'markers',
              text: data.otu_labels,
              marker: {
                color: data.otu_ids,
                // opacity: [1, 0.8, 0.6, 0.4],
                size: data.sample_values
              }
        }];

        var BubbleChartLayout = {
        hovermode:'closest',
        title:'Bubble Chart',
        xaxis:{zeroline:false, title: 'OTU ID'},
        yaxis:{zeroline:false, title: 'Sample Values'}
        };

        // @TODO: Build a Pie Chart
        var PieChartTraceData = [{
            "labels": topTenOtuIds,
            "values": topTenSampleValues,
            "hovertext": topTenOtuLabels,
            "type": "pie"
        }];
        // Select the element
        // var PIE = d3.select('#pie');
        Plotly.newPlot('pie', PieChartTraceData);

        Plotly.newPlot('bubble',BubbleChartTraceData, BubbleChartLayout);
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).

    })

}




function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
