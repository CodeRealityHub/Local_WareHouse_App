import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert 
} from 'react-native';

import { loginUser } from '../../services/authService'; // Import the loginUser function
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Header from '../../components/common/Header';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import PasswordInput from '../../components/inputs/PasswordInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import ProjectTitle from '../../components/common/ProjectTitle';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // signIn function
  const handleLogin = async () => {
    if (!email || !password) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  try {
    const response = await loginUser({
      email: email,
      password: password,
    });

    await AsyncStorage.setItem("token", response.token);
    Alert.alert("Success", "Login Successful");
    navigation.replace("Home");

  } catch (error) {
    Alert.alert(
      "Login Failed",
      error.response?.data?.message || "Invalid credentials"
    );
  }
    console.log(email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProjectTitle />

      <Header
        title="Welcome Back 👋"
        subtitle="Sign in to continue"
      />

      <CustomTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <PasswordInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      <PrimaryButton
        title="Sign In"
        onPress={handleLogin}
      />

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signup}>
            {' '}
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 25,
  },

  forgotText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  signup: {
    color: '#2563EB',
    fontWeight: '700',
  },
});