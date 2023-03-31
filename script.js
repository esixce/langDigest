document.addEventListener("DOMContentLoaded", function () {
  (function () {
    // Your code goes here

    console.log("here");

    // https://plotly.com/javascript
    // https://plotly.com/javascript/range-slider/

    // UNCOMMENT FOR WEB
    // fetch('https://github.com/esixce/textDigest/blob/main/output/stemmed_tokens.csv')
    // .then(response => response.text())
    // .then(data => {
    //   // Use Papa Parse to parse the CSV data into an array of objects
    //   const parsedData = Papa.parse(data, { header: true }).data;

    //   // Do something with the parsed data, such as printing it to the console
    //   console.log(parsedData);
    // })
    // .catch(error => {
    //   // Handle any errors that occur during the fetch request
    //   console.error(error);
    // });

    // // // COMMENT OUT FOR WEB
    // fetch("/input/stemmed_tokens.csv")
    //   .then((response) => response.text())
    //   .then((data) => {
    //     // Use the data to create an NLTK visualization
    //     //   console.log(data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });


    const freqTable = {};

    Papa.parse("/input/txtSpecs.csv", {
      download: true,
      header: true,
      complete: function (results) {
        results.data.forEach(function (row) {
          freqTable[row.Token] = parseInt(row.Frequency);
        });
        wordCloud(freqTable)
      },
    });

    // // COMMENT OUT FOR WEB
    fetch("/input/txtSpecs.csv")
      .then((response) => response.text())
      .then((freqTable) => {
        // Use the data to create an NLTK visualization
        //   console.log(freqTable);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    var trace1 = {
      x: [1, 2, 3],
      y: [4, 3, 2],
      type: "scatter",
    };

    var trace2 = {
      x: [20, 30, 40],
      y: [30, 40, 50],
      xaxis: "x2",
      yaxis: "y2",
      type: "scatter",
    };

    var stuff = [trace1, trace2];

    var layout3 = {
      yaxis2: {
        domain: [0.6, 0.95],
        anchor: "x2",
      },
      xaxis2: {
        domain: [0.6, 0.95],
        anchor: "y2",
      },
    };

    Plotly.newPlot("myDiv", stuff, layout3);

    var rawDataURL =
      "https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv";
    var xField = "Date";
    var yField = "Mean_TemperatureC";

    var selectorOptions = {
      buttons: [
        {
          step: "month",
          stepmode: "backward",
          count: 1,
          label: "1m",
        },
        {
          step: "month",
          stepmode: "backward",
          count: 6,
          label: "6m",
        },
        {
          step: "year",
          stepmode: "todate",
          count: 1,
          label: "YTD",
        },
        {
          step: "year",
          stepmode: "backward",
          count: 1,
          label: "1y",
        },
        {
          step: "all",
        },
      ],
    };

    Plotly.d3.csv(rawDataURL, function (err, rawData) {
      if (err) throw err;

      var data = prepData(rawData);
      var layout2 = {
        title: "Time series with range slider and selectors",
        xaxis: {
          rangeselector: selectorOptions,
          rangeslider: {},
        },
        yaxis: {
          fixedrange: true,
        },
      };

      Plotly.plot("graph", data, layout2, { showSendToCloud: true });
    });

    function prepData(rawData) {
      var x = [];
      var y = [];

      console.log(rawData.length);

      rawData.forEach(function (datum, i) {
        if (i % 100) return;

        x.push(new Date(datum[xField]));
        y.push(datum[yField]);
      });

      return [
        {
          mode: "lines",
          x: x,
          y: y,
        },
      ];
    }


    function wordCloud(freqTable) {

      const otherThing = {
        apple: 10,
        banana: 8,
        orange: 6,
        grape: 4,
        pear: 2,
      };

      // Define the dimensions of the word cloud
      const width = 600;
      const height = 400;

      // Define the word cloud layout
      const layout = d3.layout
        .cloud()
        .size([width, height])
        .words(
          Object.entries(freqTable).map(([text, value]) => ({ text, value }))
        )
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize((d) => d.value * 10)
        .on("end", draw);

      // Generate the word cloud
      layout.start();

      // Define the draw function
      function draw(words) {
        d3.select("#word-cloud")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`)
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", (d) => `${d.size}px`)
          .style("font-family", "Arial")
          .style("fill", "steelblue")
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            (d) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`
          )
          .text((d) => d.text);
      }
    }
  })();
});
