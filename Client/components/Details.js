import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
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

  return (
    <LinearGradient
      colors={["#f1f1f1", "#c2e59c", "#f1f1f1"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Page Title */}
        <CustomText style={styles.pageTitle}>Mosque Details</CustomText>

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
          {/* Service Name */}
          <CustomText style={styles.title}>{item.serviceName}</CustomText>

          {/* Address Section */}
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Address</CustomText>
            <CustomText style={styles.detailText}>
              {item.name || "N/A"}
            </CustomText>
            <CustomText style={styles.detailText}>
              {item.address || "N/A"}
            </CustomText>
            <CustomText style={styles.detailText}>
              Pincode: {item.pincode || "N/A"}
            </CustomText>

            {/* Google Maps Button */}
            <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
              <CustomText style={styles.mapButtonText}>
                Open in Google Maps
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Prayer Timings Table */}
          <View style={styles.tableContainer}>
            <CustomText style={styles.label}>Prayer Timings</CustomText>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <CustomText style={styles.tableHeaderText}>Prayer</CustomText>
              <CustomText style={styles.tableHeaderText}>Azan</CustomText>
              <CustomText style={styles.tableHeaderText}>Iqamah</CustomText>
            </View>

            {/* Table Rows */}
            {Object.entries(item.prayerTimings).map(([prayer, timing]) => (
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
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000", // Black color
    textAlign: "center",
    marginBottom: 30,
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
    color: "#333",
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
