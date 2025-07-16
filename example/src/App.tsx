import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Button,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import VideoRecorder from './VideoRecorder';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import { runFFmpegCommand } from 'react-native-ffmpeg-wrapper';

const PROCESSED_DIR = RNFS.DocumentDirectoryPath + '/processed_videos';

function VideoListScreen({ navigation, route }: any) {
  const [videos, setVideos] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    try {
      const exists = await RNFS.exists(PROCESSED_DIR);
      if (!exists) {
        setVideos([]);
        return;
      }
      const files = await RNFS.readDir(PROCESSED_DIR);
      setVideos(files.filter((f) => f.isFile()).map((f) => f.path));
    } catch (e) {
      setVideos([]);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [route?.params?.refresh]);

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Record Video"
        onPress={() => navigation.navigate('Record')}
      />
      <FlatList
        data={videos}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            style={styles.listItem}
          >
            <Text numberOfLines={1}>{item.split('/').pop()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No videos found.
          </Text>
        }
      />
      {selected && (
        <View style={{ flex: 1 }}>
          <Video
            source={{ uri: 'file://' + selected }}
            style={{ width: '100%', height: 300 }}
            controls
            resizeMode="contain"
          />
          <Button title="Close" onPress={() => setSelected(null)} />
        </View>
      )}
    </View>
  );
}

function OverlayProcessorScreen({ navigation, route }: any) {
  const { video } = route.params || {};
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const processOverlay = async () => {
    if (!video) return;
    setProcessing(true);
    try {
      await RNFS.mkdir(PROCESSED_DIR);
      const outPath = `${PROCESSED_DIR}/video_${Date.now()}.mp4`;
      // Ensure logo.png is available in DocumentDirectoryPath
      const logoTargetPath = `${RNFS.DocumentDirectoryPath}/logo.png`;
      let logoExists = await RNFS.exists(logoTargetPath);
      if (!logoExists) {
        try {
          // On Android, copy from assets
          await RNFS.copyFileAssets('logo.png', logoTargetPath);
        } catch (copyErr) {
          throw new Error(
            'Failed to copy logo.png to app storage. Make sure logo.png is in android/app/src/main/assets.'
          );
        }
        logoExists = await RNFS.exists(logoTargetPath);
        if (!logoExists) throw new Error('logo.png not found after copy.');
      }
      // Use FFmpeg scale2ref to make logo 20% of video width, keep aspect ratio, and overlay at (10,10)
      const cmd = `-i "${video}" -i "${logoTargetPath}" -filter_complex "[1][0]scale2ref=w=iw*0.2:h=ow/mdar[logo][vid];[vid][logo]overlay=10:10" -codec:a copy "${outPath}"`;
      await runFFmpegCommand(cmd);
      setOutput(outPath);
      Alert.alert('Success', 'Logo overlay applied and video saved!');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to process video');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Overlay Processor</Text>
      <Button
        title={processing ? 'Processing...' : 'Apply Overlay & Save'}
        onPress={processOverlay}
        disabled={processing}
      />
      {output && (
        <Button
          title="Go to List"
          onPress={() => navigation.navigate('List', { refresh: Date.now() })}
        />
      )}
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name="List" component={VideoListScreen} />
        <Stack.Screen name="Record">
          {(props) => (
            <VideoRecorder
              {...props}
              onRecordingFinished={(video) =>
                props.navigation.navigate('Overlay', { video: video.path })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Overlay" component={OverlayProcessorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  listItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
});
