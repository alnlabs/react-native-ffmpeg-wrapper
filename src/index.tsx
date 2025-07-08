import { NativeEventEmitter, NativeModules } from 'react-native';
import NativeFfmpegWrapper from './NativeFfmpegWrapper';
import type { Overlay, AddOverlayParams } from './NativeFfmpegWrapper';

const emitter = new NativeEventEmitter(NativeModules.FfmpegWrapper);

/**
 * Add overlay(s) to a video using FFmpeg.
 */
export const addOverlay = NativeFfmpegWrapper.addOverlay;

/**
 * Subscribe to FFmpeg log/progress messages.
 * @param callback Function called with log line or progress message
 * @returns Function to unsubscribe
 */
export const subscribeToProgress = (
  callback: (message: string) => void
): (() => void) => {
  const subscription = emitter.addListener('ffmpeg-progress', callback);
  return () => subscription.remove();
};

// Re-export types
export type { Overlay, AddOverlayParams };

// Default export for convenience
export default {
  addOverlay,
  subscribeToProgress,
};
