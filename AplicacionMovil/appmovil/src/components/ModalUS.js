import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

const ModalUS = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 20, textAlign: 'center'}}>About Us</Text>
              <View style={styles.textStyle}>
                <Text style={{textAlign: 'center', fontSize: 17}}> We are a bussiness </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> centered completly on our </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> clients. </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> We bring security </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> to their cold containers, </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> informing them about the state </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> of their beloved products </Text>
                <Text> </Text>
              </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>About Us</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.50,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 13,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#2fa8f4',
  },
  buttonClose: {
    backgroundColor: '#2fa8f4',
  },
  textStyle: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ModalUS;