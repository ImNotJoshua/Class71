import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TransactionScreen from './screens/BookTransactionScreen'
import SearchScreen from './screens/SearchScreen'
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'

export default function App() {
  return (
    <View style={styles.container}>
      <AppContainer>x</AppContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabNavigator=createBottomTabNavigator({
  Transaction:{screen:TransactionScreen},
  Search:{screen:SearchScreen},
})

defaultNavigationOptions: ({navigation}) => ({
  tabBarIcon:({}) => {
    const routeName=navigation.state.routeName
    if(routeName === 'Transaction')
    {
      //return(<Image source={require('./assets/book.png')}
      //style = {{width: 40, height: 50}}></Image>)

    }else if (routeName === 'Search')
    {
      //return(<Image source={require('./assets/searchingbook.png')}
      //style = {{width: 40, height:40}}></Image>)
    }
  }
})

const AppContainer=createAppContainer(
  TabNavigator
)