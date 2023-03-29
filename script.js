

var trace1 = {
    x: [1, 2, 3],
    y: [4, 3, 2],
    type: 'scatter'
  };
  
  var trace2 = {
    x: [20, 30, 40],
    y: [30, 40, 50],
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter'
  };
  
  var data = [trace1, trace2];
  
  var layout = {
    yaxis2: {
      domain: [0.6, 0.95],
      anchor: 'x2'
    },
    xaxis2: {
      domain: [0.6, 0.95],
      anchor: 'y2'
    }
  };
  
  Plotly.newPlot('myDiv', data, layout);
  




  var rawDataURL = 'https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv';
  var xField = 'Date';
  var yField = 'Mean_TemperatureC';
  
  var selectorOptions = {
      buttons: [{
          step: 'month',
          stepmode: 'backward',
          count: 1,
          label: '1m'
      }, {
          step: 'month',
          stepmode: 'backward',
          count: 6,
          label: '6m'
      }, {
          step: 'year',
          stepmode: 'todate',
          count: 1,
          label: 'YTD'
      }, {
          step: 'year',
          stepmode: 'backward',
          count: 1,
          label: '1y'
      }, {
          step: 'all',
      }],
  };
  
  Plotly.d3.csv(rawDataURL, function(err, rawData) {
      if(err) throw err;
  
      var data = prepData(rawData);
      var layout = {
          title: 'Time series with range slider and selectors',
          xaxis: {
              rangeselector: selectorOptions,
              rangeslider: {}
          },
          yaxis: {
              fixedrange: true
          }
      };
  
      Plotly.plot('graph', data, layout, {showSendToCloud: true});
  });
  
  function prepData(rawData) {
      var x = [];
      var y = [];
  
      console.log(rawData.length)
  
      rawData.forEach(function(datum, i) {
          if(i % 100) return;
  
          x.push(new Date(datum[xField]));
          y.push(datum[yField]);
      });
  
      return [{
          mode: 'lines',
          x: x,
          y: y
      }];
  }

