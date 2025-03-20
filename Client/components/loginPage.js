import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../environment';
import CustomText from './CustomText';
import { Image } from 'react-native';

const LoginPage = ({ setIsLoggedIn, navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
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
        body: JSON.stringify({ username, password }),
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Login Successful', `Welcome, ${data.user.username}!`);
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
    <ImageBackground
      source={{uri:'https://img.freepik.com/free-photo/background-gradient-lights_23-2149304969.jpg?t=st=1742322046~exp=1742325646~hmac=af222707177f7cc424cc4ec461b74dccee5f3f6a6360cf8b07c153f1dfdce2d1&w=740'}} // Change to your image
      style={styles.imageBackground}
      resizeMode="cover"
    >  
      <View style={styles.overlay}>
        <Image
          source={{ uri: 'https://cdn-icons-gif.flaticon.com/17905/17905396.gif' }}
          style={styles.image}
        />
        {/* Blur effect using CSS-style backdropFilter */}
        <View style={styles.blurContainer}>

      
        <CustomText style={styles.title}>Login Here</CustomText>
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
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

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
            <CustomText style={styles.linkText}>Create an account</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    width: 200,  // Adjust based on your preferred size
    height: 200, // Adjust based on your preferred size
    marginBottom:250,
    borderWidth: 2, // Optional: Add a border
    borderColor: '#fff', // Optional: Border color
  },
  
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay effect
  },
  blurContainer: {
    position: 'absolute', // Make it position at the bottom
    bottom: 20, // Adjust the distance from the bottom of the screen
    width: '90%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Soft border for more effect
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 0, // Android shadow
    alignSelf: 'center', // Ensure it's centered horizontally
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)', // Only works on web
      },
    }),
  },
  
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
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
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#e35b00',
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
  },
  buttonDisabled: {
    backgroundColor: '#e0a89e',
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
