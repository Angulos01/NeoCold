import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { ip } from "../common/ip";
import { errormessage, formgroup, head1, head2, inputModal, labelI, link, link2 } from '../common/formcss'

const ModalUpdateU = ({ visible, selectedProduct, onClose }) => {
  const [fdata, setFdata] = useState({
    id: selectedProduct.id,
    name: selectedProduct.name,
    last: selectedProduct.last,
    curp: selectedProduct.curp,
    rfc: selectedProduct.rfc,
    social_service: selectedProduct.social_service,
    phone: selectedProduct.phone,
    company: selectedProduct.company
  });

  const [errormsg, setErrormsg] = useState(null);

  const handleSubmit = () => {
    onClose();
  };

  const Sendtobackend = () => {
    if (
      fdata.last == "" ||
      fdata.curp == "" ||
      fdata.rfc == "" ||
      fdata.social_service == "" ||
      fdata.phone == "" ||
      fdata.company == ""
    ) {
      setErrormsg("All fields are required");
      return;
    } else {
        console.log(fdata);
        fetch(`http://${ip}:5000/updateDriver`, {
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
              alert("Driver Updated");
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
                  value={selectedProduct.name}
                  placeholder={selectedProduct.name}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, nombre: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Last Name</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.last}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, last: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Curp</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.curp}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, curp: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>RFC</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.rfc}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, rfc: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Social Service</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.social_service}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, social_service: text })}
                  onPressIn={() => setErrormsg(null)}
              />
              <Text style={labelI}>Phone</Text>
              <TextInput style={inputModal}
                  placeholder={selectedProduct.phone}
                  placeholderTextColor="gray"
                  onChangeText={(text) => setFdata({ ...fdata, phone: text })}
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
    marginTop: 150
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