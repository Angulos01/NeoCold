import { useEffect, useState } from "react";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
    LineChart
  } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import { cont, cont2, cont3, container, h1 } from '../common/graphs'

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0.3,
    backgroundGradientTo: "#1E2923",
    backgroundGradientToOpacity: 0.3,
    color: (opacity = 1) => `rgba(242, 242, 242, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
}

export default function Graph2({info}) {
    var co2 = info.map(function(item) {
        return parseInt(item.coint);
      })
      var time = info.map(function(item) {
        return item.time;
      })

    const data = {
        labels: time,
        datasets: [
          {
            data: co2,  //[20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(47, 168, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Actual Temperature"] // optional
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={container}>
                <Text> </Text> 
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
                <Text> </Text> 
            </View>
        </View>
    )
}