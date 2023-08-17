import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { container, h1 } from '../common/graphs';
import Graph1 from "./LineChart1";
import Graph2 from "./LineChart2";
import Graph3 from "./ProgressChart";
import { ip } from '../common/ip';
import Information from "./information";

export default function Graph({ email, password }) {
  const [data, setData] = useState([]);
  const [boxInformation, setBoxInformation] = useState({});

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
        setData(json);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchData(); // Llama a fetchData al cargar el componente
    
    const intervalId = setInterval(() => {
      fetchData(); // Llama a fetchData cada 2 minutos
    }, 10000);
    
    return () => {
      clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    };
  }, []);

  const handleShowInformation = (keyBox) => {
    setBoxInformation({ ...boxInformation, [keyBox]: true });
  };

  const handleCloseInformation = (keyBox) => {
    setBoxInformation({ ...boxInformation, [keyBox]: false });
  };

  const handleDeleteBox = (keyBox, client) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this box?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            console.log('Deleting box...', keyBox, client);
            try {
              const response = await fetch(`http://${ip}:5000/deleteboxclient`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  boxname: keyBox, // Cambia esto según tu backend
                  cliente: client,  // Cambia esto según tu backend
                }),
              });
              
              const responseData = await response.json();
              console.log(responseData)
            } catch (error) {
              console.error('Error updating data:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={container}>
        <Text style={h1}> Graphs </Text>
        <Text>Temperature</Text>
        {data.boxes && data.boxes.map((caja) => (
          <View key={caja.key_box}>
            <Text style={{ textAlign: 'center' }}>Box: {caja.nombre}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleDeleteBox(caja.key_box, caja.client)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Delete This Box</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShowInformation(caja.key_box)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Information</Text>
                </View>
              </TouchableOpacity>
            </View>
            {boxInformation[caja.key_box] && (
              <Information data={caja} onClose={() => handleCloseInformation(caja.key_box)} />
            )}
            <View>
              <Graph1 info={data.logs[caja.key_box]} />
            </View>
            <View>
              <Graph2 info={data.logs[caja.key_box]} />
            </View>
            <View>
              <Graph3 info={data.logs[caja.key_box]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row', // Cambia la dirección de los elementos a una columna
    justifyContent: 'space-around',
       // Centra los elementos horizontalmente
  },
  button: {
    backgroundColor: 'blue',        // Fondo azul
    borderRadius: 10,               // Borde redondeado
    padding: 10,                    // Espaciado interno
    marginVertical: 5,              // Margen vertical
    alignItems: 'center',           // Centra el contenido horizontalmente
  },
  buttonText: {
    color: 'white',                // Texto en blanco
    fontSize: 16,                  // Tamaño de fuente
  },
});
