import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { ip } from "../common/ip";
import { errormessage, formgroup, head1, head2, inputModal, labelI, link, link2 } from '../common/formcss'

const ModalUpdateC = ({ visible, selectedProduct, onClose }) => {
  const [fdata, setFdata] = useState({
    id: selectedProduct.id,
    nombre: selectedProduct.nombre,
    direccion: selectedProduct.direccion,
    ciudad: selectedProduct.ciudad,
    pais: selectedProduct.pais,
    telefono: selectedProduct.telefono,
    correo_electronico: selectedProduct.correo_electronico
  });

  const [errormsg, setErrormsg] = useState(null);

  const handleSubmit = () => {
    onClose();
  };

  const Sendtobackend = () => {
    if (
      fdata.direccion == "" ||
      fdata.ciudad == "" ||
      fdata.pais == "" ||
      fdata.telefono == "" ||
      fdata.correo_electronico == ""
    ) {
      setErrormsg("All fields are required");
      return;
    } else {
        console.log(fdata);
        fetch(`http://${ip}:5000/updateCompany`, {
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
              alert("Company Updated");
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
              <Text style={labelI}>Number</Text>
              <TextInput style={inputModal}
                  value={selectedProduct.id}
                  placeholder={selectedProduct.id}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, id: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Name</Text>
              <TextInput style={inputModal}
                  value={selectedProduct.nombre}
                  placeholder={selectedProduct.nombre}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, nombre: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Address</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.direccion}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, direccion: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>City</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.ciudad}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, ciudad: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Country</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.pais}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, pais: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Telephone</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.telefono}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, telefono: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Email</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.correo_electronico}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, correo_electronico: text })}
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
    marginTop: 170
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

export default ModalUpdateC;