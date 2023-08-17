import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import pattern from '../../assets/pattern.png'
import penguin2 from '../../assets/penguin2.png'
import { button1 } from '../common/button'
import { bwmessage, errormessage, formgroup, head1, head2, input, label, link, link2 } from '../common/formcss'

const Verification = ({ navigation, route }) => {
    const { userdata } = route.params;

    const [errormsg, setErrormsg] = useState(null);
    const [userCode, setUserCode] = useState('XXXX');
    const [actualCode, setActualCode] = useState(null);

    useEffect(() => {
        setActualCode(userdata[0]?.VerificationCode);
    }, [])

    const Sendtobackend = () => {
        // console.log(userCode);
        // console.log(actualCode);

        if (userCode == 'XXXX' || userCode == '') {
            setErrormsg('Please enter the code');
            return;
        }

        else if (userCode == actualCode) {
            // console.log('correct code');
            const fdata = {
                email: userdata[0]?.email,
                password: userdata[0]?.password,
                name: userdata[0]?.name,
                address: userdata[0]?.address,
                dob: userdata[0]?.dob,
            }

            fetch('http://192.168.1.6:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fdata)
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    if (data.message === 'User Registered Successfully') {
                        alert(data.message);
                        navigation.navigate('login')
                    }
                    else {
                        alert("Something went wrong !! Try Signing Up Again");

                    }
                })
        }
        else if (userCode != actualCode) {
            setErrormsg('Incorrect code');
            return;
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

                    <Text style={head1}>Verification</Text>
                    <Text style={bwmessage}>A Code has been sent to you on your email</Text>
                    {
                        errormsg ? <Text style={errormessage}>{errormsg}</Text> : null
                    }

                    <View style={formgroup}>
                        <Text style={label}>Code</Text>
                        <TextInput style={input}
                            placeholder="Enter 6 digit Verification Code"

                            secureTextEntry={true}

                            onChangeText={(text) => setUserCode(text)}
                            onPressIn={() => setErrormsg(null)}

                        />
                    </View>
                    <View style={styles.fp}>
                        <Text style={link}>Forgot Password?</Text>
                    </View>
                    <Text style={button1}
                        onPress={() => Sendtobackend()}
                    >Verify</Text>
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

export default Verification

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
        color: '#fff',
        fontSize: 17,
    }
    ,
    h1: {
        fontSize: 30,
        color: '#fff',
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
    },
    small1: {
        color: '#000',
        fontSize: 17,
    }
    ,
    h1: {
        fontSize: 30,
        color: '#000',
    }
})