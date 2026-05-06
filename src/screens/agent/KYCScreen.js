import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Title, Text, Card, Button, Avatar, IconButton, Surface, Divider, Badge } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';

const KYCScreen = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([
        { id: 1, type: 'Aadhar Card', status: 'Approved', icon: 'card-account-details', image: null },
        { id: 2, type: 'PAN Card', status: 'Approved', icon: 'card-bulleted', image: null },
        { id: 3, type: 'Bank Passbook', status: 'Approved', icon: 'bank', image: null }
    ]);

    const handleUpload = (docId) => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const source = { uri: response.assets[0].uri };
                setDocuments(prev => prev.map(doc => 
                    doc.id === docId ? { ...doc, image: source.uri, status: 'Re-verification Pending' } : doc
                ));
                Alert.alert('Success', 'Document uploaded and sent for re-verification.');
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Icon size={60} icon="shield-check" style={{ backgroundColor: '#E8F5E9' }} iconColor="#4CAF50" />
                <View style={styles.headerText}>
                    <Title style={styles.title}>KYC Verification</Title>
                    <Badge style={styles.badge}>VERIFIED AGENT</Badge>
                </View>
            </View>

            <Surface style={styles.infoBox} elevation={0}>
                <IconButton icon="information" iconColor="#0F4C81" size={20} />
                <Text style={styles.infoText}>
                    Your KYC is currently approved. You can view your documents below. If you wish to update a document, upload a new clear photo.
                </Text>
            </Surface>

            <Title style={styles.sectionTitle}>Your Documents</Title>

            {documents.map((doc) => (
                <Card key={doc.id} style={styles.docCard} elevation={1}>
                    <Card.Content>
                        <View style={styles.docRow}>
                            <View style={styles.docIconBg}>
                                <MaterialCommunityIcons name={doc.icon} size={24} color="#0F4C81" />
                            </View>
                            <View style={styles.docInfo}>
                                <Text style={styles.docType}>{doc.type}</Text>
                                <Text style={[styles.docStatus, { color: doc.status === 'Approved' ? '#4CAF50' : '#F4B400' }]}>
                                    {doc.status}
                                </Text>
                            </View>
                            <Button 
                                mode="outlined" 
                                onPress={() => handleUpload(doc.id)}
                                style={styles.uploadBtn}
                                labelStyle={{ fontSize: 10 }}
                                compact
                            >
                                Update
                            </Button>
                        </View>

                        {doc.image && (
                            <View style={styles.imagePreview}>
                                <Image source={{ uri: doc.image }} style={styles.previewImg} />
                                <IconButton 
                                    icon="close-circle" 
                                    iconColor="red" 
                                    style={styles.closeIcon} 
                                    onPress={() => setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, image: null, status: 'Approved' } : d))}
                                />
                            </View>
                        )}
                    </Card.Content>
                </Card>
            ))}

            <Card style={styles.helpCard}>
                <Card.Content style={styles.helpContent}>
                    <MaterialCommunityIcons name="headset" size={32} color="white" />
                    <View style={{ marginLeft: 15, flex: 1 }}>
                        <Title style={{ color: 'white', fontSize: 16 }}>Need Help with KYC?</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Contact our compliance team for any verification issues.</Text>
                    </View>
                    <IconButton icon="chevron-right" iconColor="white" />
                </Card.Content>
            </Card>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    headerText: { marginLeft: 15 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    badge: { backgroundColor: '#4CAF50', alignSelf: 'flex-start', marginTop: 4 },
    infoBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#E3F2FD', 
        padding: 10, 
        borderRadius: 12, 
        marginBottom: 25 
    },
    infoText: { flex: 1, fontSize: 11, color: '#0F4C81', lineHeight: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    docCard: { backgroundColor: 'white', borderRadius: 15, marginBottom: 15 },
    docRow: { flexDirection: 'row', alignItems: 'center' },
    docIconBg: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center' },
    docInfo: { flex: 1, marginLeft: 15 },
    docType: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    docStatus: { fontSize: 11, marginTop: 2, fontWeight: '500' },
    uploadBtn: { borderRadius: 8, borderColor: '#0F4C81' },
    imagePreview: { marginTop: 15, borderRadius: 10, overflow: 'hidden', position: 'relative' },
    previewImg: { width: '100%', height: 150, backgroundColor: '#EEE' },
    closeIcon: { position: 'absolute', top: 0, right: 0 },
    helpCard: { backgroundColor: '#0F4C81', borderRadius: 20, marginTop: 10 },
    helpContent: { flexDirection: 'row', alignItems: 'center', padding: 15 }
});

export default KYCScreen;
