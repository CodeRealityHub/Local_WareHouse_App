import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Header = ({title, subtitle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    marginTop: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
  },
});