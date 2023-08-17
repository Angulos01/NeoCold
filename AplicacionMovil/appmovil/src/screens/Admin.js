import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image,  Modal, FlatList, Button, RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { head1, labelI } from '../common/formcss'
import { button1 } from '../common/button'
import Graph from '../components/Graph';
import * as Notifications from 'expo-notifications';
// import Token from '../components/Token';
import penguin2 from '../../assets/penguin2.png'
import Table from '../components/TableB';
import Table2 from '../components/Table2';
import InsertCU from '../components/UserCompany';
import InsertTD from '../components/TransportDriver';
import TableU from '../components/TableU'
import TableC from '../components/TableC'
import TableT from '../components/TableT'
import TableD from '../components/TableD'

const refreshPage = ({ navigation }) => {
  navigation.navigate('admin')
}

const BoxesS = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    navigation.navigate('admin')
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={styles.p}>
          <Table2></Table2>
        </View>
        <View style={styles.pnew}>
          <Table></Table>
        </View>
        </ScrollView>
    </View> 
  );
}

function UsersS() {
  // const [isLoading, setLoading] = useState(true);
  // const [data, setData] = useState([]);
  // console.log(data);

  // useEffect(() => {
  //   fetch('http://172.17.3.43:5000/optioncompany')
  //     .then((response) => response.json())
  //     .then((json) => setData(json))
  //     .catch((error) => console.error(error))
  //     .finally(() => setLoading(false));
  // }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView>
        <InsertCU></InsertCU>
        <Text> </Text>
        <Text style={styles.h1}>Users</Text>
        <TableU></TableU>
        <Text> </Text>
        <Text style={styles.h1}>Companies</Text>
        <TableC></TableC>
        <Text> </Text>
        </ScrollView>
      </View>
  );
}

function TransporS() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView>
        <InsertTD></InsertTD>
        <Text> </Text>
        <Text style={styles.h1}>Drivers</Text>
        <TableD></TableD>
        <Text> </Text>
        <Text style={styles.h1}>Transports</Text>
        <TableT></TableT>
        <Text> </Text>
        </ScrollView>
      </View>
    );
  }


  const Idkyet =  ({ navigation, email, pass}) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text> </Text> 
          <Text style={styles.h1}> {email} admin</Text>
          <Text> </Text> 
          <Image source={penguin2} style={styles.pic}></Image>
          <Text> </Text> 
          <Text>Hello fellow NeoColdian, this is your profile</Text>
          <Text>This space was made just for you</Text>
          <Text>Take a seat</Text>
          <Text> </Text> 
          <View style={{borderRadius:20}}>
            <Text style={button1}
                  onPress={
                      ({}) => { navigation.navigate('welcome') }
                  }
            >Logout</Text>
          </View>
          <View style={{borderRadius:20}}>
            <Text style={button1}
                  onPress={
                      () => { navigation.navigate('home',{
                        email: email,
                        password: pass
                      }) }
                  }
            >Logout Admin</Text>
          </View>
        </View>
    </View>
    );
}
const Tab = createBottomTabNavigator();

function MyTabs({email,password}) {
    return (
        <Tab.Navigator>
          <Tab.Screen name="Boxes" component={BoxesS} options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="archive" size={size} color="#89c2e6" />
          ),
        }} />
          <Tab.Screen name="Users & Company" component={UsersS} options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="team" size={size} color="orange" />
          ),
        }} />
          <Tab.Screen name="Transport & Drivers" component={TransporS} options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="car" size={size} color="#2fa8f4" />
          ),
        }} />
        <Tab.Screen
                name="Idkyet"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <AntDesign name="dashboard" size={size} color="#2fa8f4" />
                  ),
                }}
              >
                {({ navigation }) => <Idkyet navigation={navigation} email={email} pass={password} />}
        </Tab.Screen>
        </Tab.Navigator>
      );
}

export default function Admin() {
  return (
    <MyTabs />
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
    container2: {
      width: '100%',
      height: '20%',
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
      borderRadius: 100,
    },
    picc: {
      width: 150,
      height: 150,
      borderRadius: 100,
      paddingTop: 8,
      paddingBottom: 8
    },
    cont: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#8A9A5B',
      borderRadius: 15
    },
    te: {
      margin: '7%, 8%, 10%, 10%'
    },
    cont1: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#4F7942',
      borderRadius: 15
    },
    cont2: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#355E3B',
      borderRadius: 15
    },
    cont3: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#808000',
      borderRadius: 15
    },
    cont4: {
      width: '90%',
      height: '10%',
      display: 'flex',
      backgroundColor: '#097969',
      borderRadius: 15
    },
    h1: {
        fontSize: 30,
        color: '#000',
        paddingBottom: -10,
        marginTop: 20,
        textAlign: 'center'
    },
    p: {
      height: 180,
      alignItems: 'center'
    },
    pnew: {
      height: 180,
      alignItems: 'center',
      marginTop: -40
    },
    panother: {
      alignItems: 'center'
    },
    panother2: {
      alignItems: 'center',
      height: 400
    }
})