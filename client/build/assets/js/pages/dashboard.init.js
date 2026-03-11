var options = {
    series: [
        {
            name: "Rental Holdings",
            data: [44, 55, 57, 56, 61, 58, 63],
        },
        {
            name: "Fees",
            data: [76, 85, 101, 98, 87, 105, 91],
        },
        {
            name: "Refunds",
            data: [35, 41, 36, 26, 45, 48, 52],
        },
    ],
    chart: {
        type: "bar",
        height: 250,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "65%",
            borderRadiusApplication: "end",
        },
    },
    dataLabels: {
        enabled: false,
    },
    legend:{ 
        markers: {
            shape: 'circle', 
        } 
    },
    stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
    },
    xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
        tickAmount: 6,
        labels: {
            formatter: function (value) {
                return "$" + value + "k";
            }
        },
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return "$" + val + "k";
            },
        },
    },
};

var chart = new ApexCharts(document.querySelector("#rent-transactions"), options);
chart.render();


var options = {
    series: [
        {
            name: "Total Users",
            data: [44, 55, 57, 56, 61, 58, 63],
        }
    ],
    chart: {
        type: "area",
        height: 250,
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
        tickAmount: 6,
        labels: {
            formatter: function (value) {
                return value + "k";
            }
        },
    },
    stroke: {
        width: 3
    },
    markers: {
        size: 4,
        hover: {
            size: 6
        }
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + "k";
            },
        },
    },
};

var chart = new ApexCharts(document.querySelector("#total-users"), options);
chart.render();


var options = {
    series: [
        {
            name: "Users",
            data: [44, 55, 57, 56, 61, 58, 63],
        }
    ],
    chart: {
        type: "area",
        height: 305,
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
        tickAmount: 6,
        labels: {
            formatter: function (value) {
                return value + "k";
            }
        },
    },
    stroke: {
        width: 3
    },
    markers: {
        size: 4,
        hover: {
            size: 6
        }
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + "k";
            },
        },
    },
};

var chart = new ApexCharts(document.querySelector("#user-chart"), options);
chart.render();


var options = {
    series: [
        {
            name: "Boost Revenue",
            data: [44, 55, 57, 56, 61, 58, 63],
        },
        {
            name: "Premium Revenue",
            data: [76, 85, 101, 98, 87, 105, 91],
        }
    ],
    chart: {
        type: "bar",
        height: 250,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "60%",
            borderRadiusApplication: "end",
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
    },
    legend:{ 
        markers: {
            shape: 'circle', 
        } 
    },
    xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
        tickAmount: 6,
        labels: {
            formatter: function (value) {
                return "$" + value + "k";
            }
        },
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return "$" + val + "k";
            },
        },
    },
};

var chart = new ApexCharts(document.querySelector("#subscription-revenue"), options);
chart.render();


