import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  Camera,
  useCameraDevices,
  VideoFile,
} from 'react-native-vision-camera';

export default function VideoRecorder({
  onRecordingFinished,
}: {
  onRecordingFinished?: (video: VideoFile) => void;
}) {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      const audio = await Camera.requestMicrophonePermission();
      setHasPermission(status === 'authorized' && audio === 'authorized');
    })();
  }, []);

  const startRecording = async () => {
    if (camera.current == null) return;
    setIsRecording(true);
    try {
      const video = await camera.current.startRecording({
        onRecordingFinished: (video) => {
          setIsRecording(false);
          onRecordingFinished?.(video);
        },
        onRecordingError: (error) => {
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

  if (device == null || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
