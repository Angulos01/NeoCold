import { useEffect, useState } from "react";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ip } from '../common/ip'
import ModalUpdateT from '../components/ModalUpdateT'

const TableT = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
 
  const openModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  const handleFormSubmit = () => {
    closeModal();
  };
 
  const fetchData = () => {
    fetch(`http://${ip}:5000/alltransports`)
      .then((response) => response.json())
      .then((json) => {
          console.log("Data ->",json);
          setProducts(json)
      })
      .catch((error) => console.error(error))
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (keytransport) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this transport?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            console.log('Deleting user...', keytransport);
            try {
              const response = await fetch(`http://${ip}:5000/deletedataoftable`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  table: 'transports',
                  id: keytransport, 
                  key: 'claveTransport' // Corregido: Quita el espacio al final
                }),
              });
  
              const responseData = await response.json();
              if (response.ok) {
                console.log(responseData);
              } else {
                throw new Error(responseData.Error);
              }
            } catch (error) {
              console.error('Error deleting user:', error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <Text style={styles.cell}>Transport Id</Text>
        <Text style={styles.cell}>Registration Plate</Text>
        <Text style={styles.cell}>Insurance</Text>
        <Text style={styles.cell}>Conductor</Text>
        <Text style={styles.cell}>Actions</Text>
      </View>
      {products.all_transports && products.all_transports.map((product) => (
        <View style={styles.row} key={product.matriculavehi}>
          <Text style={styles.cell}>{product.claveTransport}</Text>
          <Text style={styles.cell}>{product.matriculavehi}</Text>
          <Text style={styles.cell}>{product.SeguroVehiculo}</Text>
          <Text style={styles.cell}>{product.conductor}</Text>
          
          <View style={styles.cell}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openModal(product)}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Update</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteUser(product.claveTransport)}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Delete</Text>
                </View>
              </TouchableOpacity>
          </View>
        </View>
      ))}
      {modalVisible && (
        <ModalUpdateT
          visible={modalVisible}
          selectedProduct={selectedProduct}
          onFormSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
    width: 400,
    backgroundColor: 'white'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    marginTop: 5
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center'
  },
  btn: { 
    width: 58, 
    height: 18, 
    backgroundColor: '#2fa8f4',  
    borderRadius: 6,
    marginBottom: 3,
    margin: 2
  },
  btnText: { 
    textAlign: 'center', 
    color: '#fff'
  }
});

export default TableT;