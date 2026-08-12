import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import CustomerScreen from '../screens/CustomerScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SupplierScreen from '../screens/SupplierScreen';
import CategoryScreen from '../screens/CategoryScreen';
import PurchaseOrderScreen from '../screens/PurchaseOrderScreen';
import SalesOrderScreen from '../screens/SalesOrderScreen';
import DashBoardScreen from '../screens/DashBoardScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="SignIn">
          <Stack.Screen
          name="SignIn"
          component={SignInScreen}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
        />   
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
        />   
        <Stack.Screen
          name="CustomerScreen"
          component={CustomerScreen}
        />
        <Stack.Screen
          name="InventoryScreen"
          component={InventoryScreen}
        />
        <Stack.Screen
          name="SupplierScreen"
          component={SupplierScreen}
        />
        <Stack.Screen
          name="CategoryScreen"
          component={CategoryScreen}
        />
        <Stack.Screen
          name="PurchaseOrderScreen"
          component={PurchaseOrderScreen}
        />
        <Stack.Screen
          name="SalesOrderScreen"
          component={SalesOrderScreen}
        />
        <Stack.Screen
          name="DashBoardScreen"
          component={DashBoardScreen}
        />
        <Stack.Screen
          name="ReportScreen"
          component={ReportScreen}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
        />
        </Stack.Navigator>
    </NavigationContainer>
  );
}  