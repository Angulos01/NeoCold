import { useEffect, useState } from "react";
import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native'
import { buttonI } from '../common/button'
import { errormessage, formgroup, head1, head2, inputI2, labelI, link, link2 } from '../common/formcss'
import { ip } from '../common/ip'

const InsertTD = ({ navigation }) => {
  const [fdata, setFdata] = useState({
    id: '',
    name: '',
    last: '',
    curp: '',
    rfc: '',
    social_service: '',
    phone: '',
    company: '',
    claveTransport: '',
    matriculavehi: '',
    company: '',

})

const [errormsg, setErrormsg] = useState(null);

  // Holaaaaaa :3  x3
  // Hi :DD `:|
  // HOOOOOLLLA
  // hihi

const doInsert = () => {
  console.log(fdata)
  if (fdata.id == '' || fdata.name == '' || fdata.last == '' || fdata.curp == '' || fdata.rfc == '' || fdata.social_service == '' || fdata.phone == '' || fdata.company == '') {
    setErrormsg('A name should be input')
    return;
  } else {
    // console(fdata.data)
    fetch(`http://${ip}:5000/TransportDriversapp`, {
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
    <Text> </Text>
    <View style={styles.f}>
    <Text style={styles.h1}>Driver form</Text>
      <View style={formgroup}>
        <Text style={labelI}>Id</Text>
        <TextInput style={inputI2}
            placeholder="Enter an id"
            onChangeText={(text) => setFdata({ ...fdata, id: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Name</Text>
        <TextInput style={inputI2}
            placeholder="Enter a name"
            onChangeText={(text) => setFdata({ ...fdata, name: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Last Name</Text>
        <TextInput style={inputI2}
            placeholder="Enter a last name"
            onChangeText={(text) => setFdata({ ...fdata, last: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Curp</Text>
        <TextInput style={inputI2}
            placeholder="Enter the curp"
            onChangeText={(text) => setFdata({ ...fdata, curp: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>RFC</Text>
        <TextInput style={inputI2}
            placeholder="Enter the rfc"
            onChangeText={(text) => setFdata({ ...fdata, rfc: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Social Service</Text>
        <TextInput style={inputI2}
            placeholder="Enter the social service"
            onChangeText={(text) => setFdata({ ...fdata, social_service: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Phone</Text>
        <TextInput style={inputI2}
            placeholder="Enter the phone number"
            onChangeText={(text) => setFdata({ ...fdata, phone: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Company</Text>
        <TextInput style={inputI2}
            placeholder="Enter the company"
            onChangeText={(text) => setFdata({ ...fdata, company: text })}
            onPressIn={() => setErrormsg(null)}
        />
    </View>
    <Text> </Text>
    <Text> </Text>
    <Text style={styles.h1}>Transport form</Text>
    <View style={formgroup}>
        <Text style={labelI}>Transport Id</Text>
        <TextInput style={inputI2}
            placeholder="Enter the id of the vehicle"
            onChangeText={(text) => setFdata({ ...fdata, claveTransport: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Registration plate</Text>
        <TextInput style={inputI2}
            placeholder="Enter the vehicle's plate"
            onChangeText={(text) => setFdata({ ...fdata, matriculavehi: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Vehicle Insurance Number</Text>
        <TextInput style={inputI2}
            placeholder="Enter the vehicle's insurance service"
            onChangeText={(text) => setFdata({ ...fdata, SeguroVehiculo: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Vehicle's Company</Text>
        <TextInput style={inputI2}
            placeholder="Enter the company associated with the vehicle"
            onChangeText={(text) => setFdata({ ...fdata, company: text })}
            onPressIn={() => setErrormsg(null)}
        />
        </View>

      <View style={{ flex: 1, padding: 24 }}>
        <Text style={buttonI}
          onPress={() => doInsert()}
        >Insert</Text>
      </View>
      </View>
  </View> 
);
}

export default InsertTD

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
      textAlign: 'center'
  },
  f: {
    flex: 1
  }
})