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

  function ChatData() {
    this.txt = null;
    this.txtSpecs = null;
    this.tokensF = [];
    this.tokensU = [];
    this.tokensH = [];
    this.tokensSF = [];
    this.tokensSU = [];
    this.tokensSH = [];
    this.sentSent = [];
  }

  const inputA = new ChatData();
  const inputB = new ChatData();
  let fileSelect;

  let selSet;

  gatherData(1, inputA);
  gatherData(2, inputB);

  function gatherData(fileIndex, fileSet) {
    fetch("input/chatgpt" + fileIndex + ".txt")
      .then((response) => response.text())
      .then((data) => {
        fileSet.txt = Papa.parse(data, { header: false }).data;
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("input/txtSpecs" + fileIndex + ".txt")
      .then((response) => response.json())
      .then((data) => {
        fileSet.txtSpecs = data;
      });

    fetch("input/tokensFinal" + fileIndex + ".csv")
      .then((response) => response.text())
      .then((data) => {
        parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
        parsedData.forEach(function (row) {
          fileSet.tokensF.push({
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
          fileSet.tokensF.sort(function (a, b) {
            return a.index - b.index;
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("input/tokensUnique" + fileIndex + ".csv")
      .then((response) => response.text())
      .then((data) => {
        parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
        parsedData.forEach(function (row) {
          fileSet.tokensU.push({
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
        fileSet.tokensU.sort(function (a, b) {
          return a.index - b.index;
        });
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("input/tokensHapaxes" + fileIndex + ".csv")
      .then((response) => response.text())
      .then((data) => {
        parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
        parsedData.forEach(function (row) {
          fileSet.tokensH.push({
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
        fileSet.tokensH.sort(function (a, b) {
          return a.index - b.index;
        });
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("input/tokensStemmedFinal" + fileIndex + ".csv")
      .then((response) => response.text())
      .then((data) => {
        parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
        parsedData.forEach(function (row) {
          fileSet.tokensSF.push({
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
        fileSet.tokensSF.sort(function (a, b) {
          return a.index - b.index;
        });
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("input/tokensStemmedUnique" + fileIndex + ".csv")
      .then((response) => response.text())
      .then((data) => {
        parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
        parsedData.forEach(function (row) {
          fileSet.tokensSU.push({
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
        fileSet.tokensSU.sort(function (a, b) {
          return a.index - b.index;
        });
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("input/tokensStemmedHapaxes" + fileIndex + ".csv")
      .then((response) => response.text())
      .then((data) => {
        parsedData = Papa.parse(data, { header: true }).data.slice(0, -1);
        parsedData.forEach(function (row) {
          fileSet.tokensSH.push({
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
        fileSet.tokensSH.sort(function (a, b) {
          return a.index - b.index;
        });
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("input/sentencesSentiment" + fileIndex + ".csv")
      .then((response) => response.text())
      .then((data) => {
        fileSet.sentSent = Papa.parse(data, { header: true }).data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

  dc.loadDashboard = function () {
    showLoading("#main-content");
    buildAndShowDashboardHTML();
  };

  dc.loadText = function () {
    buildAndShowTextHTML();
  };

  dc.loadData = function () {
    buildAndShowDataHTML();
  };

  dc.loadAbout = function () {
    buildAndShowAboutHTML();
  };

  function buildAndShowTextHTML() {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      textHtmlUrl,
      function (textHtml) {
        console.log(fileSelect);

        var textHtml = insertProperty(
          textHtml,
          "title",
          fileSelect.txtSpecs.title
        );
        insertHtml("#main-content", textHtml);

        // Display chatData.txt as separate paragraphs
        var chatTextHtml = "";
        for (var i = 0; i < fileSelect.txt.length; i++) {
          chatTextHtml += "<p>" + fileSelect.txt[i] + "</p>";
        }
        insertHtml("#chat-text", chatTextHtml);
      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  // function buildAndShowTextHTML() {
  //   // Load home snippet page
  //   $ajaxUtils.sendGetRequest(
  //     textHtmlUrl,
  //     function (textHtml) {
  //       var textHtml = insertProperty(
  //         textHtml,
  //         "title",
  //         "Chat GPT Conversation"
  //       );

  //       console.log(fileSelect)

  //       insertHtml("my-element", fileSelect.txt);

  //       insertHtml("#main-content", textHtml);
  //     },
  //     false
  //   ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  // }

  function buildAndShowDataHTML() {
    $ajaxUtils.sendGetRequest(
      dataHtmlUrl,
      function (dataHtml) {
        insertHtml("#main-content", dataHtml);

        document.querySelector(".total-tokens").innerHTML =
          fileSelect.txtSpecs.totalTokens;
        document.querySelector(".total-tokens-clean").innerHTML =
          fileSelect.txtSpecs.totalTokensClean;
        document.querySelector(".total-tokens-unique").innerHTML =
          fileSelect.txtSpecs.totalTokensUnique;
        document.querySelector(".total-tokens-hapaxes").innerHTML =
          fileSelect.txtSpecs.totalTokensHapaxes;
        document.querySelector(".total-filtered-stemmed").innerHTML =
          fileSelect.txtSpecs.totalFilteredStemmed;
        document.querySelector(".total-filtered-stemmed-hapaxes").innerHTML =
          fileSelect.txtSpecs.totalFilteredStemmedHapaxes;
        document.querySelector(".total-filtered-stemmed-unique").innerHTML =
          fileSelect.txtSpecs.totalFilteredStemmedUnique;

        var table = $("#myTable").DataTable();

        for (var i = 0; i < fileSelect.tokensF.length; i++) {
          table.row
            .add([
              fileSelect.tokensF[i].index,
              fileSelect.tokensF[i].token,
              fileSelect.tokensF[i].count,
              fileSelect.tokensF[i].tag,
              fileSelect.tokensF[i].frequency,
              fileSelect.tokensF[i].compound,
            ])
            .draw();
        }
      },
      false
    );
  }

  function buildAndShowAboutHTML() {
    $ajaxUtils.sendGetRequest(
      aboutHtmlUrl,
      function (aboutHtml) {
        insertHtml("#main-content", aboutHtml);
      },
      false
    );
  }

  function buildAndShowDashboardHTML() {
    $ajaxUtils.sendGetRequest(
      dashboardHtmlUrl,
      function (homeHtml) {
        $ajaxUtils.sendGetRequest(
          paramHtmlUrl,
          function (paramsHtml) {
            insertHtml("#main-content", paramsHtml + homeHtml);

            document
              .getElementById("tokenset-select")
              .addEventListener("change", renderChange);
            document
              .getElementById("sorting-select")
              .addEventListener("change", renderChange);
            document
              .getElementById("filtering-select")
              .addEventListener("change", renderChange);
            document
              .getElementById("input-select")
              .addEventListener("change", renderChange);

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

    stHtml = document.getElementById("input-select");
    let selInp = stHtml.options[stHtml.selectedIndex].value;

    fileSelect = selInp === "txtA" ? inputA : inputB;

    if (selFing === "hapaxes") {
      if (selTset === "tokensStemmedCount") {
        selSet = fileSelect.tokensSH;
      } else if (selTset === "tokensCount") {
        selSet = fileSelect.tokensH;
      }
    } else {
      if (selTset === "tokensStemmedCount") {
        selSet = fileSelect.tokensSU;
      } else if (selTset === "tokensCount") {
        selSet = fileSelect.tokensU;
      }
    }

    if (selSing == "index") {
      selSet.sort(function (a, b) {
        return a.index - b.index;
      });
    } else if (selSing == "token") {
      selSet.sort((a, b) => a.token.localeCompare(b.token));
    } else if (selSing == "frequency") {
      selSet.sort(function (a, b) {
        return b.frequency - a.frequency;
      });
    } else if (selSing == "count") {
      selSet.sort(function (a, b) {
        return b.count - a.count;
      });
    }
    if (selFing === "top") {
      selSet = selSet.slice(0, 50);
    }

    wordCloud(selSet);
    scatterPlot(selSet);
    countChart(selSet);
    pieChart(selSet);
    heatmap(selSet);
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

  function scatterPlot(data) {
    $("#scatter-plot").html("");

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

    dots
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8);
        svg
          .append("text")
          .attr("class", "label")
          .attr("x", x(d.count) - 15)
          .attr("y", y(d.compound) - 15)
          .text(d.token);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("r", 5);
        svg.select(".label").remove();
      });
  }

  function countChart(data) {
    var xField = "token";
    var yField = "count";

    var chart = document.getElementById("count-chart");

    // Check if chart has already been created
    if (chart.data) {
      // Update chart data
      chart.data[0].x = data.map(function (d) {
        return d[xField];
      });
      chart.data[0].y = data.map(function (d) {
        return d[yField];
      });
      Plotly.redraw(chart);
    } else {
      // Create new chart
      var layout = {
        xaxis: {
          rangeslider: {},
        },
        yaxis: {
          fixedrange: true,
        },
        margin: {
          l: 25, // left margin
          r: 15, // right margin
          b: 0, // bottom margin
          t: 10, // top margin
          pad: 0, // padding between the plot and the margins
        },
        width: chart.clientWidth,
        height: 400, // height of the plot in pixels
      };

      Plotly.newPlot(chart, prepData(data), layout, { showSendToCloud: true });
    }

    function prepData(data) {
      var x = data.map(function (d) {
        return d[xField];
      });
      var y = data.map(function (d) {
        return d[yField];
      });
      return [{ mode: "lines", x: x, y: y }];
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
      .style("fill", (d) => colorScale(d.count))
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7); // Change the opacity of the rectangle on hover
        svg
          .append("text")
          .attr("class", "label")
          .attr("x", -200) // Place the label at the center of the corresponding x-coordinate of the rectangle
          .attr("y", -30) // Place the label at the center of the corresponding y-coordinate of the rectangle
          .attr("dy", ".7em")
          .attr("transform", "rotate(-90)") // Rotate the label
          .text(d.token);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).style("opacity", 1);
        svg.select(".label").remove();
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "0.75em")
      .attr("dx", "-0.5em")
      .style("text-anchor", "end")
      .style("opacity", 100); // add this line to hide the x-axis labels on the y-axis

    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("opacity", 0); // add this line to hide the y-axis labels
  }

  global.$dc = dc;
})(window);
