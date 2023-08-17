import { useEffect, useState } from "react";
import React from 'react';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { buttonI } from '../common/button'
import { errormessage, formgroup, head1, head2, inputI2, labelI, link, link2 } from '../common/formcss'
import { ip } from '../common/ip'

const InsertCU = ({ navigation }) => {
  const [fdata, setFdata] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    pais: '',
    telefono: '',
    correo_electronico: '',
    number: '',
    username: '',
    password: '',
    cpassword: '',
    name: '',
    last: '',
    birthdate: '',
    age: '',
    occupation: ''
  }
)

const [errormsg, setErrormsg] = useState(null);

const doInsert = () => {
  console.log(fdata)
  if (fdata.nombre == '' || fdata.direccion == '' || fdata.ciudad == '' || fdata.pais == '' || fdata.telefono == '' || fdata.correo_electronico == '') {
    setErrormsg('All fields are required')
    return;
  } else if (fdata.number == '' || fdata.username == '' || fdata.password == '' || fdata.cpassword == '' || fdata.name == '' || fdata.last == '' || fdata.birthdate == '' || fdata.age == '' || fdata.occupation == '') {
    setErrormsg('All fields are required')
    return;
  }
  // Holaaaaaa :3  x3
  // Hi :DD `:|
  else {
    if (fdata.password != fdata.cpassword) {
      setErrormsg('Password and Confirm Password must be same');
      return;
    } else {
      // console(fdata.data)
      fetch(`http://${ip}:5000/CompanyUser`, {
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
}

return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text> </Text>
    <View style={styles.f}>
    <Text style={styles.h1}> Company form </Text>
      <View style={formgroup}>
        <Text style={labelI}>Name</Text>
        <TextInput style={inputI2}
            placeholder="Company name"
            onChangeText={(text) => setFdata({ ...fdata, nombre: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Address</Text>
        <TextInput style={inputI2}
            placeholder="Enter the address"
            onChangeText={(text) => setFdata({ ...fdata, direccion: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>City</Text>
        <TextInput style={inputI2}
            placeholder="Enter the city"
            onChangeText={(text) => setFdata({ ...fdata, ciudad: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Country</Text>
        <TextInput style={inputI2}
            placeholder="Enter the country"
            onChangeText={(text) => setFdata({ ...fdata, pais: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Telephone</Text>
        <TextInput style={inputI2}
            placeholder="Telephone"
            onChangeText={(text) => setFdata({ ...fdata, telefono: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Email</Text>
        <TextInput style={inputI2}
            placeholder="Enter the company's email"
            onChangeText={(text) => setFdata({ ...fdata, correo_electronico: text })}
            onPressIn={() => setErrormsg(null)}
        />
    </View>
    <Text> </Text>
    <Text> </Text>
    <Text style={styles.h1}> Users form </Text>
    <View style={formgroup}>
    <Text style={labelI}>User</Text>
        <TextInput style={inputI2}
            placeholder="User number"
            onChangeText={(text) => setFdata({ ...fdata, number: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Email</Text>
        <TextInput style={inputI2}
            placeholder="Enter an email"
            onChangeText={(text) => setFdata({ ...fdata, username: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Password</Text>
        <TextInput style={inputI2}
            placeholder="Enter a password"
            onChangeText={(text) => setFdata({ ...fdata, password: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Confirm Password</Text>
        <TextInput style={inputI2}
            placeholder="Confirm the password"
            onChangeText={(text) => setFdata({ ...fdata, cpassword: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Name</Text>
        <TextInput style={inputI2}
            placeholder="Enter the user's name"
            onChangeText={(text) => setFdata({ ...fdata, name: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Last name</Text>
        <TextInput style={inputI2}
            placeholder="Enter the user's last name"
            onChangeText={(text) => setFdata({ ...fdata, last: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Birthdate</Text>
        <TextInput style={inputI2}
            placeholder="Enter the user's birthdate"
            onChangeText={(text) => setFdata({ ...fdata, birthdate: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Age</Text>
        <TextInput style={inputI2}
            placeholder="Enter the user's age"
            onChangeText={(text) => setFdata({ ...fdata, age: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Occupation</Text>
        <TextInput style={inputI2}
            placeholder="User's occupation"
            onChangeText={(text) => setFdata({ ...fdata, occupation: text })}
            onPressIn={() => setErrormsg(null)}
        />
        <Text style={labelI}>Company</Text>
        <TextInput style={inputI2}
            placeholder="Enter the company's name the user belongs to"
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
      <Text> </Text>
  </View> 
);
}

export default InsertCU

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