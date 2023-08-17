import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { ip } from "../common/ip";
import { errormessage, formgroup, head1, head2, inputModal, labelI, link, link2 } from '../common/formcss'

const ModalUpdateT = ({ visible, selectedProduct, onClose }) => {
  const [fdata, setFdata] = useState({
    claveTransport: selectedProduct.claveTransport,
    matriculavehi: selectedProduct.matriculavehi,
    SeguroVehiculo: selectedProduct.SeguroVehiculo,
    conductor: selectedProduct.conductor
  });11

  const [errormsg, setErrormsg] = useState(null);

  const handleSubmit = () => {
    onClose();
  };

  const Sendtobackend = () => {
    if (
      fdata.claveTransport == "" ||
      fdata.matriculavehi == "" ||
      fdata.SeguroVehiculo == "" ||
      fdata.conductor == ""
    ) {
      setErrormsg("All fields are required");
      return;
    } else {
        console.log(fdata);
        fetch(`http://${ip}:5000/updateTransport`, {
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
              alert("Vehicle Updated");
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
              <Text style={labelI}>Transport</Text>
              <TextInput style={inputModal}
                  value={selectedProduct.claveTransport}
                  placeholder={selectedProduct.claveTransport}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, claveTransport: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Vehicle Plate</Text>
              <TextInput style={inputModal}
                  value={selectedProduct.matriculavehi}
                  placeholder={selectedProduct.matriculavehi}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, matriculavehi: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Insurance</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.SeguroVehiculo}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, SeguroVehiculo: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Driver</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.conductor}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, conductor: text })}
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

export default ModalUpdateT;