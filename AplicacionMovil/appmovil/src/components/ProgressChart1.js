import { useEffect, useState } from "react";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
    ProgressChart
  } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import { cont, cont2, cont3, container, h1 } from '../common/graphs'

const chartConfig2 = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0.3,
    backgroundGradientTo: "#1E2923",
    backgroundGradientToOpacity: 0.3,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
}

export default function Graph3({info}) {
    //Solo conseguir el ultimo dato de energia
    var energy = info.map(function(item) {
        return parseInt(item.energia);
      })

      var energyCopy = energy.slice(); // Hacer una copia del array original
    var lastEnergy = energyCopy.pop(); // Obtener el último elemento sin modificar el array original

const data2 = {
    // labels: ["Swim", "Bike", "Run"], // optional
    data: [, lastEnergy]
  };

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={container}>
                <Text> </Text> 
                    <Text>Battery</Text> 
                    <Text> </Text>
                    <ProgressChart
                        data={data2}
                        width={screenWidth}
                        height={220}
                        strokeWidth={16}
                        radius={32}
                        chartConfig={chartConfig2}
                        hideLegend={false}
                        style={cont3}
                    />
                <Text> </Text> 
            </View>
        </View>
    )
} 

// const styles = StyleSheet.create({
//     container: {
//         width: '100%',
//         alignItems: 'center',
//         // display: 'flex',
//         // alignItems: 'flex-end',
//         // justifyContent: 'center'
//     },
//     cont: {
//         borderRadius: 30
//     },
//     cont2: {
//         borderRadius: 30,
//         // width:'100%'
//     },
//     cont3: {
//         borderRadius: 30,
//         width:'100%'
//     },
//     h1: {
//         fontSize: 30,
//         color: '#000',
//     }
// })