import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import type {
  VideoFile,
  CameraDevice,
  CameraPermissionStatus,
} from 'react-native-vision-camera';

export default function VideoRecorder({
  onRecordingFinished,
}: {
  onRecordingFinished?: (video: VideoFile) => void;
}) {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device: CameraDevice | undefined =
    devices.find?.((d: CameraDevice) => d.position === 'back') ?? devices[0];
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>('not-determined');
  const [microphonePermission, setMicrophonePermission] =
    useState<CameraPermissionStatus>('not-determined');
  const [isRecording, setIsRecording] = useState(false);

  const requestPermissions = async () => {
    console.log('Requesting permissions...');
    const cam = await Camera.requestCameraPermission();
    const mic = await Camera.requestMicrophonePermission();
    console.log(
      'Camera permission result:',
      cam,
      'Microphone permission result:',
      mic
    );
    setCameraPermission(cam);
    setMicrophonePermission(mic);
  };

  useEffect(() => {
    (async () => {
      const camStatus = await Camera.getCameraPermissionStatus();
      const micStatus = await Camera.getMicrophonePermissionStatus();
      setCameraPermission(camStatus);
      setMicrophonePermission(micStatus);
      // Automatically request if not granted
      if (camStatus !== 'granted' || micStatus !== 'granted') {
        requestPermissions();
      }
    })();
  }, []);

  if (cameraPermission === 'denied' || microphonePermission === 'denied') {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 16 }}>
          Camera and microphone permissions are denied. Please enable them in
          app settings.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.buttonText}>Open App Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cameraPermission !== 'granted' || microphonePermission !== 'granted') {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 16 }}>
          Camera and microphone permissions are required to record video.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No camera device found.</Text>
      </View>
    );
  }

  const startRecording = async () => {
    if (camera.current == null) return;
    setIsRecording(true);
    try {
      await camera.current.startRecording({
        onRecordingFinished: (video: VideoFile) => {
          setIsRecording(false);
          onRecordingFinished?.(video);
        },
        onRecordingError: (error: Error) => {
          setIsRecording(false);
          Alert.alert('Recording error', error.message);
        },
      });
    } catch (e: any) {
      setIsRecording(false);
      Alert.alert('Error', e.message);
    }
  };

  const stopRecording = () => {
    camera.current?.stopRecording();
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        video={true}
        audio={true}
      />
      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonStop]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 40,
  },
  buttonStop: { backgroundColor: 'gray' },
  buttonText: { color: 'white', fontSize: 18 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
