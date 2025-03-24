import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { BASE_URL } from '../environment';
import CustomText from './CustomText';

const AddServicePage = () => {
    const [name, setServiceName] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [gmapLink, setGmapLink] = useState('');

    // Prayer timings state
    const [fajar, setFajar] = useState({ azan: '', iqamah: '' });
    const [zuhar, setZuhar] = useState({ azan: '', iqamah: '' });
    const [asar, setAsar] = useState({ azan: '', iqamah: '' });
    const [magrib, setMagrib] = useState({ azan: '', iqamah: '' });
    const [isha, setIsha] = useState({ azan: '', iqamah: '' });
    const [jumuah, setJumuah] = useState({ azan: '', iqamah: '' });

    useEffect(() => {
        const getPincode = async () => {
            try {
                const pcode = await AsyncStorage.getItem('pincode');
                if (pcode) {
                    setPincode(pcode);
                }
            } catch (error) {
                console.error('Error retrieving pincode:', error);
            }
        };
        getPincode();
    }, []);

    // Submit Function
    const handleSubmit = async () => {
        if (!name || !address || !pincode || !gmapLink) {
            alert('Please fill in all fields.');
            return;
        }

        // Prepare the data to send
        const data = {
            name,
            address,
            pincode,
            gmapLink,
            prayerTimings: {
                fajar,
                zuhar,
                asar,
                magrib,
                isha,
                jumuah,
            },
        };

        try {
            const response = await fetch(`${BASE_URL}addservice`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Service added successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to add service: ${error.message}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Please try again.');
        }
    };

    // Helper function to render prayer timing inputs
    const renderPrayerTiming = (label, timing, setTiming) => {
        return (
            <View style={styles.prayerContainer}>
                <Text style={styles.prayerHeading}>{label}</Text>
                <View style={styles.timingRow}>
                    <Text style={styles.label}>Azan</Text>
                    <TextInput
                        style={[styles.input, styles.timingInput]}
                        placeholder="Azan time"
                        value={timing.azan}
                        onChangeText={(text) => setTiming({ ...timing, azan: text })}
                    />
                </View>
                <View style={styles.timingRow}>
                    <Text style={styles.label}>Iqamah</Text>
                    <TextInput
                        style={[styles.input, styles.timingInput]}
                        placeholder="Iqamah time"
                        value={timing.iqamah}
                        onChangeText={(text) => setTiming({ ...timing, iqamah: text })}
                    />
                </View>
            </View>
        );
    };

    return (
        <LinearGradient colors={['#f1f1f1', '#c2e59c', '#f1f1f1']} style={styles.gradient}>
            <SafeAreaView style={styles.safeArea}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={styles.container}>
                            <BlurView intensity={50} style={styles.blurContainer}>
                                <CustomText style={styles.title}>Add Details</CustomText>

                                {/* Mosque Name */}
                                <Text style={styles.label}>Mosque Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Service Name"
                                    value={name}
                                    onChangeText={setServiceName}
                                />

                                {/* Address */}
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Address"
                                    value={address}
                                    onChangeText={setAddress}
                                />

                                {/* Pincode */}
                                <Text style={styles.label}>Pincode</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Pincode"
                                    keyboardType="numeric"
                                    value={pincode}
                                    onChangeText={setPincode}
                                />

                                {/* Google Map Link */}
                                <Text style={styles.label}>Google Map Link</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Paste the Google map link of the place"
                                    value={gmapLink}
                                    onChangeText={setGmapLink}
                                />

                                {/* Prayer Timings */}
                                <CustomText style={styles.sectionTitle}>Prayer Timings</CustomText>

                                {/* Fajar */}
                                {renderPrayerTiming('Fajar', fajar, setFajar)}

                                {/* Zuhar */}
                                {renderPrayerTiming('Zuhar', zuhar, setZuhar)}

                                {/* Asar */}
                                {renderPrayerTiming('Asar', asar, setAsar)}

                                {/* Magrib */}
                                {renderPrayerTiming('Magrib', magrib, setMagrib)}

                                {/* Isha */}
                                {renderPrayerTiming('Isha', isha, setIsha)}

                                {/* Jumuah */}
                                {renderPrayerTiming('Jumuah', jumuah, setJumuah)}

                                {/* Submit Button */}
                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </BlurView>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    safeArea: { flex: 1 },
    container: { flexGrow: 1, padding: 20 },
    blurContainer: { padding: 20, borderRadius: 10, overflow: 'hidden' },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#000' },
    label: { fontSize: 16, fontWeight: 'bold', marginRight: 10, color: '#000', width: 100, marginTop:15 }, // Fixed width for labels
    input: { height: 40, borderColor: 'rgba(95, 95, 95, 0.2)', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff' ,marginTop:15},
    timingInput: { flex: 1 }, // Takes remaining space in the row
    timingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 }, // Aligns label and input horizontally
    prayerContainer: { marginBottom: 20 },
    prayerHeading: { fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: '#000' },
    button: { height: 50, backgroundColor: '#1b9902', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 15 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddServicePage;
