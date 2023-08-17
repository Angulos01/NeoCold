import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart_coint = ({ dates }) => {
    var co2 = dates.map(function(item) {
        return parseInt(item.coint);
      })
      var time = dates.map(function(item) {
        return item.time;
      })

      if (co2.length > 15) {
        co2 = co2.slice(-15);
        time = time.slice(-15);
      }

  const options = 
  {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Gas',
        align: 'left'
    },
    xAxis: {
        categories: time,
        title: {
            text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        },
        gridLineWidth: 0
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};"></td>' +
                     '<br><br><td style="font-size:15px">{point.y:.1f} Concentracion de gas</td></tr>',

        style: {
          textAlign: 'center',
        },
      },
    plotOptions: {
        bar: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true
            },
            groupPadding: 0.1
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Cold',
        data: co2
    }]
};

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart_coint;
