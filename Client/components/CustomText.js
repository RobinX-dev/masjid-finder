// CustomText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ style, children, ...props }) => {
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Montserrat-Regular', // Apply the font globally
  },
});

export default CustomText;