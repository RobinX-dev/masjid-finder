import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  StatusBar,
  RefreshControl,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { BASE_URL } from '../environment';
import CustomText from './CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';  // SafeAreaView from safe-area-context

const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pincode, setPincode] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);

  const serviceTypes = ['Religious', 'Hotel', 'Hospital'];

  const fetchUserLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to find services near you.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const pincode = await fetchPincodeFromCoordinates(latitude, longitude);
          if (pincode) {
            setPincode(pincode);
          } else {
            Alert.alert('Error', 'Unable to fetch pincode from your location.');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          Alert.alert('Error', 'Unable to fetch your location.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch your location.');
    }
  };

  const fetchPincodeFromCoordinates = async (latitude, longitude) => {
    const API_KEY = 'YOUR_OPENCAGE_API_KEY'; // Replace with your API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results[0].components.postcode;
      return results;
    } catch (error) {
      console.error('Error fetching pincode:', error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}servicedetails`);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserLocation();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = async () => {
    if (!pincode) {
      Alert.alert('Missing Information', 'Please enter both a pincode and select a service type.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}getservice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode }),
      });

      const responseData = await response.json();
      setData(responseData.filteredServices);
    } catch (error) {
      console.error('Error during handleSearch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e35b00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <CustomText style={styles.errorText}>Error: {error}</CustomText>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f1f1f1', '#c2e59c', '#f1f1f1']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}> {/* Wrap the entire layout */}
        <StatusBar barStyle="dark-content" />
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <CustomText style={styles.title}>Explore Services</CustomText>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <CustomText style={styles.searchButtonText}>Search</CustomText>
          </TouchableOpacity>

          <FlatList
            data={data}
            keyExtractor={(item) => item._id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('Detailspage', { item })}>
                <View style={styles.card}>
                  <CustomText style={styles.cardTitle}>{item.name}</CustomText>
                  <CustomText style={styles.cardSubtitle}>Pincode: {item.pincode}</CustomText>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 26,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#1b9902',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Home;
