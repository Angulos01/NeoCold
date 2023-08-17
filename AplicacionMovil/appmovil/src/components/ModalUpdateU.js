import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { ip } from "../common/ip";
import { errormessage, formgroup, head1, head2, inputModal, labelI, link, link2 } from '../common/formcss'

const ModalUpdateU = ({ visible, selectedProduct, onClose }) => {
  const [fdata, setFdata] = useState({
    number: selectedProduct.number,
    username: selectedProduct.username,
    password: "",
    cpassword: "",
    name: selectedProduct.name,
    last: selectedProduct.last,
    birthdate: selectedProduct.birthdate,
    age: selectedProduct.age,
    occupation: selectedProduct.occupation,
    company: selectedProduct.company
  });

  const [errormsg, setErrormsg] = useState(null);

  const handleSubmit = () => {
    onClose();
  };

  const Sendtobackend = () => {
    if (
      fdata.password == "" ||
      fdata.cpassword == "" ||
      fdata.name == "" ||
      fdata.last == "" ||
      fdata.birthdate == "" ||
      fdata.age == "" ||
      fdata.occupation == "" ||
      fdata.company == ""
    ) {
      setErrormsg("All fields are required");
      return;
    } else {
      if (fdata.password != fdata.cpassword) {
        setErrormsg("Password and Confirm Password must be same");
        return;
      } else {
        console.log(fdata);
        fetch(`http://${ip}:5000/updateUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(fdata)
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setErrormsg(data.error);
            } else {
              alert("User updated");
            }
          });
      }
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      
      <View style={styles.modalContainer}>
      <ScrollView>
      <KeyboardAvoidingView behavior="padding" style={styles.f}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modify the user</Text>
          <View style={formgroup}>
          <Text style={labelI}>User</Text>
              <TextInput style={inputModal}
                  value={selectedProduct.number}
                  readOnly = {true}
                  placeholderTextColor="gray"
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Email</Text>
              <TextInput style={inputModal}
                  // placeholder={selectedProduct.username}
                  value={selectedProduct.username}
                  readOnly={true}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, username: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Password</Text>
              <TextInput style={inputModal}
                  placeholder='password'
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, password: text })}
                  onPressIn={() => setErrormsg(errormsg)}
              />
              <Text style={labelI}>Confirm Password</Text>
              <TextInput style={inputModal}
                  placeholder='confirm password'
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, cpassword: text })}
                  onPressIn={() => setErrormsg(errormsg)}
              />
              <Text style={labelI}>Name</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.name}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, name: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Last name</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.last}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, last: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Birthdate</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.birthdate}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, birthdate: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Age</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.age}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, age: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Occupation</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.occupation}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, occupation: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Company</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.company}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, company: text })}
                  onPressIn={() => setErrormsg(null)}
              />
          </View>
          
          <TouchableOpacity style={styles.button} onPress={Sendtobackend}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
        </ScrollView>
      </View>
      
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 70
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2fa8f4',
    padding: 13,
    borderRadius: 20,
    marginTop: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15
  },
  f: {
    flex: 1
  }
});

export default ModalUpdateU;