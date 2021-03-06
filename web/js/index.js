var dataTemp = [];
var dataHum = [];
var currentEndpoint = 2;
var endpointIP = "localhost";

var chartTemp = new CanvasJS.Chart("tempGraph", {
    theme: "light2",
    axisY: {
        //title: "Temperature (in °C)",
        includeZero: false,
        suffix: "°C",
        gridColor: "#CCD1D9",
        gridThickness: 1,
    },
    data: [{
        type: "spline",
        dataPoints: dataTemp
    }],
    creditText: "",
    creditHref: "",
    backgroundColor: "transparent",
});
var chartHum = new CanvasJS.Chart("humGraph", {
    theme: "light2",
    axisY: {
        //title: "Humidty (in %)",
        includeZero: false,
        suffix: "%",
        gridColor: "#CCD1D9",
        gridThickness: 1,
    },
    data: [{
        type: "spline",
        dataPoints: dataHum
    }],
    creditText: "",
    creditHref: "",
    backgroundColor: "transparent",
});

function addData(data) {
    dataTemp = [];
    dataHum = [];
    for (var i = 0; i < data.length; i++) {
        dataTemp.push({
            x: moment(data[i].time).toDate(),
            y: Math.round(data[i].temperature * 10) / 10
        });
        dataHum.push({
            x: moment(data[i].time).toDate(),
            y: Math.round(data[i].humidity * 10) / 10
        });
    }
    chartTemp.options.data[0].dataPoints = dataTemp;
    chartHum.options.data[0].dataPoints = dataHum;
    chartTemp.render();
    chartHum.render();

}

var endpoints = [
    "http://"+endpointIP+":6723/current",
    "http://"+endpointIP+":6723/hourly",
    "http://"+endpointIP+":6723/daily",
    "http://"+endpointIP+":6723/weekly",
    "http://"+endpointIP+":6723/monthly"
];

function getEndpoint(index) {
    $.getJSON(endpoints[index], addData);
}

function changeEndpoint(index) {
    currentEndpoint = index;
    getEndpoint(currentEndpoint);
    $("#endpoints .btn").removeClass("btn-primary").addClass("btn-info");
    $("#endpoint-"+currentEndpoint).removeClass("btn-info").addClass("btn-primary");
}

function updateLast() {
    $.getJSON(endpoints[0], function (data) {
        date = moment(data.time);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $("#last-time").html(date.hours() + ":" + ('0' + date.minutes()).slice(-2) + " " + months[date.month()] + ". " + date.date());
        $("#last-temp").html((Math.round(data.temperature * 10) / 10) + "<sup>°C</sup>");
        $("#last-hum").html((Math.round(data.humidity * 10) / 10) + "<sup>%</sup>");
    });
}

updateLast(); // Load the most recent data
changeEndpoint(currentEndpoint); // Set button to default pref, and load data

setInterval(function () {
    updateLast(); // Update the most recent data
    getEndpoint(currentEndpoint); // Update the graph based on last chosen pref
}, 30 * 1000);
