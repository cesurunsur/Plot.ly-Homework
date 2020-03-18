function buildMetadata(sample) {
  d3.json("samples.json").then ((data)=>{
    var metadata = data.metadata;
    // filter the data for object 
    var resultArray = metadata.filter(sampleObj=>sampleObj.id==sample);
    var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // clear any existing metadata
    PANEL.html("");

    // Add each key and value pair to the panel
    Object.entries(result).forEach(([key,value])=>{
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
    buildGauge(result.wfreq);
  });
}

function buildCharts(sample){
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result=resultArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels=result.otu_labels;
    var sample_values =result.sample_values; 

    // Build a Buble chart
    var bubbleLayout={
      title: "Bacteria Cultures Per Sample",
      margin : { t:0},
      hovermode:"closest",
      xaxis: {title:"OTU ID"},
      margin: {t:30}
    };
    var bubbleData =[
      {
        x:otu_ids,
        y:sample_values,
        text:otu_labels,
        mode:"markers",
        marker :  {
          size: sample_values,
          color:otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yticks= otu_ids.slice(0,10).map(otuID=> `OTU ${otuID}`).reverse();
    var barData=[
      {
        y: yticks,
        x:sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h",
      }
    ];

    var barLayout= {
      title:"Top 10 Bacteria Cultures Found",
      margin: {t: 30, l:150}
    };
    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init(){
  // Grab a reference to the dropdown select element
  var selector = d3.select("selDataset");

  // populate the select options
  d3.json("samples.json").then((data)=>{
    var samplesNames = data.names;

    samplesNames.forEach((sample)=>{
      selector
        .append("option")
        .text(sample)
        .property("value",sample);
    });

    // Use thefirst sample from the list
    var firstSample= samplesNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    
  });
}
function optionChanged(newSample){
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
init();
