$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
});

(function (global) {
  var dc = {};

  var dashboardHtmlUrl = "snippets/dashboard.html";
  var paramHtmlUrl = "snippets/param-snippet.html";
  var textHtmlUrl = "snippets/text-snippet.html";
  var aboutHtmlUrl = "snippets/about-snippet.html";
  var dataHtmlUrl = "snippets/data-snippet.html";

  let txt;
  let txtSpecs;
  let tokensFinal = [];
  let tokensUnique = [];
  let tokensHapaxes = [];
  let tokensStemmedFinal = [];
  let tokensStemmedUnique = [];
  let tokensStemmedHapaxes = [];
  let sentencesSentiment = [];

  let selectedTokens;

  let chgTx = {
    tokenset: false,
    sorting: false,
    filtering: false,
    breakpoint: false,
  };

  (function () {
    function gatherData() {
      fetch("input/chatgpt.txt")
        .then((response) => response.text())
        .then((data) => {
          txt = Papa.parse(data, { header: false }).data;
        })
        .catch((error) => {
          console.error(error);
        });

      fetch("input/txtSpecs.txt")
        .then((response) => response.json())
        .then((data) => {
          txtSpecs = data;
        });

      fetch("input/tokensFinal.csv")
        .then((response) => response.text())
        .then((data) => {
          parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
          parsedData.forEach(function (row) {
            tokensFinal.push({
              index: parseInt(row.index),
              token: row.token,
              count: parseInt(row.count),
              tag: row.tag,
              frequency: parseFloat(row.frequency),
              neg: parseFloat(row.neg),
              neu: parseFloat(row.neu),
              pos: parseFloat(row.pos),
              compound: parseFloat(row.compound),
            });
            tokensFinal.sort(function (a, b) {
              return a.index - b.index;
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });

      fetch("input/tokensUnique.csv")
        .then((response) => response.text())
        .then((data) => {
          parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
          parsedData.forEach(function (row) {
            tokensUnique.push({
              index: parseInt(row.index),
              token: row.token,
              count: parseInt(row.count),
              tag: row.tag,
              frequency: parseFloat(row.frequency),
              neg: parseFloat(row.neg),
              neu: parseFloat(row.neu),
              pos: parseFloat(row.pos),
              compound: parseFloat(row.compound),
            });
          });
          tokensUnique.sort(function (a, b) {
            return a.index - b.index;
          });
        })
        .catch((error) => {
          console.error(error);
        });

      fetch("input/tokensHapaxes.csv")
        .then((response) => response.text())
        .then((data) => {
          parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
          parsedData.forEach(function (row) {
            tokensHapaxes.push({
              index: parseInt(row.index),
              token: row.token,
              count: parseInt(row.count),
              tag: row.tag,
              frequency: parseFloat(row.frequency),
              neg: parseFloat(row.neg),
              neu: parseFloat(row.neu),
              pos: parseFloat(row.pos),
              compound: parseFloat(row.compound),
            });
          });
          tokensHapaxes.sort(function (a, b) {
            return a.index - b.index;
          });
        })
        .catch((error) => {
          console.error(error);
        });

      fetch("input/tokensStemmedFinal.csv")
        .then((response) => response.text())
        .then((data) => {
          parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
          parsedData.forEach(function (row) {
            tokensStemmedFinal.push({
              index: parseInt(row.index),
              token: row.token,
              count: parseInt(row.count),
              tag: row.tag,
              frequency: parseFloat(row.frequency),
              neg: parseFloat(row.neg),
              neu: parseFloat(row.neu),
              pos: parseFloat(row.pos),
              compound: parseFloat(row.compound),
            });
          });
          tokensStemmedFinal.sort(function (a, b) {
            return a.index - b.index;
          });
        })
        .catch((error) => {
          console.error(error);
        });

      fetch("input/tokensStemmedUnique.csv")
        .then((response) => response.text())
        .then((data) => {
          parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
          parsedData.forEach(function (row) {
            tokensStemmedUnique.push({
              index: parseInt(row.index),
              token: row.token,
              count: parseInt(row.count),
              tag: row.tag,
              frequency: parseFloat(row.frequency),
              neg: parseFloat(row.neg),
              neu: parseFloat(row.neu),
              pos: parseFloat(row.pos),
              compound: parseFloat(row.compound),
            });
          });
          tokensStemmedUnique.sort(function (a, b) {
            return a.index - b.index;
          });
        })
        .catch((error) => {
          console.error(error);
        });

      fetch("input/tokensStemmedHapaxes.csv")
        .then((response) => response.text())
        .then((data) => {
          parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
          parsedData.forEach(function (row) {
            tokensStemmedHapaxes.push({
              index: parseInt(row.index),
              token: row.token,
              count: parseInt(row.count),
              tag: row.tag,
              frequency: parseFloat(row.frequency),
              neg: parseFloat(row.neg),
              neu: parseFloat(row.neu),
              pos: parseFloat(row.pos),
              compound: parseFloat(row.compound),
            });
          });
          tokensStemmedHapaxes.sort(function (a, b) {
            return a.index - b.index;
          });
        })
        .catch((error) => {
          console.error(error);
        });

      fetch("input/sentencesSentiment.csv")
        .then((response) => response.text())
        .then((data) => {
          sentencesSentiment = Papa.parse(data, { header: true }).data;
          console.log(sentencesSentiment);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    gatherData();
  })();

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    buildAndShowDashboardHTML();
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
  dc.loadData = function () {
    buildAndShowDataHTML();
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

  function buildAndShowDataHTML() {
    $ajaxUtils.sendGetRequest(
      dataHtmlUrl,
      function (dataHtml) {
        insertHtml("#main-content", dataHtml);

        // txtSpecs
        console.log(txtSpecs);
        document.querySelector(".total-tokens").innerHTML =
          txtSpecs.totalTokens;
        document.querySelector(".total-tokens-clean").innerHTML =
          txtSpecs.totalTokensClean;
        document.querySelector(".total-tokens-unique").innerHTML =
          txtSpecs.totalTokensUnique;
        document.querySelector(".total-tokens-hapaxes").innerHTML =
          txtSpecs.totalTokensHapaxes;
        document.querySelector(".total-filtered-stemmed").innerHTML =
          txtSpecs.totalFilteredStemmed;
        document.querySelector(".total-filtered-stemmed-hapaxes").innerHTML =
          txtSpecs.totalFilteredStemmedHapaxes;
        document.querySelector(".total-filtered-stemmed-unique").innerHTML =
          txtSpecs.totalFilteredStemmedUnique;

        var table = $("#myTable").DataTable();

        for (var i = 0; i < tokensFinal.length; i++) {
          table.row
            .add([
              tokensFinal[i].index,
              tokensFinal[i].token,
              tokensFinal[i].count,
              tokensFinal[i].tag,
              tokensFinal[i].frequency,
              tokensFinal[i].compound,
            ])
            .draw();
        }
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

  function buildAndShowDashboardHTML() {
    $ajaxUtils.sendGetRequest(
      dashboardHtmlUrl,
      function (homeHtml) {
        $ajaxUtils.sendGetRequest(
          paramHtmlUrl,
          function (paramsHtml) {
            insertHtml("#main-content", paramsHtml + homeHtml);

            // document
            //   .getElementById("params-button")
            //   .addEventListener("click", renderChange);

            document
              .getElementById("tokenset-select")
              .addEventListener("change", renderChange);
            document
              .getElementById("sorting-select")
              .addEventListener("change", renderChange);
            document
              .getElementById("filtering-select")
              .addEventListener("change", renderChange);
            // document
            //   .getElementById("breakpoint-select")
            //   .addEventListener("change", renderChange);

            renderChange();
          },
          false
        );
      },
      false
    );
  }

  function renderChange() {
    let stHtml = document.getElementById("tokenset-select");
    let selTset = stHtml.options[stHtml.selectedIndex].value;

    stHtml = document.getElementById("sorting-select");
    let selSing = stHtml.options[stHtml.selectedIndex].value;

    stHtml = document.getElementById("filtering-select");
    let selFing = stHtml.options[stHtml.selectedIndex].value;

    if (selFing === "hapaxes") {
      if (selTset === "tokensStemmedCount") {
        selectedTokens = tokensStemmedHapaxes;
      } else if (selTset === "tokensCount") {
        selectedTokens = tokensHapaxes;
      }

      if (selSing == "chronological") {
        selectedTokens.sort(function (a, b) {
          return a.index - b.index;
        });
      } else if (selSing == "alphabetical") {
        selectedTokens.sort((a, b) => a.token.localeCompare(b.token));
      } else if (selSing == "frequency") {
        selectedTokens.sort(function (a, b) {
          return b.frequency - a.frequency;
        });
      } else if (selSing == "count") {
        selectedTokens.sort(function (a, b) {
          return b.count - a.count;
        });
      }
    } else {
      // Set the global wordCloudInputData variable based on the selected option
      if (selTset === "tokensStemmedCount") {
        selectedTokens = tokensStemmedUnique;
      } else if (selTset === "tokensCount") {
        selectedTokens = tokensUnique;
      }

      if (selSing == "chronological") {
        selectedTokens.sort(function (a, b) {
          return a.index - b.index;
        });
      } else if (selSing == "alphabetical") {
        selectedTokens.sort((a, b) => a.token.localeCompare(b.token));
      } else if (selSing == "frequency") {
        selectedTokens.sort(function (a, b) {
          return b.frequency - a.frequency;
        });
      } else if (selSing == "count") {
        selectedTokens.sort(function (a, b) {
          return b.count - a.count;
        });
      }
    }
    // Set the global wordCloudInputData variable based on the selected option
    if (selFing === "top") {
      selectedTokens = selectedTokens.slice(0, 50);
    }

    // stHtml = document.getElementById("filtering-select");
    // let selectedBreakpoint = stHtml.options[stHtml.selectedIndex].value;
    // console.log(selectedBreakpoint)
    // Set the global wordCloudInputData variable based on the selected option
    // if (selectedBreakpoint === "tokensStemmedCount") {
    //   selTset = tokensStemmedCount;
    // } else if (selectedBreakpoint === "tokensCount") {
    //   selTset = tokensCount;
    // }

    $("#count-chart").html("");

    wordCloud(selectedTokens);
    barChart(selectedTokens);
    scatterPlot(selectedTokens);
    countChart(selectedTokens);
    pieChart(selectedTokens);
    heatmap(selectedTokens);
  }

  function barChart(data) {
    $("#bar-chart").html("");

    // data=data.slice(0,20)
    // console.log(data)

    var margin = { top: 20, right: 30, bottom: 70, left: 20 },
      height = 300 - margin.top - margin.bottom;
    const width = document.getElementById("bar-chart").clientWidth;

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
      data.map(function (d) {
        return d.token;
      })
    );

    // create y scale
    var y = d3.scaleLinear().range([height, 0]);
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.frequency;
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
        return x(d.token);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.frequency);
      })
      .attr("fill", "#576CBC") // set the bars to blue
      .attr("height", function (d) {
        return height - y(d.frequency);
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

  function wordCloud(data) {
    $("#word-cloud").html("");
    // Define the dimensions of the word cloud
    const height = 400;
    const width = document.getElementById("word-cloud").clientWidth;

    // Define the word cloud layout
    const layout = d3.layout
      .cloud()
      .size([width, height])
      .words(data.map((d) => ({ text: d.token, value: d.count })))
      // .words(Object.entries(data).map(([text, value]) => ({ text, value })))
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

  function scatterPlot(inputData) {
    $("#scatter-plot").html("");
    const data = inputData.filter((item) => item.compound !== 0.0);

    // Create a scatterplot of sentiment vs frequency
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width =
      document.getElementById("scatter-plot").clientWidth -
      margin.left -
      margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#scatter-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([0, width]);
    const y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // Add circles and text labels
    const dots = svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.count))
      .attr("cy", (d) => y(d.compound))
      .attr("r", 5)
      .style("fill", "#19376D");

    const labels = svg
      .selectAll("label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.count) + 10)
      .attr("y", (d) => y(d.compound) + 5)
      .text("");

    dots
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8);
        // console.log(d.token)
        // TODO
        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.count) + 15)
          .attr("y", y(d.compound))
          .text(d.token);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("r", 5);
        svg.select(".tooltip").remove();
      });
  }

  function countChart(data) {
    // console.log(data);
    var xField = "token";
    var yField = "count";

    var selectorOptions = {
      buttons: [
        {
          step: "alphabetical",
          stepmode: "backward",
          count: 1,
          label: "A - C",
        },
        {
          step: "alphabetical",
          stepmode: "backward",
          count: 1,
          label: "D - F",
        },
        {
          step: "alphabetical",
          stepmode: "backward",
          count: 1,
          label: "G - I",
        },
        {
          step: "alphabetical",
          stepmode: "backward",
          count: 1,
          label: "J - L",
        },
        {
          step: "all",
        },
      ],
    };

    var data = prepData();
    var layout = {
      xaxis: {
        rangeselector: selectorOptions,
        rangeslider: {},
      },
      yaxis: {
        fixedrange: true,
      },
      margin: {
        l: 15, // left margin
        r: 15, // right margin
        b: 0, // bottom margin
        t: 0, // top margin
        pad: 0, // padding between the plot and the margins
      },
      width: document.getElementById("count-chart").clientWidth,
      height: 400, // height of the plot in pixels
    };

    Plotly.plot("count-chart", data, layout, { showSendToCloud: true });

    function prepData() {
      var x = [];
      var y = [];

      // // SORT TOKENS
      // tokensUnique.sort(function(a, b) {
      //   return a.token.localeCompare(b.token);
      // });

      data.forEach(function (datum, i) {
        // , i
        // console.log(datum) // WHAT THE HECK TODO FLIP
        x.push(datum[xField]);
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
  }

  function pieChart(data) {
    var tagCounts = {
      Noun: 0,
      Verb: 0,
      Adjective: 0,
      Adverb: 0,
      Pronoun: 0,
      Determiner: 0,
      Other: 0,
    };

    for (var i = 0; i < data.length; i++) {
      var tag = data[i].tag;
      if (tag.startsWith("NN")) {
        tagCounts["Noun"] += data[i].count;
      } else if (tag.startsWith("VB")) {
        tagCounts["Verb"] += data[i].count;
      } else if (tag.startsWith("JJ")) {
        tagCounts["Adjective"] += data[i].count;
      } else if (tag.startsWith("RB")) {
        tagCounts["Adverb"] += data[i].count;
      } else if (tag.startsWith("PRP") || tag == "WP" || tag == "WDT") {
        tagCounts["Pronoun"] += data[i].count;
      } else if (tag == "DT" || tag == "PDT") {
        tagCounts["Determiner"] += data[i].count;
      } else {
        tagCounts["Other"] += data[i].count;
      }
    }

    var tagCountData = {
      labels: Object.keys(tagCounts),
      datasets: [
        {
          data: Object.values(tagCounts),
          backgroundColor: [
            "#576cbc",
            "#bc579f",
            "#bca757",
            "#b2524d",
            "#4dadb2",
            "#844db2",
            "#57bc75",
          ],
          hoverBackgroundColor: [
            "#576cbc",
            "#bc579f",
            "#bca757",
            "#57bc75",
            "#4dadb2",
            "#844db2",
            "#b2524d",
          ],
        },
      ],
    };

    var ctx = document.getElementById("tag-chart").getContext("2d");

    // Check if there is an existing Chart object and destroy it
    var existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
    var tagCountChart = new Chart(ctx, {
      type: "pie",
      data: tagCountData,
      options: {
        legend: {
          position: "bottom",
        },
      },
    });
  }

  const tagCategoryMapping = {
    NN: "Noun",
    NNS: "Noun",
    NNP: "Noun",
    NNPS: "Noun",
    VB: "Verb",
    VBD: "Verb",
    VBG: "Verb",
    VBN: "Verb",
    VBP: "Verb",
    VBZ: "Verb",
    JJ: "Adjective",
    JJR: "Adjective",
    JJS: "Adjective",
    RB: "Adverb",
    RBR: "Adverb",
    RBS: "Adverb",
    PRP: "Pronoun",
    WP: "Pronoun",
    WDT: "Pronoun",
    DT: "Determiner",
    PDT: "Determiner",
    CC: "Other",
    IN: "Other",
    MD: "Other",
    WRB: "Other",
    CD: "Other",
    FW: "Other",
    RP: "Other",
    EX: "Other",
    TO: "Other",
    PRP$: "Other",
    // any other tags not covered by the function
    // will be mapped to "Other"
    default: "Other",
  };

  function heatmap(inputData) {
    $("#heatmap").html("");

    data = inputData.map((d) => ({
      tagCategory: tagCategoryMapping[d.tag],
      index: d.index,
      tag: d.tag,
      token: d.token,
      count: d.count,
    }));

    const margin = { top: 5, right: 5, bottom: 55, left: 50 };
    const width =
      document.getElementById("heatmap").clientWidth -
      margin.left -
      margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xLabels = data.map((d) => d.tagCategory);
    const yLabels = data.map((d) => d.token);
    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, (d) => d.count)]);

    const svg = d3
      .select("#heatmap")
      .append("svg")
      .style("background-color", "white") // Add this line to set the background color
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(xLabels)
      .range([0, width])
      .paddingInner(0.05)
      .align(0.1);

    const yScale = d3
      .scaleBand()
      .domain(yLabels)
      .range([height, 0])
      .paddingInner(0.05)
      .align(0.1);

    svg
      .selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.tagCategory))
      .attr("y", (d) => yScale(d.token))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.count));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "0.75em")
      .attr("dx", "-0.5em")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(yScale));
  }

  function testDiv() {}

  global.$dc = dc;
})(window);

// graph with categories
// output most used word
