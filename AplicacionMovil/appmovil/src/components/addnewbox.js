import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ip } from '../common/ip';

export default function AddNewBox({ showAddBox, email, password, handleShowAdd, handleCloseAdd }) {
    const [data, setData] = useState({});
    const [datatosent, setdatatosent] = useState({});

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
      },[])



  const handleInputChange = (fieldName, value) => {
    console.log(value)
    setdatatosent((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    
  };

  const handleCreate = () => {
    fetch(`http://${ip}:5000/addboxtoclient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datatosent)
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
        })
        .catch((error) => console.error(error));
  };



  return (
    <View>
      <TouchableOpacity onPress={() => handleShowAdd()}>
        <View style={styles.button}>
            <Text style={styles.buttonText} >Add Box</Text>
        </View>
      </TouchableOpacity>
      {showAddBox && (
        <View>
            <Text> Serial Name of box: </Text>
            <TextInput
                style={styles.input}
                placeholder='NCB'
                onChangeText={(value) => handleInputChange('boxname', value)}
            />
            <TextInput
                style={{ color: 'transparent' }}
                value={ () => handleInputChange('cliente', data.user.number)}
            />
            <Text> About who Transport:</Text>
            <Text>Key Transports</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('claveTransport', value)}
            />
            <Text>Secure Number of Vehicule</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('seguroVehiculo', value)}
            />
            <Text>Enrollment of the Vehicule</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('matriculavehi', value)}
            />
            <Text> About who driver:</Text>
            <Text>ID</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('id', value)}
            />
            <Text> FullName of conductor</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('name', value)}
            />
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('last', value)}
            />
            <Text>National identification code</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('curp', value)}
            />
            <Text>Job ID Code </Text>
            <TextInput
                  style={styles.input}
                  onChangeText={(value) => handleInputChange('rfc', value)}
            />
            <Text>Number of Social Service </Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('social_service', value)}
            />
            <Text>Phone Number</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange('phone', value)}
            />
            <Text>Company</Text>
            <TextInput
                style={styles.input}
                onChangeText={() => handleInputChange('company', data.user.company.id)}
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleCreate}>
                <Text style={styles.updateButtonText}>Insert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseAdd}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
      </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    updateButton: {
      backgroundColor: 'blue',
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 10,
    },
    updateButtonText: {
      color: 'white',
      fontSize: 16,
    },
    closeButton: {
      backgroundColor: 'red',
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 10,
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
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
  