import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

const ModalT = () => {
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
            <Text style={{textAlign: 'center', fontSize: 20}}>The Team</Text>
            <Text> </Text>
              <View style={styles.textStyle}>
                <Text style={{textAlign: 'center', fontSize: 17}}> Erick Moises Diaz Azuara </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> IoT Developer </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> Angel Galvez Silvas </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> Web Developer </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}>  </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> Esmeralda García Barrón </Text>
                <Text style={{textAlign: 'center', fontSize: 17}}> Mobile Developer </Text>
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
        <Text style={styles.textStyle}>About The Team</Text>
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

export default ModalT;