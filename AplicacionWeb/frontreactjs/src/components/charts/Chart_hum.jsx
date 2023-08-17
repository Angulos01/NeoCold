import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart_hum = ({ dates, lim }) => {
    var hum = dates.map(function(item) {
        return parseInt(item.humedad_actual);
      })
      var time = dates.map(function(item) {
        return item.time;
      })

      if (hum.length > 15) {
        hum = hum.slice(-15);
        time = time.slice(-15);
      }

  const options = 
  {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Humidity'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: time,
        crosshair: true
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
          format: '{text}%',
        },
        gridLineWidth: 0,
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};"></td>' +
                     '<br><br><td style="font-size:15px">{point.y:.1f}%</td></tr>',

        style: {
          textAlign: 'center',
        },
      },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: '',
        data: hum

    }]
};

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart_hum;
