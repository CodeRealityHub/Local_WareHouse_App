import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

const PasswordInput = ({
  value,
  onChangeText,
  placeholder = 'Password',
}) => {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setSecure(!secure)}>
        <Text style={styles.toggle}>
          {secure ? 'Show' : 'Hide'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  toggle: {
    color: '#2563EB',
    fontWeight: '600',
  },
});