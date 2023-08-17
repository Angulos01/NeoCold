import { useEffect, useState } from "react";
import React from 'react';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { buttonI } from '../common/button'
import { errormessage, formgroup, head1, head2, inputI, labelI, link, link2 } from '../common/formcss'
import { ip } from '../common/ip'

const insert = ({ navigation }) => {
  const [fdata, setFdata] = useState({
    nombre: ''
})

const [errormsg, setErrormsg] = useState(null);

const doInsert = () => {
  console.log(fdata.nombre)
  if (fdata.namebox == '') {
    setErrormsg('A name should be input')
    return;
  }
  // Holaaaaaa :3  x3
  // Hi :DD `:|
  else {
    // console(fdata.data)
    fetch(`http://${ip}:5000/NewBoxSent`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(fdata)
    })
      .then(res => res.json()).then(
          data => {
              // console.log(data);
              if (data.error) {
                  setErrormsg(data.error);
              }
              else {
                  alert('insert done!');
              }
          }
      )
  }
}

return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={formgroup}>
        <Text style={labelI}>Name</Text>
        <TextInput style={inputI}
            placeholder="Enter your name"
            defaultValue="NCB"
            onChangeText={(text) => setFdata({ ...fdata, nombre: text })}
            onPressIn={() => setErrormsg(null)}
        />
    </View>
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={buttonI}
          onPress={() => doInsert()}
        >Insert</Text>
      </View>
  </View> 
);
}

export default insert

const styles = StyleSheet.create({
  container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },
  navtitle: {
    display: 'flex',
    textAlign: 'left'
  },
  graph: {
    flex: 1,
    width: '90%',
    height: '90%'
  },
  pic: {
    width: 150,
    height: 150,
    borderRadius: 100
  },
  cont: {
    width: '90%',
    height: '10%',
    display: 'flex',
    backgroundColor: '#8A9A5B',
    borderRadius: 15
  },
  te: {
    margin: '7%, 8%, 10%, 10%'
  },
  cont1: {
    width: '90%',
    height: '10%',
    display: 'flex',
    backgroundColor: '#4F7942',
    borderRadius: 15
  },
  cont2: {
    width: '90%',
    height: '10%',
    display: 'flex',
    backgroundColor: '#355E3B',
    borderRadius: 15
  },
  cont3: {
    width: '90%',
    height: '10%',
    display: 'flex',
    backgroundColor: '#808000',
    borderRadius: 15
  },
  cont4: {
    width: '90%',
    height: '10%',
    display: 'flex',
    backgroundColor: '#097969',
    borderRadius: 15
  },
  h1: {
      fontSize: 30,
      color: '#000',
  }
})