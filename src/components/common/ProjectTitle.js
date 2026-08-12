import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ProjectTitle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦🚚 Local WareHouse</Text>
      <Text style={styles.tagline}>
          A supermarket that already has products on its shelves.
      </Text>
    </View>
  );
};

export default ProjectTitle;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
});