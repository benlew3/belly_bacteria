function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // var sampleData = sampleArray[];

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // var sampleFilter = sampleArray.filter(id)
    
    //  5. Create a variable that holds the first sample in the array.
    var otu_results = resultArray[0];
    //  console.log(resultArray);
    //  console.log(data.samples);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var id_for_otu = otu_results.otu_ids;
    var labels_for_otu = otu_results.otu_labels;
    var value_for_otu = otu_results.sample_values;
   // console.log(labels_for_otu)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = id_for_otu.slice(0, 10).map(otu_ids => `OTU ${otu_ids}`);
     // console.log(yticks);

    // 8. Create the trace for the bar chart. 
     var barData = [
      {
        y: yticks,
        x: value_for_otu.slice(0, 10).reverse(),
        text: labels_for_otu.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
     ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria cultures Found",
     margin: {},
     width: 450,
     height: 450
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: id_for_otu,
        y: value_for_otu,
        text: labels_for_otu,
        mode: "markers",
        marker:{
          color: id_for_otu,
          size: value_for_otu,
          colorscale: 'Jet',
        type: "bubble",
        }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture Per Sample",
      margin: {},
      width: 1000,
      hovermode:'closest',
      xaxis: {title: {text: 'OTU ID'}}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    var metadata = data.metadata;
    var washing = metadata.filter(sampleObj => sampleObj.id == sample);
    var washBelly = washing[0].wfreq;
    console.log(washBelly)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain:{ x: [0, 1], y: [0, 1]},
      value: washBelly,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      dtick: 1,
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10]},
        bar:{color:"black"},
        steps:[
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lime"},
          {range: [8,10], color:"green"}
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     height: "auto",
     margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
