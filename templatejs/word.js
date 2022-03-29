/**
 * Fonction qui affiche le contenu html, sur la page psycho.html,
 * des target d'un mot donnée en paramètre
 *
 * @param context
 */
function getWord(context) {
    newcontext = {
        word: context.params.word,
        output: context.params.output
    }

    $.get("php/word.php", newcontext, function (data) {
        let htmlWord = "";
        if (data === "") {
            console.log('false');
        } else {
            if (data["output"] === "table") {
                htmlWordTable(data, context);
            } else {
                htmlWordD3(data["data"], newcontext);
            }
        }
    });
}

/**
 * Fonction qui retourne une string html pour l'affichage avec un table
 *
 * @param data
 * @returns {string|*}
 */
function htmlWordTable(data, context) {
    htmlWord = "<h1 class='mt-5 text-center'>Visualisation de base</h1>";
    htmlWord += "<div class='text-center'><a class='mt-5 text-green' href='" + context.path+ "?output=d3'>" +
        "Visualisation avec d3</a> <br>" +
        "<a class=\"btn btn-primary mt-3\" href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/\"" +
        " role=\"button\">Retour au menu</a></div>";
    htmlWord += "<table class=\"table container mt-5\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th scope=\"col\">Cue</th>\n" +
        "      <th scope=\"col\">Target</th>\n" +
        "      <th scope=\"col\">MSG</th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>"
    data["data"].forEach(function(item) {
        htmlWord += "<tr>\n" +
            "      <th scope=\"row\">" + item.cue + "</th>\n" +
            "      <th scope=\"row\">" + item.target + "</th>\n" +
            "      <th scope=\"row\">" + item.msg + "</th>\n" +
            "    </tr>"
    });
    htmlWord += " </tbody>\n" +
        "</table>";

    $("#main").html(htmlWord);
}


/**
 * Fonction qui affiche les mots reliés à un mot donné avec D3
 *
 * @param data
 * @param context
 */
function htmlWordD3(data, context) {
    html = "<h1 class='mt-5 text-center'>Visualisation avec D3</h1>";
    html += "<div class='text-center'><a class='mt-5 text-green'" +
        " href='http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/info/" + context.word + "'>" +
        "Visualisation de base</a></div>";
    html += "<a class=\"btn btn-primary\" href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/\"" +
        " role=\"button\">Retour au menu</a>";
    $("#main").html(html);
    var margin = {top: 100, right: 0, bottom: 0, left: 0},
        width = 460 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom,
        innerRadius = 90,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object
    var svg = d3.select("#main")
        .attr("class", "text-center")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    // Scales
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(data.map(function(d) { return d.target; })); // The domain of the X axis is the list of states.
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 14000]); // Domain of Y is from 0 to the max seen in the data

    // Add the bars
    svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("fill", "#69b3a2")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(parseFloat(d.msg)*20000); })
            .startAngle(function(d) { return x(d.target); })
            .endAngle(function(d) { return x(d.target) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))

    // Add the labels
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor", function(d) { return (x(d.target) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.target) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(parseFloat(d.msg)*20000)+10) + ",0)"; })
        .append("text")
        .text(function(d){return(d.target)})
        .attr("transform", function(d) { return (x(d.target) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")
}