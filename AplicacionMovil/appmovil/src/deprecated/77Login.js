import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import pattern from '../../assets/pattern.png'
import penguin2 from '../../assets/penguin2.png'
import { button1 } from '../common/button'
import { errormessage, formgroup, head1, head2, input, label, link, link2 } from '../common/formcss'

const Login = ({ navigation }) => {
    const [fdata, setFdata] = useState({
        username: '',
        password: ''
    })

    const [errormsg, setErrormsg] = useState(null);

    const Sendtobackend = () => {
        // console.log(fdata);
        if (fdata.username == '' || fdata.password == '') {
            setErrormsg('All fields are required');
            return;
        }
        else {
            fetch('http://172.20.10.4:3001/signin', {
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
                            alert('logged successfully');
                            navigation.navigate('homepage');
                        }
                    }
                )
        }
    }
    return (
        <View style={styles.container}>
            <Image style={styles.patternbg} source={pattern} />

            <View style={styles.container1} >
                <View style={styles.s1}>
                    <Text> </Text>
                    <Text> </Text>
                    <Image style={styles.logo} source={penguin2} />
                    <Text> </Text>
                    <Text style={styles.h1} onPress={() => navigation.navigate('welcome')}>NeoCold</Text>
                    <Text style={styles.small1}>Helping you out with the cold</Text>
                </View>
                <View style={styles.s2}>

                    <Text style={head1}>Login</Text>
                    <Text style={head2}>Sign in to continue</Text>
                    {
                        errormsg ? <Text style={errormessage}>{errormsg}</Text> : null
                    }
                    <View style={formgroup}>
                        <Text style={label}>Email</Text>
                        <TextInput style={input}
                            placeholder="Enter your email"

                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, username: text })}
                        />
                    </View>
                    <View style={formgroup}>
                        <Text style={label}>Password</Text>
                        <TextInput style={input}
                            placeholder="Enter your password"

                            secureTextEntry={true}

                            onChangeText={(text) => setFdata({ ...fdata, password: text })}
                            onPressIn={() => setErrormsg(null)}
                        />
                    </View>
                    <View style={styles.fp}>
                        <Text style={link}>Forgot Password?</Text>
                    </View>
                    <Text style={button1}
                        onPress={() => Sendtobackend()}
                    >Login</Text>
                    <Text style={link2}>Don't have an account?&nbsp;
                        <Text style={link}
                            onPress={() => navigation.navigate('signup')}
                        >
                            Create a new account
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
    },
    patternbg: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    container1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    s1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40%',
    },
    small1: {
        color: '#000',
        fontSize: 17,
    }
    ,
    h1: {
        fontSize: 30,
        color: '#000',
    },
    s2: {
        display: 'flex',
        backgroundColor: '#89c2e6',
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    formgroup: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginVertical: 10,
    },
    label: {
        fontSize: 17,
        color: '#000',
        marginLeft: 10,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
    },
    fp: {
        display: 'flex',
        alignItems: 'flex-end',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
    }
})