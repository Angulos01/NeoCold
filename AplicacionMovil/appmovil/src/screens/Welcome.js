import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native'
import React from 'react'
import pattern from '../../assets/pattern.png'
import penguinog from '../../assets/penguinog.png'
import welcomelogo from '../../assets/welcomelogo.png'
import { button1 } from '../common/button'

const Welcome = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image style={styles.patternbg} source={pattern} />
            <View style={styles.cont}>
            <Text> </Text> 
            <Text> </Text> 
            <View style={styles.container1}>
            <Text> </Text> 
            <Text style={styles.text}>Welcome to</Text>
            <Text> </Text> 
            <Image source={penguinog} style={styles.pic}></Image>
            <Text> </Text> 
            <Text style={{fontSize:34, fontFamily:'Arial'}}>NeoCold</Text>
            <Text style={{fontSize:16, fontFamily:'Arial'}}>Your trustworthy cold monitoring system</Text> 
            <Text> </Text> 
            <TouchableHighlight style={{borderRadius: 0}}>
                <Text style={styles.button}
                    onPress={() => navigation.navigate('login')}
                >Login</Text>
            </TouchableHighlight>
                <Text style={styles.button}
                    onPress={() => navigation.navigate('signup')}
                >Signup</Text>
            <Text> </Text> 
            <Text> </Text> 
            <Text> </Text> 
            <Text> </Text> 
            <Text> </Text> 
            </View>
            </View>
        </View>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    cont: {
        marginTop: 190,
        display: 'flex',
        backgroundColor: '#89c2e6',
        width: '90%',
        height: '60%',
        borderRadius: 30,
        padding: 20,
        marginLeft: '5%'
    },
    patternbg: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    head: {
        fontSize: 30,
        color: '#fff',
    },
    container1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    logo: {
        height: '20%',
        resizeMode: 'contain',
        marginBottom: 50,
    },
    pic: {
        width: 250,
        height: 250,
        borderRadius: 100
    },
    text: {
        fontSize: 26
    },
    button: {
        backgroundColor: '#2fa8f4',
        color: '#fff',
        padding: 10,
        borderRadius: 15,
        fontSize: 20,
        minWidth: 150,
        textAlign: 'center',
        margin: 10,
    }
})