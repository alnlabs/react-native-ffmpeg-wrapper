package com.ffmpegwrapper

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

object FFmpegNative {
  private const val TAG = "FFMPEG_WRAPPER"
  private val IS_DEBUG = BuildConfig.DEBUG

  private var reactContext: ReactContext? = null

  init {
    try {
      System.loadLibrary("ffmpegwrapper") // ✅ Must match CMake library name
      if (IS_DEBUG) Log.d(TAG, "✅ Native library loaded successfully.")
    } catch (e: UnsatisfiedLinkError) {
      Log.e(TAG, "❌ Failed to load native library: ${e.message}", e)
    }
  }

  /**
   * Register React context to emit logs/events to JS
   */
  fun registerReactContext(context: ReactApplicationContext) {
    if (IS_DEBUG) Log.d(TAG, "📡 React context registered for FFmpeg logs.")
    reactContext = context
  }

  /**
   * Called from native C++ (JNI) to emit progress/logs to JS
   */
  @JvmStatic
  fun dispatchLogFromNative(message: String) {
    if (IS_DEBUG) Log.d(TAG, "📥 Native log: $message")
    reactContext
      ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit("ffmpeg-progress", message)
  }

  /**
   * Execute FFmpeg via string command (optional)
   */
  @JvmStatic external fun runCommand(command: String): Int

  /**
   * Execute FFmpeg via array of arguments (main method used)
   */
  @JvmStatic external fun runFFmpegCommand(command: Array<String>): Int
}