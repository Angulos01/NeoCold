import { useEffect, useState } from "react";
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Button, TouchableOpacity  } from 'react-native';
import { NavigationContainer ,useRoute} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons'; import { Feather } from '@expo/vector-icons'; ;
import { head1 } from '../common/formcss'
import { button1 } from '../common/button'
import Graph from '../components/Graph';
import * as Notifications from 'expo-notifications';
import Token from '../components/Token';
import penguin2 from '../../assets/penguin2.png'
import Map from '../components/Map';
import ModalUS from '../components/Modal';
import { ip } from '../common/ip'
import AddNewBox from "../components/addnewbox";



export default function Home() {
  const route = useRoute();
  const params = route.params;
  const email = params.email;
  const pass = params.password;
    return (
        <MyTabs email={email} password={pass}/>
    )
}

const Tab = createBottomTabNavigator();

function MyTabs({ email, password }) {
  return (
    <Tab.Navigator>
       <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color="#89c2e6" />
          ),
        }}
      >
        {() => <HomeScreen email={email} pass={password} />}
      </Tab.Screen>


      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{
      tabBarIcon: ({ color, size }) => (
        <AntDesign name="bells" size={size} color="orange" />
      ),
    }} />

    <Tab.Screen
            name="GPS"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="map-pin" size={size} color="#FFD700" />
              ),
            }}
          >
            {() => <GPS email={email} pass={password} />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color="#2fa8f4" />
          ),
        }}
      >
        {({ navigation }) => <ProfileScreen navigation={navigation} email={email} pass={password} />}
      </Tab.Screen>


    </Tab.Navigator>
  );
}


function HomeScreen({ email, pass }) {
  const [showAddBox, setShowAddBox] = useState(false);

  const handleShowAdd = () => {
    setShowAddBox(true);
  };

  const handleCloseAdd = () => {
    setShowAddBox(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text> </Text> 
          <Text>Welcome to</Text>
          <Image source={penguin2} style={styles.picc}></Image>
          <Text>NeoCold</Text>
          <Text>Your trustworthy cold monitoring system</Text>
        </View>
        <View>
          <AddNewBox
            email={email}
            password={pass}
            showAddBox={showAddBox}
            handleShowAdd={handleShowAdd}
            handleCloseAdd={handleCloseAdd}
          />
        </View>





        <View>
          <Graph email={email} password={pass}></Graph>
        </View>
      </ScrollView>
    </View>
  );
}

function GPS({email,pass}) {
  return (
      <Map email={email} password={pass}></Map>
  )
}

function NotificationsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.cont}>
        <View style={styles.te}>
          <Text>The temperature is high!</Text>
        </View>
      </View>
      <Text> </Text>
      <View style={styles.cont1}>
        <View style={styles.te}>
        <Text>Battery is running low!</Text>
        </View>
      </View>
      <Text> </Text>
      <View style={styles.cont2}>
        <View style={styles.te}>
        <Text>There's not enough [something]!</Text>
        </View>
      </View>
      <Text> </Text>
      <View style={styles.cont3}>
        <View style={styles.te}>
        <Text>Temperature is right again!</Text>
        </View>
      </View>
      <Text> </Text>
      <View style={styles.cont4}>
        <View style={styles.te}>
        <Text>Don't worry!</Text>
        </View>
      </View>
    </View>
  );
}

const ProfileScreen = ({ navigation, email, pass}) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text> </Text> 
          <Text style={styles.h1}> {email} profile</Text>
          <Text> </Text> 
          <Image source={penguin2} style={styles.pic}></Image>
          <Text> </Text> 
          <Text>Hello fellow NeoColdian, this is your profile</Text>
          <Text>This space was made just for you</Text>
          <Text>Take a seat</Text>
          <Text> </Text> 
          <ModalUS></ModalUS>
            <Text style={button1}
                  onPress={
                      () => { navigation.navigate('welcome') }
                  }
            >Logout</Text>
            <Text style={button1}
                  onPress={
                      () => { navigation.navigate('admin',{
                          email: email,
                          password: pass
                      })}
                  }
            >Admin</Text>
        </View>
    </View>
    
  );
}




const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navtitle: {
      display: 'flex',
      textAlign: 'left'
    },
    graph: {
      flex: 1,
      width: '90%',
      height: '90%'
    },
    pic: {
      width: 150,
      height: 150,
      borderRadius: 100
    },
    picc: {
      width: 80,
      height: 80,
      borderRadius: 100,
      marginTop: 8,
      marginBottom: 8
    },
    cont: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#91C8E4',
      borderRadius: 15
    },
    te: {
      margin: '7%, 8%, 10%, 10%'
    },
    cont1: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#749BC2',
      borderRadius: 15
    },
    cont2: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#4682A9',
      borderRadius: 15
    },
    cont3: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#4477CE',
      borderRadius: 15
    },
    cont4: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#8CABFF',
      borderRadius: 15
    },
    h1: {
        fontSize: 30,
        color: '#000',
    }
})