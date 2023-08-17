import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = ({ dates, lim }) => {
  var temp = dates.map(function(item) {
    return parseInt(item.temperatura_actual);
  })
  var time = dates.map(function(item) {
    return item.time;
  })

  if (temp.length > 15) {
    temp = temp.slice(-15);
    time = time.slice(-15);
  }

  const options = {
    title: {
      text: 'Temperature',
      align: 'left',
      margin: 25,
    },
    yAxis: {
      plotLines: [{
        value: lim,
        color: '#3257EC',
        dashStyle: 'shortDash',
        width: 2,
      }],
      title: {
        enabled: false,
      },
      labels: {
        format: '{text}°C',
      },
      gridLineWidth: 0,
    },

    xAxis: {
      crosshair: true,
      categories: time
      
    },

    legend: {
      enabled: false,
    },

    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};"></td>' +
                   '<br><br><td style="font-size:15px">{point.y:.1f}°C</td></tr>',

      style: {
        textAlign: 'center',
      },
    },

    series: [{
      name: '',
      data: temp,
      color: '#2F2D2E',
    }],

  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;
