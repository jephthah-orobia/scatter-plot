const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const drawScatterPlot = (ev) => {
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            const w = window.innerWidth * 0.85,
                h = window.innerHeight * 0.70,
                padding = { top: 10, bottom: 50, left: 100, right: 100 },
                minYear = d3.min(data.map(d => new Date(d.Year, 0, 0))),
                maxYear = d3.max(data.map(d => new Date(d.Year, 0, 0)));

            minYear.setFullYear(minYear.getFullYear() - 1);
            maxYear.setFullYear(maxYear.getFullYear() + 1);

            const xScale = d3.scaleTime()
                .range([padding.left, w - padding.right])
                .domain([minYear, maxYear]);

            const xAxis = d3.axisBottom(xScale);

            const yScale = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.Seconds * 1000)))
                .range([padding.top, h - padding.bottom]);

            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d => d.getMinutes() + ":" + d.getSeconds().toString().padStart(2, '0'));
            /* .ticks(10 * 5)
            .tickFormat(d => d % 2000 === 0 ? d : null); */

            d3.select("div.container")
                .append("h1")
                .attr("id", "title")
                .text('Doping in Professional Bicycle Racing');

            let svg = d3.select("div.container")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("a")
                .attr("href", d => (d.URL === "") ? "note: No Doping Article found." : d.URL)
                .attr("target", "_blank")
                .attr("onclick", d => (d.URL === "") ? "return false" : "return")
                .append("circle")
                .attr("class", d => d.Doping === "" ? "dot" : "dot doping")
                .attr("data-xvalue", d => new Date(d.Year, 0, 0))
                .attr("data-yvalue", d => new Date(d.Seconds * 1000))
                .attr("data-index", (d, i) => i)
                .attr("cx", d => xScale(new Date(d.Year, 0, 0)))
                .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
                .on('mouseover', function (e) {
                    let i = d3.select(this).attr("data-index");
                    d3.select("#tt-name").text(data[i].Name);
                    d3.select("#tt-nat").text(data[i].Nationality);
                    d3.select("#tt-place").text(data[i].Place);
                    d3.select("#tt-time").text(data[i].Time);
                    d3.select("#tt-year").text(data[i].Year);
                    d3.select("#tt-doping").text(data[i].Doping);

                    d3.select("div#tooltip")
                        .style("visibility", "visible")
                        .attr("data-year", d3.select(this).attr("data-xvalue"))
                        .style("left", (e.clientX - (w / 0.85 * 0.075)) + "px")
                        .style("top", (e.clientY) + "px");
                })
                .on('mouseout', function (e) {
                    d3.select("div#tooltip").style("visibility", "hidden");
                });


            svg.append("g")
                .attr('id', 'x-axis')
                .attr("transform", "translate(0 ," + (h - padding.bottom) + ")")
                .call(xAxis);

            svg.append("g")
                .attr('id', 'y-axis')
                .attr("transform", "translate(" + padding.left + ", 0)")
                .call(yAxis)
                .append("text")
                .text("Time in Minutes")
                .attr("class", "axisName")
                .attr("x", -padding.top)
                .attr("y", -padding.top * 5)
                .attr("transform", "rotate(-90)");

            document.querySelector("#please-wait").remove();
        });
};

document.onreadystatechange = (ev) => {
    if (document.readyState === "complete")
        drawScatterPlot(ev);
}