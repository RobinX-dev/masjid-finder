import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    StatusBar,
    Image,
    FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { BASE_URL } from '../environment';
import * as ImageManipulator from 'expo-image-manipulator';
import CustomText from './CustomText';

const AddServicePage = () => {
    const [name, setServiceName] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [gmapLink, setGmapLink] = useState('');
    // const [images, setImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const serviceTypes = ['religious', 'hotel', 'hospital'];

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

    // Image Picker Function
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 3],
            quality: 1,
            allowsMultipleSelection: true, // Allow multiple image selection
        });
    
        if (!result.canceled) {
            const base64Images = await Promise.all(
                result.assets.map(async (asset) => {
                    let compressedImage = asset.uri;
                    let base64;
                    let quality = 0.5; // Start with 50% quality
    
                    // Iteratively compress the image until it's below a certain size
                    while (true) {
                        // Resize and compress the image
                        const manipulatedImage = await ImageManipulator.manipulateAsync(
                            compressedImage, // Use the compressed image URI
                            [
                                { resize: { width: 400, height: 300 } }, // Resize to 400x300
                            ],
                            { compress: quality, format: ImageManipulator.SaveFormat.JPEG } // Compress with current quality
                        );
    
                        // Convert the manipulated image to base64
                        const response = await fetch(manipulatedImage.uri);
                        const blob = await response.blob();
                        base64 = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
    
                        // Check the size of the base64 string
                        const sizeInBytes = (base64.length * (3 / 4)); // Approximate size in bytes
                        const sizeInKB = sizeInBytes / 1024; // Convert to KB
    
                        if (sizeInKB < 10) {
                            break; // Exit the loop if the image is below 10 KB
                        } else {
                            quality -= 0.1; // Reduce quality by 10% and try again
                            if (quality < 0.1) {
                                // If quality drops below 10%, stop and use the smallest possible size
                                break;
                            }
                        }
                    }
    
                    return base64;
                })
            );
    
            // Append new images to the existing images array
            setImages((prevImages) => [...prevImages, ...base64Images]);
        }
    };

    // Submit Function
    const handleSubmit = async () => {
        if ( !name || !address || !pincode || !gmapLink) {
            alert('Please fill in all fields and select at least one image.');
            return;
        }
    
        // Prepare the data to send
        const data = {
            name,
            address,
            pincode,
            gmapLink,
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
    

    return (
        <LinearGradient colors={['#f1f1f1', '#c2e59c', '#f1f1f1']} style={styles.gradient}>
            <SafeAreaView style={styles.safeArea}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={styles.container}>
                            <BlurView intensity={50} style={styles.blurContainer}>
                                <CustomText style={styles.title}>Add Service</CustomText>

                                {/* Other Inputs */}
                                <CustomText style={styles.label}>Mosque Name</CustomText>
                                <TextInput style={styles.input} placeholder="Enter Service Name" value={name} onChangeText={setServiceName} />

                                <CustomText style={styles.label}>Address</CustomText>
                                <TextInput style={styles.input} placeholder="Enter Address" value={address} onChangeText={setAddress} />

                                <CustomText style={styles.label}>Pincode</CustomText>
                                <TextInput style={styles.input} placeholder="Enter Pincode" keyboardType="numeric" value={pincode} onChangeText={setPincode} />

                                <CustomText style={styles.label}>Google Map Link</CustomText>
                                <TextInput style={styles.input} placeholder="Paste the Google map link of the place" value={gmapLink} onChangeText={setGmapLink} />

                                {/* Image Picker */}
                                {/* <Text style={styles.label}>Upload Images</Text>
                                <TouchableOpacity style={styles.button} onPress={pickImage}>
                                    <Text style={styles.buttonText}>Choose Images</Text>
                                </TouchableOpacity> */}

                                {/* Display Selected Images */}
                                {/* <FlatList
                                    data={images}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal
                                    renderItem={({ item }) => (
                                        <Image source={{ uri: item }} style={styles.image} />
                                    )}
                                    contentContainerStyle={styles.imageList}
                                /> */}

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
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#000' },
    input: { height: 50, borderColor: '#000', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 10, backgroundColor: '#fff' },
    button: { height: 50, backgroundColor: '#1b9902', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 15 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    image: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
    imageList: { marginTop: 10 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
    modalOption: { padding: 10 },
    modalText: { fontSize: 16 },
    modalCancel: { marginTop: 10, padding: 10, alignItems: 'center' },
    modalCancelText: { color: 'red', fontWeight: 'bold' },
});

export default AddServicePage;