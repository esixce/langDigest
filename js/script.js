$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
});
// total number of words
// total number of sentences
// total number of unique words
// total number of stemmed non-stop words

// graphs:
//    word cloud [swap source words / stemmed]
//    frequency dist [alphabetical, ascending count, appearance]
//    interactive scatter plot

(function (global) {
  var dc = {};

  var dashboardHtmlUrl = "snippets/dashboard.html";
  var paramHtmlUrl = "snippets/param-snippet.html";
  var textHtmlUrl = "snippets/text-snippet.html";
  var aboutHtmlUrl = "snippets/about-snippet.html";

  let csvFiltered;
  let csvTokens;
  const freqTable = {};
  const myText = {};
  myText.words = "";
  const tokenList = [];

  fetch("input/tokensFiltered.csv")
    .then((response) => response.text())
    .then((data) => {
      csvFiltered = Papa.parse(data, { header: true }).data;
    })
    .catch((error) => {
      console.error(error);
    });

  fetch("input/tokensClean.csv")
    .then((response) => response.text())
    .then((data) => {
      csvTokens = Papa.parse(data, { header: true }).data;
    })
    .catch((error) => {
      console.error(error);
    });

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}' with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Load the menu categories view
  dc.loadDashboard = function () {
    showLoading("#main-content");
    buildAndShowDashboardHTML();
  };

  // Load the menu categories view
  dc.loadText = function () {
    buildAndShowTextHTML();
  };

  // Load the menu categories view
  dc.loadAbout = function () {
    buildAndShowAboutHTML();
  };

  function buildAndShowTextHTML() {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      textHtmlUrl,
      function (textHtml) {
        var textHtml = insertProperty(
          textHtml,
          "title",
          "Chat GPT Conversation"
        );
        insertHtml("#main-content", textHtml);
      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  function buildAndShowDashboardHTML() {
    $ajaxUtils.sendGetRequest(
      dashboardHtmlUrl,
      function (homeHtml) {
        $ajaxUtils.sendGetRequest(
          paramHtmlUrl,
          function (paramsHtml) {
            insertHtml("#main-content", paramsHtml + homeHtml);

            csvTokens.forEach(function (row) {
              freqTable[row.Token] = parseInt(row.Frequency);
              tokenList.push(row.Token);
            });
            // console.log(freqTable);
            wordCloud();
            barChart();
            sentiment();
            testDiv();
          },
          false
        );
      },
      false
    );
  }

  function buildAndShowAboutHTML() {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      aboutHtmlUrl,
      function (aboutHtml) {
        insertHtml("#main-content", aboutHtml);
      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    buildAndShowDashboardHTML();
  });

  function barChart() {
    var margin = { top: 20, right: 30, bottom: 70, left: 20 },
      // width = 960 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
    const container = document.getElementById("bar-chart");
    const width = container.clientWidth;

    var svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create x scale
    var x = d3.scaleBand().range([0, width]).padding(0.1);
    x.domain(
      csvFiltered.map(function (d) {
        return d.Token;
      })
    );

    // create y scale
    var y = d3.scaleLinear().range([height, 0]);
    y.domain([
      0,
      d3.max(csvFiltered, function (d) {
        return d.Frequency;
      }),
    ]);

    // create bars
    svg
      .selectAll(".bar")
      .data(csvFiltered)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.Token);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.Frequency);
      })
      .attr("fill", "#576CBC") // set the bars to blue
      .attr("height", function (d) {
        return height - y(d.Frequency);
      });

    // add x-axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("dx", "-1.5em")
      .attr("dy", "-0.5em")
      .style("fill", "#0B2447") // set the color of the labels
      .style("stroke", "#0B2447") // set the color of the tick marks
      .style("font-size", "10px") // set the font size of the labels
      .style("text-anchor", "end");

    // add y-axis
    svg.append("g").call(d3.axisLeft(y));
  }

  function wordCloud() {
    // Define the dimensions of the word cloud
    // const width = 600;
    const height = 400;
    const container = document.getElementById("word-cloud");
    const width = container.clientWidth;
    // const height = container.clientHeight;

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
        .style("fill", "#576CBC")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`
        )
        .text((d) => d.text);
    }
  }

  function sentiment() { 
    // Sample data for text analysis
    const data = [
      { word: "happy", frequency: 10, sentiment: 0.8 },
      { word: "sad", frequency: 5, sentiment: -0.6 },
      { word: "angry", frequency: 8, sentiment: -0.4 },
      { word: "love", frequency: 12, sentiment: 0.9 },
      { word: "hate", frequency: 4, sentiment: -0.8 },
    ];
    
    // Create a scatterplot of sentiment vs frequency
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = d3
      .select("#sentiment")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear().domain([0, d3.max(data, (d) => d.frequency)]).range([0, width]);
    const y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);
    
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    
    svg.append("g").call(d3.axisLeft(y));
    
    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.frequency))
      .attr("cy", (d) => y(d.sentiment))
      .attr("r", 5)
      .style("fill", "blue");
    
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.frequency) + 10)
      .attr("y", (d) => y(d.sentiment))
      .text((d) => d.word)
      .style("font-size", "12px");
        
  }
  
  function testDiv() { //test-div
  }
  

  global.$dc = dc;
})(window);

