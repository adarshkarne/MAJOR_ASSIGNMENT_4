function GenerateContour(bins) {
    d3.csv("https://raw.githubusercontent.com/umassdgithub/Fall-2023-DataViz/main/Major-Assignment-4/data/Data_CT.csv").then(function (data) {

        const contour_values = data.map(d => +d[Object.keys(d)[0]]);

        const width = 600;
        const height = 600;
        const m = 512; // number of columns
        const n = 500; // number of rows

        const min = d3.min(contour_values); // minimum value
        const max = d3.max(contour_values); // maximum value

        let colors = d3.scaleLinear()
            .domain(d3.range(min, max,
                parseInt(Math.abs(max - min) / 6.7)))
            .range(["#f0f0f0", "#5c86c1", "#428bb9", "#b1e1bb", "#fccd8d", "#e04c42"])
            .interpolate(d3.interpolateHcl);

        // Create SVG container for the visualization
        const svg = d3.select("#contour")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const margin = 20;
        const sliderWidth = width - margin * 2;
        const sliderHeight = 60;

        var x = d3.scaleLinear()
            .domain([min, max])
            .range([0, sliderWidth]);

        var brush = d3.brushX()
            .extent([[0, 0], [sliderWidth, sliderHeight]])
            .on("brush", brushed);

        // Example: Change slider ticks to rectangles
        var slider = d3.select("body").append("svg")
            .attr("width", sliderWidth + margin * 2)
            .attr("height", sliderHeight + margin)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")")
            .call(d3.axisBottom().scale(x).ticks(5).tickFormat(() => "").tickSize(0))
            .selectAll(".tick")
            .append("rect")
            .attr("width", 10)
            .attr("height", 5)
            .attr("fill", "steelblue");


        var brushg = slider.append("g")
            .attr("class", "brush")
            .call(brush);

        brush.move(brushg, [20, 50].map(x));

        function brushed() {
            var range = d3.brushSelection(this).map(x.invert);
            update(range[0], range[1]);
        }

        // Create the first contour map on page load
        const initial_contours = d3.contours()
            .size([m, n])
            .thresholds(d3.range(min, max, bins))
            (contour_values);

        // Apply color to contours
        svg.selectAll("path")
            .data(initial_contours)
            .enter().append("path")
            .attr("d", d3.geoPath())
            .attr("fill", d => colors(d.value));

        // // Add a slider
        // const slider = d3.select("body").append("input")
        //     .attr("type", "range")
        //     .attr("min", 0)
        //     .attr("max", 1000)
        //     .attr("step", sliderstep)
        //     .on("input", update);

        // Function to update visualization based on slider value
        function update(min, max) {
            // const sliderValue = +slider.property("value");
            // Update contours based on the slider value
            const contours = d3.contours()
                .size([m, n])
                .thresholds(d3.range(min, max, bins))
                (contour_values);

            svg.selectAll("path").remove();

            // Update visualization using updatedContours
            svg.selectAll("path")
                .data(contours)
                .enter().append("path")
                .attr("d", d3.geoPath())
                .attr("fill", d => colors(d.value))
                .attr("transform", `translate(${width / 2}, ${height / 2})`);
        }

    });
}

GenerateContour(580);