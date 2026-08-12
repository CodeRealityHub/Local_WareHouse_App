import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import {registerUser} from '../../services/authService';
import Header from '../../components/common/Header';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import PasswordInput from '../../components/inputs/PasswordInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import ProjectTitle from '../../components/common/ProjectTitle';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');


   const handleSignUp = async () => {
    console.log('--- BUTTON PRESSED ---'); // <--- Add this line

    if (!name || !email || !role || !password || !confirmpassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmpassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      console.log('Attempting to call registerUser...'); // <--- Add this line
      const response = await registerUser({
        name,
        email,
        role,
        password,
      });

      console.log('Response received:', response); // <--- Add this line

      Alert.alert('Success', response.message || 'Registered successfully');
      
      navigation.replace('SignIn');
    } catch (error) {
      console.log('--- CATCH BLOCK HIT ---');
      console.log('Full error object:', error);

      const serverMessage = 
        error.response?.data?.message || 
        error.message || 
        'Registration failed';

      Alert.alert('Error', serverMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <ProjectTitle />

          <Header
            title="Create Account"
            subtitle="Sign up to get started"
          />

          <CustomTextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <CustomTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomTextInput
            placeholder="Role"
            value={role}
            onChangeText={setRole}
            autoCapitalize="none"
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />

          <PasswordInput
            placeholder="Confirm Password"
            value={confirmpassword}
            onChangeText={setConfirmPassword}
          />

          <PrimaryButton
            title="Create Account"
            onPress={handleSignUp}
          /> 

          <View style={styles.footer}>
            <Text>Already have an account?</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInText}>
                {' '}Sign In
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 32,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  signInText: {
    color: '#2563EB',
    fontWeight: '700',
  },
});