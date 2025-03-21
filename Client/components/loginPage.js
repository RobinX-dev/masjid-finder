import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../environment';
import CustomText from './CustomText';
// import LinearGradient from 'react-native-linear-gradient';

const LoginPage = ({ setIsLoggedIn, navigation }) => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Username and password cannot be empty.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Login Successful', `Welcome!`);
        await AsyncStorage.setItem('isLoggedin', 'true');
        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Invalid credentials.');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    // <linearGradient>
        <ImageBackground
         source={require('../assets/backgroundlogin.jpeg')}
         style={styles.imageBackground}
           resizeMode="cover"
         >
      <View style={styles.overlay}>
        <View style={styles.blurContainer}>
          <CustomText style={styles.title}>Login Here</CustomText>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={email}
            onChangeText={setUsername}
            placeholderTextColor="#ddd"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#ddd"
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={styles.buttonText}>Log In</CustomText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.link}
          >
            <CustomText style={styles.linkText}>Create an account</CustomText>
          </TouchableOpacity>
        </View>
      </View>
      // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#c2e59c', // Dark overlay effect
  },
  blurContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'bottom',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Soft border effect
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5, // Android shadow
    position: 'absolute', // Position it at the bottom
    bottom: 20, // Adjust to control spacing from bottom
    left: '5%', // Center it horizontally
    right: '5%',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)', // Only works on web
      },
    }),
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    // fontFamily: 'Poppins-bold', // Poppins Font
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight transparency
    marginVertical: 10,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    // fontFamily: 'Poppins-Regular', // Poppins Font
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1b9902', // Primary theme color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#e35b00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'Poppins-Bold', // Poppins Font
  },
  buttonDisabled: {
    backgroundColor: '#e0a89e',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
    // fontFamily: 'Poppins-Regular', // Poppins Font
  },
});

export default LoginPage;
