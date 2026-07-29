require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "FfmpegWrapper"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/alnlabs/react-native-ffmpeg-wrapper.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp}"
  s.private_header_files = "ios/**/*.h"

  # Official ffmpeg-kit CocoaPods packages were retired. Point your app Podfile at
  # this package's ffmpeg-kit-ios-full.podspec (community mirror) so this resolves.
  s.dependency "ffmpeg-kit-ios-full", "6.0"

  install_modules_dependencies(s)
end

