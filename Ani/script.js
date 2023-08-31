google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    // Sample data
    var data = [
        { age: 52, thalach: 168, chol: 212, target: 0 },
        { age: 53, thalach: 155, chol: 203, target: 1 },
        { age: 70, thalach: 125, chol: 174, target: 0 },
        { age: 61, thalach: 161, chol: 203, target: 1 },
        { age: 62, thalach: 106, chol: 294, target: 0 }
        // Add more data...
    ];

    // Google Chart - Line Chart
    var googleDataLine = new google.visualization.DataTable();
    googleDataLine.addColumn('string', 'Age');
    googleDataLine.addColumn('number', 'Maximum Heart Rate');

    data.forEach(function (entry) {
        googleDataLine.addRow([entry.age.toString(), entry.thalach]);
    });

    var googleChartLine = new google.visualization.LineChart(document.getElementById('googleChartContainer'));
    googleChartLine.draw(googleDataLine, {
        title: 'Age vs. Maximum Heart Rate',
        hAxis: { title: 'Age' },
        vAxis: { title: 'Maximum Heart Rate' },
        colors: ['#4285F4'],
        legend: 'none',
        lineWidth: 2,
        pointSize: 6,
        backgroundColor: { fill: 'transparent' },
        chartArea: { width: '80%', height: '70%' },
    });

    // Google Chart - Pie Chart
    var targetData = google.visualization.arrayToDataTable([
        ['Target', 'Count'],
        ['Target 0', countTarget(data, 0)],
        ['Target 1', countTarget(data, 1)]
    ]);

    var googleChartPie = new google.visualization.PieChart(document.getElementById('googlePieChartContainer'));
    googleChartPie.draw(targetData, {
        title: 'Distribution of Targets',
        colors: ['#0F9D58', '#DB4437'],
        chartArea: { width: '80%', height: '70%' },
    });

    // Google Chart - Column Chart for 'chol' values
    var googleDataChol = new google.visualization.DataTable();
    googleDataChol.addColumn('string', 'Age');
    googleDataChol.addColumn('number', 'Cholesterol Level');

    data.forEach(function (entry) {
        googleDataChol.addRow([entry.age.toString(), entry.chol]);
    });

    var googleChartChol = new google.visualization.ColumnChart(document.getElementById('googleCholChartContainer'));
    googleChartChol.draw(googleDataChol, {
        title: 'Age vs. Cholesterol Level',
        hAxis: { title: 'Age' },
        vAxis: { title: 'Cholesterol Level' },
        colors: ['#EA4335'],
        legend: 'none',
        backgroundColor: { fill: 'transparent' },
        chartArea: { width: '80%', height: '70%' },
    });

    // D3.js Chart - Bar Chart
    var d3ChartContainer = d3.select('#d3ChartContainer');
    var d3Svg = d3ChartContainer.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('background-color', '#F5F5F5');

    var xScale = d3.scaleBand()
        .domain(data.map(function (d) { return d.age; }))
        .range([0, d3Svg.attr('width')])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.thalach; })])
        .nice()
        .range([d3Svg.attr('height'), 0]);

    var d3Bars = d3Svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', function (d) { return xScale(d.age); })
        .attr('y', function (d) { return yScale(d.thalach); })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return d3Svg.attr('height') - yScale(d.thalach); })
        .attr('fill', '#4285F4');

    // D3.js Chart - Histogram for maximum heart diseases by age range
    var ageGroups = d3.group(data, d => Math.floor(d.age / 10) * 10);

    var d3HistogramContainer = d3.select('#d3HistogramContainer');
    var d3SvgHistogram = d3HistogramContainer.append('svg')
        .attr('width', '100%')
        .attr('height', '400px')
        .style('background-color', '#F5F5F5');

    var xScaleHist = d3.scaleBand()
        .domain(Array.from(ageGroups.keys()).map(String))
        .range([0, d3SvgHistogram.attr('width')])
        .padding(0.1);

    var yScaleHist = d3.scaleLinear()
        .domain([0, d3.max(ageGroups, group => group[1].length)])
        .nice()
        .range([d3SvgHistogram.attr('height'), 0]);

    var d3BarsHist = d3SvgHistogram.selectAll('rect')
        .data(ageGroups)
        .enter()
        .append('rect')
        .attr('x', d => xScaleHist(String(d[0])))
        .attr('y', d => yScaleHist(d[1].length))
        .attr('width', xScaleHist.bandwidth())
        .attr('height', d => d3SvgHistogram.attr('height') - yScaleHist(d[1].length))
        .attr('fill', '#FF5733'); // Custom color
}

function countTarget(data, targetValue) {
    return data.filter(function (entry) {
        return entry.target === targetValue;
    }).length;
}
