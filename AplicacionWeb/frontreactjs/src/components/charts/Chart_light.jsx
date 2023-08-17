import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart_light = ({ dates, lim }) => {
    var light = dates.map(function(item) {
        return parseInt(item.luz_photores);
      })
      var time = dates.map(function(item) {
        return item.time;
      })

      if (light.length > 15) {
        light = light.slice(-15);
        time = time.slice(-15);
      }

  const options = 
  {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Light'
    },
    xAxis: {
        categories: time,
        allowDecimals: false
    },
    yAxis: {
        plotLines: [{
            value: lim,
            color: '#3257EC',
            dashStyle: 'shortDash',
            width: 2,
          }],
        title: {
            text: 'Nuclear weapon states'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};"></td>' +
                     '<br><br><td style="font-size:15px">{point.y:.1f}LM</td></tr>',

        style: {
          textAlign: 'center',
        },
      },
    series: [{
        name: 'Light',
        data: light
    }]
};

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart_light;
