import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from "react-native";
import { BASE_URL } from "../environment";
import CustomText from "./CustomText";

const RegisterPage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !mobileNumber.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobileNumber, email, password }),
      });

      setIsLoading(false);

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Login");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to create account.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Registration error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/backgroundlogin.jpeg")}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.blurContainer}>
          <CustomText style={styles.title}>Create Account</CustomText>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#ddd"
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="numeric"
            placeholderTextColor="#ddd"
          />
          <TextInput
            style={styles.input}
            placeholder="Email ID or Username"
            value={email}
            onChangeText={setEmailOrUsername}
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#ddd"
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={styles.buttonText}>Create Account</CustomText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.link}
          >
            <CustomText style={styles.linkText}>Back to Login</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  blurContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 0,
    position: "absolute", // Position it at the bottom
    bottom: 20, // Adjust to control spacing from bottom
    left: "5%", // Center it horizontally
    right: "5%",
    ...Platform.select({
      web: {
        backdropFilter: "blur(10px)",
      },
    }),
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 10,
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1b9902",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: "#e35b00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#e0a89e",
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default RegisterPage;
