import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Icon for Back button
import { LinearGradient } from "expo-linear-gradient"; // For gradient background
import CustomText from "./CustomText"; // Custom text component for styling

const DetailsPage = ({ route, navigation }) => {
  const { item } = route.params;

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openGoogleMaps = () => {
    if (item.gmapLink) {
      Linking.openURL(item.gmapLink).catch((err) =>
        console.error("Error opening Google Maps link:", err)
      );
    } else {
      alert("Google Maps link is not available.");
    }
  };

  // Extract prayer timings as an array
  const prayerTimings = Object.entries(item.prayerTimings);

  // Create main prayer timings table (remove last 5 rows)
  const mainPrayerTimings = prayerTimings.slice(0, -5);

  // Create table for removed last 5 rows
  const removedPrayerTimings = prayerTimings.slice(-5);

  return (
    <LinearGradient
      colors={["#f1f1f1", "#c2e59c", "#f1f1f1"]}
      style={styles.gradient}
    >
      <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={28} color="#008000" />
        </TouchableOpacity>

        {/* Details Section */}
        <Animated.View
          style={[
            styles.detailsContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Title Section */}
          <CustomText style={styles.title}>{item.name}</CustomText>

          {/* Address Section */}
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Address</CustomText>
            <CustomText style={styles.detailText}>
              {item.address || "N/A"} - {item.pincode || "N/A"}
            </CustomText>
           
          </View>

          {/* Main Prayer Timings Table */}
          <View style={styles.tableContainer}>
            <CustomText style={styles.label}>Prayer Timings</CustomText>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <CustomText style={styles.tableHeaderText}>Prayer</CustomText>
              <CustomText style={styles.tableHeaderText}>Azan</CustomText>
              <CustomText style={styles.tableHeaderText}>Iqamah</CustomText>
            </View>

            {/* Table Rows */}
            {mainPrayerTimings.map(([prayer, timing]) => (
              <View key={prayer} style={styles.tableRow}>
                <CustomText style={styles.tableCell}>
                  {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                </CustomText>
                <CustomText style={styles.tableCell}>
                  {timing.azan || "N/A"}
                </CustomText>
                <CustomText style={styles.tableCell}>
                  {timing.iqamah || "N/A"}
                </CustomText>
              </View>
            ))}
          </View>

          {/* Removed Items Table */}
          <View style={styles.removedTableContainer}>
            <CustomText style={styles.label}>Special Prayer Timings</CustomText>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <CustomText style={styles.tableHeaderText}>Prayer</CustomText>
              <CustomText style={styles.tableHeaderText}>Azan</CustomText>
            </View>

            {/* Table Rows */}
            {removedPrayerTimings.map(([prayer, timing]) => (
              <View key={prayer} style={styles.tableRow}>
                <CustomText style={styles.tableCell}>
                  {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                </CustomText>
                <CustomText style={styles.tableCell}>
                  {timing.azan || "N/A"}
                </CustomText>
              </View>
            ))}
             {/* Google Maps Button */}
             <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
              <CustomText style={styles.mapButtonText}>
                Open in Google Maps
              </CustomText>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    marginTop:50,
    paddingHorizontal: 20,
    paddingBottom:20,

  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#008000",
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  mapButton: {
    marginTop: 20,
    backgroundColor: "#1b9902",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  removedTableContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008000",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  tableCell: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    textAlign: "center",
  },
});

export default DetailsPage;