var options = {
    series: [20, 20, 30, 80],
    labels: ['New', 'Completed', 'In Process', 'In Complete'],
    colors: ['#bb2d3b','#00E096','#FFA412','#D80027'],
    chart: {
        type: "donut",
        height: 115,
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 0
    },
    plotOptions: {
        pie: {
            customScale: 1.1,
            donut: {
              size: '75%'
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#team-perf1"), options);
chart.render();


var options = {
    series: [40, 90, 30, 30],
    labels: ['New', 'Completed', 'In Process', 'In Complete'],
    colors: ['#bb2d3b','#00E096','#FFA412','#D80027'],
    chart: {
        type: "donut",
        height: 115,
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 0
    },
    plotOptions: {
        pie: {
            customScale: 1.1,
            donut: {
              size: '75%'
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#team-perf2"), options);
chart.render();


var options = {
    series: [40, 40, 20, 40],
    labels: ['New', 'Completed', 'In Process', 'In Complete'],
    colors: ['#bb2d3b','#00E096','#FFA412','#D80027'],
    chart: {
        type: "donut",
        height: 115,
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 0
    },
    plotOptions: {
        pie: {
            customScale: 1.1,
            donut: {
              size: '75%'
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#team-perf3"), options);
chart.render();


var options = {
    series: [30, 80, 20, 20],
    labels: ['New', 'Completed', 'In Process', 'In Complete'],
    colors: ['#bb2d3b','#00E096','#FFA412','#D80027'],
    chart: {
        type: "donut",
        height: 115,
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 0
    },
    plotOptions: {
        pie: {
            customScale: 1.1,
            donut: {
              size: '75%'
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#team-perf4"), options);
chart.render();


document.addEventListener("DOMContentLoaded", function () {
    const visitorData = [
        { city: "Alabama", visitors: 423, coords: [32.8067, -86.7911], color: "#FF6633" },
        { city: "Alaska", visitors: 187, coords: [64.2008, -149.4937], color: "#FFB399" },
        { city: "Arizona", visitors: 645, coords: [34.0489, -111.0937], color: "#FF33FF" },
        { city: "Arkansas", visitors: 312, coords: [34.9697, -92.3731], color: "#FFFF99" },
        { city: "California", visitors: 6800, coords: [36.7783, -119.4179], color: "#00e096" },
        { city: "Colorado", visitors: 8500, coords: [38.9, -106], color: "#ffa412" },
        { city: "Connecticut", visitors: 529, coords: [41.6032, -73.0877], color: "#00B3E6" },
        { city: "Delaware", visitors: 276, coords: [38.9108, -75.5277], color: "#E6B333" },
        { city: "Florida", visitors: 731, coords: [27.9944, -81.7603], color: "#3366E6" },
        { city: "Georgia", visitors: 598, coords: [32.1656, -82.9001], color: "#999966" },
        { city: "Hawaii", visitors: 384, coords: [19.8968, -155.5828], color: "#99FF99" },
        { city: "Idaho", visitors: 217, coords: [44.0682, -114.7420], color: "#B34D4D" },
        { city: "Illinois", visitors: 653, coords: [40.6331, -89.3985], color: "#80B300" },
        { city: "Indiana", visitors: 492, coords: [39.8494, -86.2583], color: "#809900" },
        { city: "Iowa", visitors: 341, coords: [42.0115, -93.2105], color: "#E6B3B3" },
        { city: "Kansas", visitors: 275, coords: [38.5266, -96.7265], color: "#6680B3" },
        { city: "Kentucky", visitors: 419, coords: [37.6681, -84.6701], color: "#66991A" },
        { city: "Louisiana", visitors: 503, coords: [31.1695, -91.8678], color: "#FF99E6" },
        { city: "Maine", visitors: 198, coords: [45.2538, -69.4455], color: "#CCFF1A" },
        { city: "Maryland", visitors: 567, coords: [39.0639, -76.8021], color: "#FF1A66" },
        { city: "Massachusetts", visitors: 612, coords: [42.4072, -71.3824], color: "#E6331A" },
        { city: "Michigan", visitors: 587, coords: [44.3148, -85.6024], color: "#33FFCC" },
        { city: "Minnesota", visitors: 436, coords: [46.7296, -94.6859], color: "#66994D" },
        { city: "Mississippi", visitors: 329, coords: [32.3547, -89.3985], color: "#B366CC" },
        { city: "Missouri", visitors: 478, coords: [38.4561, -92.2884], color: "#4D8000" },
        { city: "Montana", visitors: 254, coords: [46.8797, -110.3626], color: "#B33300" },
        { city: "Nebraska", visitors: 291, coords: [41.4925, -99.9018], color: "#CC80CC" },
        { city: "Nevada", visitors: 367, coords: [38.8026, -116.4194], color: "#66664D" },
        { city: "New Hampshire", visitors: 225, coords: [43.1939, -71.5724], color: "#991AFF" },
        { city: "New Jersey", visitors: 543, coords: [40.0583, -74.4057], color: "#E666FF" },
        { city: "New Mexico", visitors: 318, coords: [34.9727, -105.0324], color: "#4DB3FF" },
        { city: "New York", visitors: 9800, coords: [42.8, -76.006], color: "#bb2d3b" },
        { city: "North Carolina", visitors: 672, coords: [35.7596, -79.0193], color: "#1AB399" },
        { city: "North Dakota", visitors: 203, coords: [47.5515, -101.0020], color: "#E666B3" },
        { city: "Ohio", visitors: 621, coords: [40.4173, -82.9071], color: "#33991A" },
        { city: "Oklahoma", visitors: 387, coords: [35.0078, -97.0929], color: "#CC9999" },
        { city: "Oregon", visitors: 429, coords: [43.8041, -120.5542], color: "#B3B31A" },
        { city: "Pennsylvania", visitors: 578, coords: [41.2033, -77.1945], color: "#00E680" },
        { city: "Rhode Island", visitors: 246, coords: [41.5801, -71.4774], color: "#4D8066" },
        { city: "South Carolina", visitors: 512, coords: [33.8361, -81.1637], color: "#809980" },
        { city: "South Dakota", visitors: 239, coords: [43.9695, -99.9018], color: "#E6FF80" },
        { city: "Tennessee", visitors: 497, coords: [35.5175, -86.5804], color: "#1AFF33" },
        { city: "Texas", visitors: 7200, coords: [31.9686, -99.9018], color: "#0095ff" },
        { city: "Utah", visitors: 356, coords: [39.3210, -111.0937], color: "#FF3380" },
        { city: "Vermont", visitors: 211, coords: [44.5588, -72.5778], color: "#CCCC00" },
        { city: "Virginia", visitors: 534, coords: [37.4316, -78.6569], color: "#66E64D" },
        { city: "Washington", visitors: 482, coords: [47.7511, -120.7401], color: "#4D80CC" },
        { city: "West Virginia", visitors: 267, coords: [38.5976, -80.4549], color: "#9900B3" },
        { city: "Wisconsin", visitors: 403, coords: [43.7844, -88.7879], color: "#E64D66" },
        { city: "Wyoming", visitors: 228, coords: [43.0760, -107.2903], color: "#4DB380" }
    ];

    // Create the map
    const map = new jsVectorMap({
        selector: "#map",
        map: "us_merc_en",
        enableZoom: true,
        zoomOnScroll: true,
        zoomButtons: true,
        regionStyle: {
            initial: {
                stroke: "#666666",
                strokeWidth: 0.25,
                fill: "#F1F1F1",
                fillOpacity: 1,
            },
            hover: {
                fill: "#b6b7ff",
            }
        },
        markers: visitorData.map((data) => ({
            name: `${data.city}: ${data.visitors.toLocaleString()}`,
            coords: data.coords,
            visitors: data.visitors,
            style: { fill: data.color || "#038edc" },
        })),
        markerStyle: {
            initial: {
                fill: "#038edc",
                stroke: "#e3eaef",
                strokeWidth: 7,
                r: 7,
            },
            selected: {
                fill: "red",
            },
        },
        labels: {
            markers: {
                render: function (marker) {
                    return marker.visitors.toLocaleString();
                },
            },
        },
        onMarkerLabelShow: function (event, label, index) {
            label.html(visitorData[index].visitors.toLocaleString());
        },
        onMarkerTipShow: function(event, label, index) {
            // Get the marker's color directly from the data object
            const markerColor = visitorData[index].color || "#038edc";
            
            // Create a new tooltip element
            const tooltip = document.createElement('div');
            tooltip.style.backgroundColor = markerColor;
            tooltip.style.color = getContrastColor(markerColor);
            tooltip.style.padding = '6px 10px';
            tooltip.style.borderRadius = '3px';
            tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            tooltip.innerHTML = `${visitorData[index].city}: ${visitorData[index].visitors.toLocaleString()}`;
            
            // Replace the default tooltip
            label[0].parentNode.replaceChild(tooltip, label[0]);
            
            // Return false to prevent default tooltip behavior
            return false;
        },
    });
});