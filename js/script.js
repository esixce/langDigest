  // total number of words
  // total number of sentences
  // total number of unique words
  // total number of stemmed non-stop words

  // graphs:
  //    word cloud [swap source words / stemmed]
  //    frequency dist [alphabetical, ascending count, appearance]
  //    interactive scatter plot


// Same as document.addEventListener("DOMContentLoaded"...
$(function () {
  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
});

// document.addEventListener("DOMContentLoaded", function () {
(function (global) {
  var dc = {};

  var dashboardHtmlUrl = "snippets/dashboard.html";
  var textHtmlUrl = "snippets/text-snippet.html";
  var aboutHtmlUrl = "snippets/about-snippet.html";

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
    showLoading("#main-content");
    buildAndShowTextHTML();
  };

  // Load the menu categories view
  dc.loadAbout = function () {
    showLoading("#main-content");
    buildAndShowAboutHTML();
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    // On first load, show home view
    showLoading("#main-content");
    buildAndShowDashboardHTML();
    // $ajaxUtils.sendGetRequest(
    //   allCategoriesUrl,
    //   buildAndShowHomeHTML,
    //   true); // Explicitly setting the flag to get JSON from server processed into an object literal
  });

  function buildAndShowTextHTML() {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      textHtmlUrl,
      function (homeHtml) {
        // var chosenCategoryShortName = chooseRandomCategory(categories).short_name
        var newHtml = insertProperty(
          homeHtml,
          "title",
          "Chat GPT Conversation"
        );
        insertHtml("#main-content", newHtml);
      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  function buildAndShowDashboardHTML() {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      dashboardHtmlUrl,
      function (homeHtml) {
        // var chosenCategoryShortName = chooseRandomCategory(categories).short_name
        var newHtml = insertProperty(
          homeHtml,
          "title",
          "Chat GPT Conversation"
        );
        insertHtml("#main-content", newHtml);

        const freqTable = {};
        fetch("input/tokens.csv")
          .then((response) => response.text())
          .then((data) => {
            const parseData = Papa.parse(data, { header: true }).data;
            parseData.forEach(function (row) {
              freqTable[row.Token] = parseInt(row.Frequency);
            });
            // console.log(freqTable);
            wordCloud(freqTable);
            createChart(parseData);
          })
          .catch((error) => {
            console.error(error);
          });


      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  function buildAndShowAboutHTML() {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      aboutHtmlUrl,
      function (homeHtml) {
        // var chosenCategoryShortName = chooseRandomCategory(categories).short_name
        var newHtml = insertProperty(
          homeHtml,
          "title",
          "Chat GPT Conversation"
        );
        insertHtml("#main-content", newHtml);
      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  const myText = {};

  myText.words = "";


  function createChart(data) {
    var margin = { top: 20, right: 30, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create x scale
    var x = d3.scaleBand().range([0, width]).padding(0.1);
    x.domain(
      data.map(function (d) {
        return d.Token;
      })
    );

    // create y scale
    var y = d3.scaleLinear().range([height, 0]);
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.Frequency;
      }),
    ]);

    // create bars
    svg
      .selectAll(".bar")
      .data(data)
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
      .attr("height", function (d) {
        return height - y(d.Frequency);
      });

    // add x-axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add y-axis
    svg.append("g").call(d3.axisLeft(y));
  }

  function wordCloud(freqTable) {
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

  global.$dc = dc;
  
})(window);
// });

//   function createChart(data) {
//     var margin = {top: 20, right: 30, bottom: 30, left: 40},
//         width = 960 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;

//     var svg = d3.select("#chart").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // create x scale
//     var x = d3.scaleBand()
//         .range([0, width])
//         .padding(0.1);
//     x.domain(data.map(function(d) { return d.Token; }));

//     // create y scale
//     var y = d3.scaleLinear()
//         .range([height, 0]);
//     y.domain([0, d3.max(data, function(d) { return d.Frequency; })]);

//     // create bars
//     svg.selectAll(".bar")
//         .data(data)
//       .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d.Token); })
//         .attr("width", x.bandwidth())
//         .attr("y", function(d) { return y(d.Frequency); })
//         .attr("height", function(d) { return height - y(d.Frequency); });

//     // add x-axis
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x));

//     // add y-axis
//     svg.append("g")
//         .call(d3.axisLeft(y));
//   }

//   d3.select("#update").on("click", function () {
//     var newData = [
//       { Token: "apple", Frequency: 5 },
//       { Token: "banana", Frequency: 15 },
//       { Token: "cherry", Frequency: 25 },
//       { Token: "date", Frequency: 20 },
//     ];
//     createChart(newData);
//   });
