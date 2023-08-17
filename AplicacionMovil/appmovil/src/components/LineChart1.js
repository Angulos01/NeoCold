import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import { cont, cont2, container } from '../common/graphs';

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0.3,
  backgroundGradientTo: "#1E2923",
  backgroundGradientToOpacity: 0.3,
  color: (opacity = 1) => `rgba(242, 242, 242, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false
}

export default function Graph1({ info }) {
  // Limitar la cantidad de datos a mostrar
  const limitedInfo = info.slice(0, 10); // Cambia el número según tus necesidades

  const temp = limitedInfo.map(function (item) {
    return parseInt(item.temperatura_actual);
  });
  const time = limitedInfo.map(function (item) {
    return item.time;
  });

  const data = {
    labels: time,
    datasets: [
      {
        data: temp,
        color: (opacity = 1) => `rgba(47, 168, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Actual Temperature"]
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={container}>
        <View style={cont2}>
          <LineChart
            data={data}
            width={300}
            height={300}
            verticalLabelRotation={30}
            chartConfig={chartConfig}
            style={cont}
            bezier
          />
        </View>
      </View>
    </View>
  )
}