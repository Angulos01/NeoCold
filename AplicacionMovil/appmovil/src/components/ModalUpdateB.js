import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { ip } from "../common/ip";
import { errormessage, formgroup, head1, head2, inputModal, labelI, link, link2 } from '../common/formcss'

const ModalUpdateB = ({ visible, selectedProduct, onClose }) => {
  const [fdata, setFdata] = useState({
    key_box: selectedProduct.key_box,
    nombre: selectedProduct.nombre,
    client: selectedProduct.client,
    transports: selectedProduct.transports
  });

  const [errormsg, setErrormsg] = useState(null);

  const handleSubmit = () => {
    onClose();
  };

  const Sendtobackend = () => {
    if (
      fdata.key_box == "" ||
      fdata.nombre == "" ||
      fdata.client == "" ||
      fdata.transports == ""
    ) {
      setErrormsg("All fields are required");
      return;
    } else {
        console.log(fdata);
        fetch(`http://${ip}:5000/updateBox`, {
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
              alert("Box Updated");
            }
          });
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <ScrollView>
          <KeyboardAvoidingView behavior="padding" style={styles.f}>
            <View style={styles.modalContent}>
            <View style={formgroup}>
              <Text style={labelI}>Key Box</Text>
              <TextInput style={inputModal}
                  value={selectedProduct.key_box}
                  placeholder={selectedProduct.key_box}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, clakey_boxveTransport: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Name</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.nombre}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, nombre: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Client</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.client}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, client: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Transport</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.transports}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, transports: text })}
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
    marginTop: 250
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

export default ModalUpdateB;