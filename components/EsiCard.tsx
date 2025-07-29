import React from 'react';
import { View, Text, Image, Pressable, Linking, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { configFile } from 'config';

interface ESICardPreviewProps {
  esiCardUrl: string;
  isValidUrl: boolean;
  isImage: boolean;
  isPdfOrOther: boolean;
}

export const EsiCard: React.FC<ESICardPreviewProps> = ({
  esiCardUrl,
  isValidUrl,
  isImage,
  isPdfOrOther,
}) => {
  const handleOpenExternal = async () => {
    try {
      const supported = await Linking.canOpenURL(esiCardUrl);
      if (supported) {
        await Linking.openURL(esiCardUrl);
      } else {
        Alert.alert('Cannot open URL', 'Invalid or unsupported URL.');
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
      Alert.alert('Error', 'Failed to open the document.');
    }
  };

  const handleDownload = async () => {
    try {
      if (!FileSystem.documentDirectory) {
        Alert.alert('Error', 'Document directory not available.');
        return;
      }

      const fileName = esiCardUrl.split('/').pop();
      if (!fileName) {
        Alert.alert('Error', 'Invalid file name.');
        return;
      }

      const fileUri = FileSystem.documentDirectory + fileName;
      const downloadResumable = FileSystem.createDownloadResumable(esiCardUrl, fileUri);
      const { uri } = await downloadResumable.downloadAsync();

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Download complete', 'File saved to: ' + uri);
      }
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download the file.');
    }
  };

  if (!isValidUrl) return null;

  return (
    <View style={{ marginTop: 10 }}>
      {isImage ? (
        <Image source={{ uri: esiCardUrl }} style={styles.image} />
      ) : isPdfOrOther ? (
        <Pressable onPress={handleOpenExternal} style={styles.openButton}>
          <Text style={styles.buttonText}>Open ESI Document</Text>
        </Pressable>
      ) : (
        <Text style={styles.errorText}>Unsupported ESI Card format</Text>
      )}

      <Pressable onPress={handleDownload} style={styles.downloadButton}>
        <Text style={styles.buttonText}>Download</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  openButton: {
    backgroundColor: configFile.colorGreen,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
