package com.ffmpegwrapper

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = FfmpegWrapperModule.NAME)
class FfmpegWrapperModule(private val context: ReactApplicationContext) :
        NativeFfmpegWrapperSpec(context) {

  companion object {
    const val NAME = "FfmpegWrapper"
    private const val LOG_TAG = "FFMPEG_WRAPPER"
    private val IS_DEBUG = BuildConfig.DEBUG
  }

  override fun getName(): String = NAME

  override fun addOverlay(params: ReadableMap, promise: Promise) {
    try {
      val inputPath =
              params.getString("inputPath") ?: throw IllegalArgumentException("Missing inputPath")
      val outputPath =
              params.getString("outputPath") ?: throw IllegalArgumentException("Missing outputPath")
      val overlays =
              params.getArray("overlays") ?: throw IllegalArgumentException("Missing overlays")

      if (IS_DEBUG) {
        Log.d(
                LOG_TAG,
                "🔧 addOverlay: input=$inputPath, output=$outputPath, overlays=${overlays.size()}"
        )
      }

      val commandList = FFmpegCommandBuilder.build(inputPath, outputPath, overlays)

      if (IS_DEBUG) {
        Log.d(LOG_TAG, "📜 FFmpeg command: ${commandList.joinToString(" ")}")
      }

      // Register JS context so logs from native can reach JS
      FFmpegNative.registerReactContext(context)

      val result = FFmpegNative.runFFmpegCommand(commandList.toTypedArray())

      if (IS_DEBUG) {
        Log.d(LOG_TAG, "✅ FFmpeg execution result: $result")
      }

      if (result == 0) {
        promise.resolve(outputPath)
      } else {
        promise.reject("FFMPEG_FAILED", "FFmpeg exited with code $result")
      }
    } catch (e: Exception) {
      Log.e(LOG_TAG, "❌ addOverlay failed: ${e.message}", e)
      promise.reject("ADD_OVERLAY_ERROR", e.message, e)
    }
  }
}
