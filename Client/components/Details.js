import React, { useEffect, useRef } from 'react';
import { 
  View, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, 
  Animated, Easing, TouchableOpacity, Linking 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon
import CustomText from './CustomText';

const { width, height } = Dimensions.get('window');

const DetailsPage = ({ route, navigation }) => {
  const { item } = route.params;

  if(item.images.length == 0){
    backgroundImages = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL8AAACUCAMAAAD1XwjBAAAAMFBMVEX///+/v7+7u7vq6urd3d3t7e3a2trR0dH8/PzDw8Pw8PDHx8f5+fnk5OTU1NTKyso91Qm2AAADj0lEQVR4nO2b7ZqjIAxGB/xG1Pu/23GrswoELIOv6T6b81vrQUNI0H59UdRafR4VqSr+TyH+vIg/L+LPi/jz8r/616Zhwiw3+OuM8+6m0+Iv/r9H/MW/BPEX/xLEX/xLEH/xL0H8xb8ErL+dhpVx6u9QJUH621ZvR2lVo0YA9DfL6ZjZ3iTsgfO3w/mndYcZAMy/n90dLl3f5nwG5l8pj8HkujVvnAHzn33/7AfQd931QSh/Owb+y/u//mJS6voBoPyrwfdXKi+HmkHp9vKoB/11nn+7XmG8POVj7//0+uWJy98E8a+GHH+7jf9yzqD8+y4InzlD/2tfuy+TLix/1sH9bzL0p5+TrmYwzN+O3vrbZYTP8VpluXgAuPrHuP5jxvJrj8VvuJjBwPqzVqdjhpwe51R76IvCFVn/HzlU59x9L/TS0wbaf9m6e/Vf3WUaP+OmrouyCdz/WlNVjclbeCflMCYDiK1/72ODMsoj+fDY/KvIxOyDwju5BnP520XT1f0UFE46FUBc/mt3qRcihBqibk21MUz+zevEMIT8rnkjMf+Z/PcMH2xKeLlnJzGDefz/nu09AaLqJofJ7H/SnJ3YWKjoWYuP+BrM4W9PC6xTlk6xj6Lm6Azg8Hc0TwWaIXrOjXj5xODvfjN1zAEbtGwH0Rn8vH/f+nL7AOjcs10hOoOf9yei5DWASO7ZiLYPaP/wvhGaep2fNqh7nCNifTDYvxr8AZAfXq5ZKBE9rwcQCSCsf9/5nVckx+g5FT0q3sZg/dcO0h1A30VSfCzzHzD4b7X8eQskrI7fRdNLANR/30c4NtGsl/pzoLfvoO8f92JY/wygDzfl3odeg6H7J/61ieYkA3IGA/1P+yDbE+gj5eWbLFQKBfo3zsVNorx8E6oIAvq7GX00tih6tlX6QX9v/1aNBbln/wViBuPeXxfrhhBfUeDeXxdGCwUxg597f3QH4YVg7x8R+sRWIsif3ocqJnyFDPJHRL+i2hiMf6oVLyJoYzD+mOj/g78GY/wBuX/HfwsL8feX3hvxtxIh/rjbH7yQR/hXuNsfFEEQ/xZIjffHfW0bIt8/i38J4i/+JYi/+Jcg/v++v+qQBVu6mnM2KX/r/ymIPy/iz4v48yL+vIg/L+LPi/jzIv68iD8v4s+L+PMi/ryIPy/iz4v48yL+vIg/L+LPi/jzIv68iD8vGf6t/jxy/Kv6AyH/IfkNSbFSzJuX/f8AAAAASUVORK5CYII="]
  }
  else { 
    backgroundImages = item.images;
  }
  

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const scaleAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openLink = () => {
    Linking.openURL('https://www.google.com/maps/...').catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Image Section */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollView}
      >
        {backgroundImages.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
        ))}
      </ScrollView>

      {/* Details Section */}
      <Animated.View style={[styles.detailsContainer, { opacity: fadeAnim }]}>
        <ImageBackground source={{ uri: backgroundImages[0] }} style={styles.imageBackground} blurRadius={8}>
          {/* Open & Close Time */}
          <View style={styles.timeRow}>
            <CustomText style={styles.timeText}>Open Time: {item.openTime}</CustomText>
            <CustomText style={styles.timeText}>Close Time: {item.closeTime}</CustomText>
          </View>

          {/* Service Name */}
          <CustomText style={styles.title}>{item.serviceName}</CustomText>

          {/* Address */}
          <Animated.View style={[styles.addressCard, { transform: [{ scale: scaleAnim }] }]}>
            <CustomText style={styles.label}>Address</CustomText>
            <CustomText style={styles.addressText}>{item.address}</CustomText>
            <CustomText style={styles.detailText}>{item.pincode}</CustomText>

            {/* Google Maps Button */}
            <TouchableOpacity style={styles.button} onPress={openLink}>
              <CustomText style={styles.buttonText}>Open in Google Maps</CustomText>
            </TouchableOpacity>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust based on your status bar height
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  scrollView: {
    flexGrow: 0,
  },
  image: {
    width: width,
    height: height * 0.75,
  },
  detailsContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: 'rgba(54, 54, 54, 0.9)',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  imageBackground: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  timeText: {
    fontSize: 18,
    color: 'white',
  },
  title: {
    fontSize: 29,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  addressCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginBottom: 15,
  },
  addressText: {
    fontSize: 16,
    color: '#444',
    marginTop: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  label: {
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DetailsPage;
