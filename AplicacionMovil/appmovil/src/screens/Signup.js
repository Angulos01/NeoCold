import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import pattern from '../../assets/pattern.png'
import penguin2 from '../../assets/penguin2.png'
import { button1 } from '../common/button'
import { errormessage, formgroup, head1, head2, input, input1, label, link, link2 } from '../common/formcss'
import { ip } from '../common/ip'

const Signup = ({
    navigation
}) => {

    const [fdata, setFdata] = useState({
        username: '',
        password: '',
        cpassword: '',
        name: '',
        last: '',
        birthdate: '',
        age: '',
        occupation: ''
    })

    const [errormsg, setErrormsg] = useState(null);

    const Sendtobackend = () => {
        // console.log(fdata);
        if (fdata.username == '' ||
            fdata.password == '' ||
            fdata.cpassword == '' ||
            fdata.name == '' ||
            fdata.last == '' ||
            fdata.birthdate == '' ||
            fdata.age == '' ||
            fdata.occupation == '') {
            setErrormsg('All fields are required');
            return;
        }
        else {
            if (fdata.password != fdata.cpassword) {
                setErrormsg('Password and Confirm Password must be same');
                return;
            }
            else {
                fetch(`http://${ip}:5000/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fdata)
                })
                .then(res => res.json()).then(
                    data => {
                        console.log(data);
                        console.log(data.udata);;
                        if (data.error === 'Invalid Credentials') {
                            alert('Invalid Credentials')
                            setErrormsg('Invalid Credentials')
                        }
                        else if (data.message === "Verification Code Sent to your Email") {
                            console.log("hi it's here")
                            console.log(data.udata);
                            console.log(data)
                            alert(data.message);
                            navigation.navigate('verification', { userdata: data.udata })
                            console.log(data.udata);
                            console.log(data)
                        }
                    }
                )
            }
        }
    }
    return (
        <View style={styles.container}>
            <Image style={styles.patternbg} source={pattern} />
            <KeyboardAvoidingView behavior="padding" style={styles.f}>
            <View style={styles.container1}>
                <View style={styles.s1}>
                </View>
                <ScrollView style={styles.s2}>
                    <Text style={head1}>Create a New Account</Text>
                    <Text style={link2}>Already Registered?&nbsp;
                        <Text style={link}
                            onPress={() => navigation.navigate('login')}
                        >
                            Login here
                        </Text>
                    </Text>
                    {
                        errormsg ? <Text style={errormessage}>{errormsg}</Text> : null
                    }
                    <View style={formgroup}>
                        <Text style={label}>Email</Text>
                        <TextInput style={input} placeholder="Enter your Email"
                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, username: text })}
                        />
                    </View>
                    <View style={formgroup}>
                        <Text style={label}>Password</Text>
                        <TextInput style={input} placeholder="Enter your Password"
                            onPressIn={() => setErrormsg(null)}
                            secureTextEntry={true}
                            onChangeText={(text) => setFdata({ ...fdata, password: text })}
                        />
                    </View>

                    <View style={formgroup}>
                        <Text style={label}>Confirm Password</Text>
                        <TextInput style={input} placeholder="Confirm your Password"
                            onPressIn={() => setErrormsg(null)}
                            secureTextEntry={true}
                            onChangeText={(text) => setFdata({ ...fdata, cpassword: text })}
                        />
                    </View>
                    <View style={formgroup}>
                        <Text style={label}>Name</Text>
                        <TextInput style={input} placeholder="Enter your Date of Birth"
                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, name: text })}
                        />
                    </View>
                    <View style={formgroup}>
                        <Text style={label}>Lastname</Text>
                        <TextInput style={input} placeholder="Enter your Date of Birth"
                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, last: text })}
                        />
                    </View>
                    <View style={formgroup}>
                        <Text style={label}>Birthdate</Text>
                        <TextInput style={input} placeholder="Enter your Date of Birth"
                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, birthdate: text })}
                        />
                    </View>
                    <View style={formgroup}>
                        <Text style={label}>Age</Text>
                        <TextInput style={input} placeholder="Enter your Date of Birth"
                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, age: text })}
                        />
                    </View>
                    <View style={formgroup}>
                        <Text style={label}>Occupation</Text>
                        <TextInput style={input} placeholder="Enter your Date of Birth"
                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, occupation: text })}
                        />
                    </View>
                    {/* <View style={formgroup}>
                        <Text style={label}>Company</Text>
                        <TextInput style={input} placeholder="Enter your Date of Birth"
                            onPressIn={() => setErrormsg(null)}
                            onChangeText={(text) => setFdata({ ...fdata, company: text })}
                        />
                    </View> */}

                    <TouchableOpacity
                        onPress={() => {
                            Sendtobackend();
                        }}
                    >
                        <Text style={button1}

                        >Signup</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default Signup

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
        height: '10%',
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
        height: '90%',
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
        backgroundColor: "#FFB0CC",
        borderRadius: 20,
        padding: 10,
    },
    fp: {
        display: 'flex',
        alignItems: 'flex-end',
        marginHorizontal: 10,
        marginVertical: 5,
    }
})