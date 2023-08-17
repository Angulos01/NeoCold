import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ip } from '../common/ip';

export default function Information({ data, onClose }) {
  const [editedData, setEditedData] = useState({});
  const [actualdata, setActualData] = useState({})


  const handleInputChange = (fieldName, value) => {
    console.log(value)
    setEditedData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    
  };

  const handleUpdate = () => {
    console.log(editedData)
    fetch(`http://${ip}:5000/updconductor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Server Response:', responseData);
        onClose();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };



  return (
    <View style={styles.container}>
    <TextInput
        style={{ color: 'transparent' }}
        value={ () => handleInputChange('id', data.transports.conductor.id)}
      />
      <Text> Serial Name of box: </Text>
      <TextInput
        style={styles.input}
        placeholder={data.nombre}
        placeholderTextColor="#999"
        editable={false}
      />
      <Text> About who driver:</Text>
      <Text> FullName of conductor</Text>
      <TextInput
        style={styles.input}
        placeholder={data.transports.conductor.name}
        placeholderTextColor="#999"
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder={data.transports.conductor.last}
        placeholderTextColor="#999"
        onChangeText={(value) => handleInputChange('last', value)}
      />
      <Text>National identification code</Text>
      <TextInput
        style={styles.input}
        placeholder={data.transports.conductor.curp}
        placeholderTextColor="#999"
        onChangeText={(value) => handleInputChange('curp', value)}
      />
      <Text>Job ID Code </Text>
      <TextInput
        style={styles.input}
        placeholder={data.transports.conductor.rfc}
        placeholderTextColor="#999"
        onChangeText={(value) => handleInputChange('rfc', value)}
      />
      <Text>Number of Social Service </Text>
      <TextInput
        style={styles.input}
        placeholder={data.transports.conductor.social_service}
        placeholderTextColor="#999"
        onChangeText={(value) => handleInputChange('social_service', value)}
      />
      <Text>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder={data.transports.conductor.phone}
        placeholderTextColor="#999"
        onChangeText={(value) => handleInputChange('phone', value)}
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
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
});
