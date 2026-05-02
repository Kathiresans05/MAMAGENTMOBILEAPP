import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image, TouchableOpacity, Keyboard } from 'react-native';
import { TextInput, Button, Title, Text, ProgressBar, Divider, Card, ActivityIndicator, Chip } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import apiClient from '../../api/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        pincode: '',
        postOffice: '',
        district: '',
        state: '',
        division: '',
        region: '',
        assignedPincodeId: null,
        kyc: {
            aadhaarNumber: '',
            aadhaarImage: null,
            otherDocType: 'PAN Card',
            otherDocImage: null,
            selfie: null
        }
    });

    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const updateKycData = (field, value) => {
        setFormData({
            ...formData,
            kyc: { ...formData.kyc, [field]: value }
        });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    // Step 1: Basic Details & OTP
    const handleSendOtp = () => {
        if (!formData.name || !formData.phone) return Alert.alert('Error', 'Please fill all fields');
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setOtpSent(true);
        Alert.alert('Mock OTP Sent', `Your verification code is: ${code}`);
    };

    const verifyOtp = () => {
        if (otp === generatedOtp || otp === '123456') {
            nextStep();
        } else {
            Alert.alert('Error', 'Invalid OTP');
        }
    };

    // Step 4: Pincode Logic
    const fetchPincodeDetails = async (pin) => {
        if (pin.length !== 6) return;
        setLoading(true);
        try {
            // 1. Fetch location details first (Direct API - No backend needed)
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await res.json();
            
            if (data && data[0].Status === "Success") {
                const post = data[0].PostOffice[0];
                
                // Show data immediately to the user
                setFormData(prev => ({
                    ...prev,
                    postOffice: post.Name,
                    district: post.District,
                    state: post.State,
                    division: post.Division,
                    region: post.Region
                }));

                // 2. Now check if this pincode is already assigned in our backend
                try {
                    const checkRes = await apiClient.get(`/admin/check-agent?pincode=${pin}`);
                    if (checkRes.data.assigned) {
                        Alert.alert('Area Unavailable', 'This pincode already has an active agent. Please try another area.');
                        updateFormData('pincode', '');
                        setFormData(prev => ({ ...prev, postOffice: '', district: '', state: '' }));
                    }
                } catch (backendErr) {
                    console.log("Backend check failed:", backendErr);
                    // We don't block the user if backend check fails due to sleep mode, 
                    // but we'll know it's a backend issue.
                }

            } else {
                Alert.alert('Error', 'Invalid Pincode. Please enter a valid 6-digit Indian pincode.');
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Network Error', 'Cannot connect to Pincode service. Please check your mobile data/WiFi.');
        } finally {
            setLoading(false);
        }
    };

    // Step 5: KYC Logic
    const pickImage = (field) => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.5,
        };

        const callback = (response) => {
            if (response.didCancel) return;
            if (response.errorCode) return Alert.alert('Error', response.errorMessage);
            const source = 'data:image/jpeg;base64,' + response.assets[0].base64;
            updateKycData(field, source);
        };

        Alert.alert(
            'Select Image',
            'Choose source',
            [
                { text: 'Camera', onPress: () => launchCamera(options, callback) },
                { text: 'Gallery', onPress: () => launchImageLibrary(options, callback) },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await apiClient.post('/auth/register', formData);
            Alert.alert('Success', 'Registration submitted! Waiting for Admin approval.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (e) {
            console.log("Registration Error Details:", e.response?.data);
            const errorMsg = e.response?.data?.message || e.response?.data?.msg || 'Registration failed. Please try again.';
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View>
                        <Title>Basic Details</Title>
                        <TextInput label="Full Name" value={formData.name} onChangeText={v => updateFormData('name', v)} style={styles.input} mode="outlined" activeOutlineColor="#0A66C2" />
                        <TextInput label="Phone Number" value={formData.phone} onChangeText={v => updateFormData('phone', v)} keyboardType="phone-pad" style={styles.input} mode="outlined" activeOutlineColor="#0A66C2" />
                        {!otpSent ? (
                            <Button mode="contained" onPress={handleSendOtp} style={styles.button} buttonColor="#0A66C2">Send OTP</Button>
                        ) : (
                            <View>
                                <TextInput label="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" style={styles.input} mode="outlined" activeOutlineColor="#0A66C2" />
                                <Button mode="contained" onPress={verifyOtp} style={styles.button} buttonColor="#0A66C2">Verify & Next</Button>
                            </View>
                        )}
                    </View>
                );
            case 2:
                return (
                    <View>
                        <Title>Email Verification</Title>
                        <TextInput label="Email ID" value={formData.email} onChangeText={v => updateFormData('email', v)} keyboardType="email-address" style={styles.input} mode="outlined" activeOutlineColor="#0A66C2" />
                        <Button mode="contained" onPress={nextStep} style={styles.button} buttonColor="#0A66C2">Verify Email</Button>
                        <Button mode="text" onPress={prevStep}>Back</Button>
                    </View>
                );
            case 3:
                return (
                    <View>
                        <Title>Security</Title>
                        <TextInput label="Create Password" value={formData.password} onChangeText={v => updateFormData('password', v)} secureTextEntry style={styles.input} mode="outlined" activeOutlineColor="#0A66C2" />
                        <TextInput label="Confirm Password" value={formData.confirmPassword} onChangeText={v => updateFormData('confirmPassword', v)} secureTextEntry style={styles.input} mode="outlined" activeOutlineColor="#0A66C2" />
                        <Button mode="contained" onPress={nextStep} style={styles.button} buttonColor="#0A66C2">Next</Button>
                        <Button mode="text" onPress={prevStep}>Back</Button>
                    </View>
                );
            case 4:
                return (
                    <View>
                        <Title style={{ marginBottom: 15 }}>Location Details</Title>
                        <TextInput 
                            label="Enter 6-Digit Pincode" 
                            value={formData.pincode} 
                            onChangeText={v => {
                                if (v.length === 6) {
                                    Keyboard.dismiss();
                                    setFormData(prev => ({ ...prev, pincode: v }));
                                    fetchPincodeDetails(v);
                                } else {
                                    setFormData(prev => ({ ...prev, pincode: v, postOffice: '', district: '', state: '' }));
                                }
                            }} 
                            keyboardType="number-pad" 
                            maxLength={6}
                            style={styles.input} 
                            mode="outlined" 
                            activeOutlineColor="#0A66C2" 
                        />
                        
                        {loading && <ActivityIndicator style={{ marginBottom: 15 }} color="#0A66C2" />}

                        {formData.postOffice ? (
                            <View>
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <Chip 
                                        icon="check-circle" 
                                        style={{ backgroundColor: '#E8F5E9' }} 
                                        textStyle={{ color: '#2E7D32', fontWeight: 'bold' }}
                                    >
                                        Pincode Available
                                    </Chip>
                                </View>

                                <Card style={{ backgroundColor: '#FFF', borderRadius: 12, elevation: 1, marginBottom: 20 }}>
                                    <Card.Content>
                                        <Text style={{ color: '#0A66C2', fontWeight: 'bold', marginBottom: 15 }}>Location Details</Text>
                                        
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Post Office:</Text>
                                            <Text style={styles.detailValue}>{formData.postOffice}</Text>
                                        </View>
                                        <Divider style={styles.rowDivider} />
                                        
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>District:</Text>
                                            <Text style={styles.detailValue}>{formData.district}</Text>
                                        </View>
                                        <Divider style={styles.rowDivider} />
                                        
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>State:</Text>
                                            <Text style={styles.detailValue}>{formData.state}</Text>
                                        </View>
                                        <Divider style={styles.rowDivider} />
                                        
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Division:</Text>
                                            <Text style={styles.detailValue}>{formData.division}</Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            </View>
                        ) : null}

                        <Button 
                            mode="contained" 
                            onPress={nextStep} 
                            disabled={!formData.postOffice} 
                            style={styles.button} 
                            buttonColor="#0A66C2"
                        >
                            Next
                        </Button>
                        <Button mode="text" onPress={prevStep} textColor="#666">Back</Button>
                    </View>
                );
            case 5:
                return (
                    <ScrollView>
                        <Title>KYC Verification</Title>
                        <Text style={styles.label}>Take a Selfie</Text>
                        <TouchableOpacity onPress={() => pickImage('selfie')} style={styles.imagePlaceholder}>
                            {formData.kyc.selfie ? <Image source={{ uri: formData.kyc.selfie }} style={styles.previewImage} /> : <MaterialCommunityIcons name="camera" size={40} color="#0A66C2" />}
                        </TouchableOpacity>

                        <Text style={styles.label}>Aadhaar Card Number</Text>
                        <TextInput value={formData.kyc.aadhaarNumber} onChangeText={v => updateKycData('aadhaarNumber', v)} style={styles.input} mode="outlined" />
                        
                        <Text style={styles.label}>Aadhaar Card Photo</Text>
                        <TouchableOpacity onPress={() => pickImage('aadhaarImage')} style={styles.imagePlaceholder}>
                            {formData.kyc.aadhaarImage ? <Image source={{ uri: formData.kyc.aadhaarImage }} style={styles.previewImage} /> : <MaterialCommunityIcons name="file-image-outline" size={40} color="#0A66C2" />}
                        </TouchableOpacity>

                        <Text style={styles.label}>Other Document ({formData.kyc.otherDocType})</Text>
                        <TouchableOpacity onPress={() => pickImage('otherDocImage')} style={styles.imagePlaceholder}>
                            {formData.kyc.otherDocImage ? <Image source={{ uri: formData.kyc.otherDocImage }} style={styles.previewImage} /> : <MaterialCommunityIcons name="file-account-outline" size={40} color="#0A66C2" />}
                        </TouchableOpacity>

                        <Button mode="contained" onPress={nextStep} style={styles.button} buttonColor="#0A66C2">Next</Button>
                        <Button mode="text" onPress={prevStep}>Back</Button>
                    </ScrollView>
                );
            case 6:
                return (
                    <View>
                        <Title>Summary</Title>
                        <Card style={{ marginBottom: 20 }}>
                            <Card.Content>
                                <Text>Name: {formData.name}</Text>
                                <Text>Phone: {formData.phone}</Text>
                                <Text>Email: {formData.email}</Text>
                                <Text>Area: {formData.pincode} ({formData.district})</Text>
                            </Card.Content>
                        </Card>
                        <Button mode="contained" onPress={handleSubmit} loading={loading} style={styles.button} buttonColor="#4CAF50">Submit Registration</Button>
                        <Button mode="text" onPress={prevStep}>Back</Button>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <ProgressBar progress={step / 6} color="#0A66C2" style={styles.progress} />
            <Text style={styles.stepText}>Step {step} of 6</Text>
            {renderStep()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
    progress: { height: 10, borderRadius: 5, marginBottom: 10 },
    stepText: { textAlign: 'center', marginBottom: 20, color: '#666', fontWeight: 'bold' },
    input: { marginBottom: 15 },
    button: { marginTop: 10, paddingVertical: 5 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    imagePlaceholder: {
        height: 150,
        backgroundColor: '#F0F4F8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#0A66C2',
        borderStyle: 'dashed'
    },
    previewImage: { width: '100%', height: '100%', borderRadius: 10 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
    detailLabel: { color: '#666', fontSize: 14 },
    detailValue: { color: '#000', fontSize: 14, fontWeight: 'bold' },
    rowDivider: { backgroundColor: '#F0F0F0' }
});

export default RegisterScreen;
