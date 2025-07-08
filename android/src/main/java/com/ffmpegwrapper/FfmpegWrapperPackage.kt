package com.ffmpegwrapper

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class FfmpegWrapperPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == FfmpegWrapperModule.NAME) {
      FfmpegWrapperModule(reactContext)
    } else null
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
              FfmpegWrapperModule.NAME to
                      ReactModuleInfo(
                              /* name */ FfmpegWrapperModule.NAME,
                              /* className */ FfmpegWrapperModule::class.java.name,
                              /* canOverrideExistingModule */ false,
                              /* needsEagerInit */ false,
                              /* hasConstants */ false,
                              /* isCxxModule */ false,
                              /* isTurboModule */ true
                      )
      )
    }
  }
}
