import React, { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more"; // Importa highcharts-more
import HighchartsExporting from "highcharts/modules/exporting"; // Importa el módulo exporting
import HighchartsReact from "highcharts-react-official";

HighchartsMore(Highcharts); // Inicializa highcharts-more
HighchartsExporting(Highcharts); // Inicializa el módulo exporting

const Gauge = ({ dates }) => {
  const [lastEnergy, setLastEnergy] = useState(0);
  const maxSensorValue = 3700;
  const maxChartValue = 100;

  // Mapear los valores del sensor al rango del gráfico
  const mapSensorToChart = (sensorValue) => {
    return (sensorValue / maxSensorValue) * maxChartValue;
  };

  const battery = dates.map(function(item) {
    return parseInt(item.energy);
  });

  const lastSensorValue = battery.length > 0 ? battery[battery.length - 1] : 0;
  const lastChartData = mapSensorToChart(lastSensorValue);

  const plotOptions = {
    plotBackgroundColor: null,
    plotBackgroundImage: null,
    plotBorderWidth: 0,
    plotShadow: false
  };

  const paneOptions = {
    startAngle: -120,
    endAngle: 120,
    background: [
      {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, "#FFF"], [1, "#333"]]
        },
        borderWidth: 0,
        outerRadius: "109%"
      },
      {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, "#333"], [1, "#FFF"]]
        },
        borderWidth: 1,
        outerRadius: "107%"
      },
      {
        backgroundColor: "#DDD",
        borderWidth: 0,
        outerRadius: "105%",
        innerRadius: "103%"
      }
    ]
  };

  //const seriesData = energy; // Cambia estos datos por los que necesites

  const options = {
    chart: {
        type: 'solidgauge'
    },
    plotOptions: plotOptions,
    pane: paneOptions,
    tooltip: {
      padding: 10,
      hideDelay: 250,
      shape: "square"
    },
    title: {
      text: "Box energy"
    },
    xAxis: {},
    yAxis: {
      id: "myAxis",
      min: 0,
      max: 100,
      minorTickInterval: "auto",
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: "inside",
      minorTickColor: "#666",
      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: "inside",
      tickLength: 10,
      tickColor: "#666",
      labels: {
        step: 2,
        rotation: "auto"
      },
      plotBands: [
        {
          from: 0,
          to: 15,
          color: "#DF5353"
        },
        {
          from: 15,
          to: 45,
          color: "#DDDF0D"
        },
        {
          from: 45,
          to: 100,
          color: "#55BF3B"
        }
      ]
    },
    series: [
      {
        id: "series",
        name: "Value",
        data: [lastChartData],
        type: "gauge"
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Gauge;

