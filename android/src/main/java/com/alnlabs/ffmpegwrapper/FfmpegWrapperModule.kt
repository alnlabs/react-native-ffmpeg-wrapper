package com.alnlabs.ffmpegwrapper

import com.arthenica.ffmpegkit.FFmpegKit
import com.arthenica.ffmpegkit.ReturnCode
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.alnlabs.ffmpegwrapper.NativeFfmpegWrapperSpec

@ReactModule(name = FfmpegWrapperModule.NAME)
class FfmpegWrapperModule(reactContext: ReactApplicationContext) : NativeFfmpegWrapperSpec(reactContext) {
    companion object {
        const val NAME = "FfmpegWrapper"
    }

    @ReactMethod
    override fun runFFmpegCommand(command: String, promise: Promise) {
        FFmpegKit.executeAsync(command) { session ->
            val returnCode = session.returnCode
            if (ReturnCode.isSuccess(returnCode)) {
                promise.resolve(true)
            } else {
                promise.reject("FFMPEG_ERROR", "FFmpeg failed with code: $returnCode")
            }
        }
    }

    override fun getName(): String = NAME
}