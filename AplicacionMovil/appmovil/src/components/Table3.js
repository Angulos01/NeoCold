import { useEffect, useState } from "react";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ip } from '../common/ip'

const Table = () => {
  const [products, setProducts] = useState([]);
 
  const fetchData = () => {
    fetch(`http://${ip}:5000/allboxes`)
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

  console.log("Products ->")
  console.log(products)

  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <Text style={styles.cell}>Key Box</Text>
        <Text style={styles.cell}>Serial Name</Text>
        <Text style={styles.cell}>Client of</Text>
        <Text style={styles.cell}>Which Vehicle</Text>
        <Text style={styles.cell}>Actions</Text>
      </View>
      {products.all_boxes && products.all_boxes.map((product) => (
        <View style={styles.row} key={product.key_box}>
          <Text style={styles.cell}>{product.key_box}</Text>
          <Text style={styles.cell}>{product.nombre}</Text>
          <Text style={styles.cell}>{product.client}</Text>
          <Text style={styles.cell}>{product.transports}</Text>
            <TouchableOpacity onPress={() => this.Alert('hi')}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Update?</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.Alert('hi2')}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Delete?</Text>
              </View>
            </TouchableOpacity>
          {/*</View>*/}
        </View>
      ))}
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
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  btn: { 
    width: 58, 
    height: 18, 
    backgroundColor: '#2fa8f4',  
    borderRadius: 6 
  },
  btnText: { 
    textAlign: 'center', 
    color: '#fff'
  }
});

export default Table;