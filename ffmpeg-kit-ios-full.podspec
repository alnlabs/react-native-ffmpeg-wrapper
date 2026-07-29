# Community-hosted FFmpegKit iOS binaries (official CocoaPods packages were retired).
# Consumers should reference this podspec from their Podfile, e.g.:
#   pod 'ffmpeg-kit-ios-full', :podspec => '../node_modules/react-native-ffmpeg-wrapper/ffmpeg-kit-ios-full.podspec'

Pod::Spec.new do |s|
  s.name             = 'ffmpeg-kit-ios-full'
  s.version          = '6.0'
  s.summary          = 'Self-hosted FFmpegKit for iOS'
  s.description      = 'Statically compiled FFmpegKit xcframeworks for iOS (community mirror).'
  s.homepage         = 'https://github.com/luthviar/ffmpeg-kit-ios-full'
  s.license          = { :type => 'LGPL-3.0' }
  s.author           = { 'luthviar' => 'luthviar.a@gmail.com' }

  s.platform         = :ios, '12.1'
  s.static_framework = true
  s.module_name      = 'ffmpegkit'

  s.source = {
    :http => 'https://github.com/luthviar/ffmpeg-kit-ios-full/releases/download/6.0/ffmpeg-kit-ios-full.zip'
  }

  s.vendored_frameworks = 'ffmpeg-kit-ios-full/*.xcframework'
end
