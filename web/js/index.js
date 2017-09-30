var dataTemp = [];
var dataHum = [];
var currentEndpoint = 1;

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
            x: new Date(data[i].time.replace(' ', 'T')),
            y: parseFloat(data[i].temperature)
        });
        dataHum.push({
            x: new Date(data[i].time.replace(' ', 'T')),
            y: parseFloat(data[i].humidity)
        });
    }
    chartTemp.options.data[0].dataPoints = dataTemp;
    chartHum.options.data[0].dataPoints = dataHum;
    chartTemp.render();
    chartHum.render();

}

var endpoints = [
    "http://45.77.142.144:6723/current",
    "http://45.77.142.144:6723/hourly",
    "http://45.77.142.144:6723/daily",
    "http://45.77.142.144:6723/weekly",
    "http://45.77.142.144:6723/monthly"
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
        date = new Date(data.time.replace(' ', 'T'))
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $("#last-time").html(date.getHours() + ":" + date.getMinutes() + " " + months[date.getMonth()] + ". " + date.getDate());
        $("#last-temp").html((Math.round(data.temperature * 10) / 10) + "<sup>°C</sup>");
        $("#last-hum").html((Math.round(data.humidity * 10) / 10) + "<sup>%</sup>");
    });
}

getEndpoint(currentEndpoint);
setInterval(function () {
    getEndpoint(currentEndpoint);
    updateLast();
}, 1000);
