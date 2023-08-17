import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import penguinog from '../../assets/penguinog.png'
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, Button,  } from 'react-native';
import { ip } from '../common/ip'


export default function Map({ email, password }) {
    const [data, setData] = useState([]);
  
    const fetchData = () => {
      fetch(`http://${ip}:5000/database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
        .then((response) => response.json())
        .then((json) => {
          console.log("Data ->", json);
          setData(json);
        })
        .catch((error) => console.error(error));
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const getLastCoordinates = (box) => {
      const logs = data.logs[box];
      if (logs && logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        return {
          latitude: parseFloat(lastLog.latitud),
          longitude: parseFloat(lastLog.longitud)
        };
      }
      return null;
    };
  
    if (!data.logs) {
      return <Text>Loading...</Text>;
    }
  
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: 32.452726,
            longitude: -116.901928,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          showsUserLocation={true}
        >
          {data.boxes.map((box, index) => {
            const coordinates = getLastCoordinates(box.key_box);
            if (coordinates) {
              return (
                <Marker
                  key={index}
                  coordinate={coordinates}
                  title={`Box: ${box.key_box}`}
                  description={`Lat: ${coordinates.latitude}, Lng: ${coordinates.longitude}`}
                />
              );
            }
            return null;
          })}
        </MapView>
      </View>
    );
  }
  