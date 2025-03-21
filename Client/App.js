import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert, StatusBar, SafeAreaView, View, ActivityIndicator, StyleSheet } from 'react-native';
import LoginPage from './components/loginPage';
import AddServicePage from './components/addService';
import Home from './components/home';
import RegisterPage from './components/registerpage';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import DetailsPage from './components/Details';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define theme colors for consistency
const theme = {
  primary: '#e35b00',
  secondary: '#007bff',
  background: '#ebebeb',
  text: '#333',
  button: '#e35b00',
  inactive: 'gray',
  fontFamily: 'Montserrat-Regular',
};

// 🔹 Logged-in Tabs (Pass handleLogout)
const LoggedInTabs = ({ handleLogout }) => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = route.name === 'Home' ? 'home' :
                       route.name === 'Add Service' ? 'add-circle' :
                       'log-out';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.inactive,
      tabBarStyle: { backgroundColor: theme.background, borderTopWidth: 0 },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Add Service" component={AddServicePage} />
    <Tab.Screen
      name="Logout"
      component={View} // Placeholder component
      listeners={{
        tabPress: (e) => {
          e.preventDefault();
          handleLogout(); // Correctly passed now
        },
      }}
    />
  </Tab.Navigator>
);

// 🔹 Logged-out Stack (For Login/Register)
const LoggedOutStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator>
    <Stack.Screen name="Login" options={{ headerShown: false }} >
      {(props) => <LoginPage {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }}  />
  </Stack.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Google Fonts
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Comfortaa': require('./assets/fonts/Comfortaa-VariableFont_wght.ttf'),
    'Poppins':require('./assets/fonts/Poppins-Light.ttf'),
    });

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('isLoggedin');
        console.log('isLoggedIn value:', value);
        setIsLoggedIn(value === 'true');
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('isLoggedin');
              setIsLoggedIn(false);
            } catch (error) {
              console.error('Error removing from AsyncStorage:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading || !fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Set status bar to be transparent and light mode */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />

      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen
              name="Main"
              options={{ headerShown: false }}
            >
              {(props) => <LoggedInTabs {...props} handleLogout={handleLogout} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen
              name="Auth"
              options={{ headerShown: false }}
            >
              {(props) => <LoggedOutStack {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
          )}
          {/* Shared Screens */}
          <Stack.Screen 
            name="Detailspage" 
            component={DetailsPage} 
            options={{ headerShown: false }} // Hides the header for this screen
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
});

export default App;
