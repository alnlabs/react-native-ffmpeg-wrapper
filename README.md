# react-native-ffmpeg-wrapper

A simple React Native wrapper for running FFmpeg commands on Android and iOS using native FFmpegKit.

## Features

- Run any FFmpeg command from your React Native JS/TS code
- Supports Android and iOS (old and new architecture)
- Promise-based API

## Installation

1. **Install the package**

```sh
npm install react-native-ffmpeg-wrapper
# or
yarn add react-native-ffmpeg-wrapper
```

2. **Install FFmpegKit Native Dependency**

**Android** — add to your app's `android/app/build.gradle`:

```gradle
implementation 'com.mrljdx:ffmpeg-kit-full:6.1.3'
```

**iOS** — official FFmpegKit CocoaPods binaries were retired. Add this to your app `ios/Podfile` **before** `use_native_modules!` / `pod install`:

```ruby
pod 'ffmpeg-kit-ios-full', :podspec => '../node_modules/react-native-ffmpeg-wrapper/ffmpeg-kit-ios-full.podspec'
```

Then:

```sh
cd ios
pod install
```

3. **Link the Native Module**

If you are using React Native 0.60+, autolinking should work. Otherwise, link manually:

```sh
npx react-native link react-native-ffmpeg-wrapper
```

## Usage

```typescript
import { runFFmpegCommand } from 'react-native-ffmpeg-wrapper';

const command = '-i input.mp4 -vf scale=320:240 output.mp4';

runFFmpegCommand(command)
  .then(() => {
    // Success
  })
  .catch((err) => {
    // Handle error
  });
```

## Example

See the `example/` directory for a full React Native app demonstrating video recording, processing, and playback using this wrapper.

## Troubleshooting

- Make sure the correct FFmpegKit native library is included in your app's `build.gradle` (Android) or `Podfile` (iOS).
- If you see `'FfmpegWrapperSpec/FfmpegWrapperSpec.h' file not found`, you are on an older package build that required New Architecture. Upgrade to a version that supports both architectures, clean, and reinstall pods:
  ```sh
  cd ios
  rm -rf build Pods Podfile.lock
  pod install
  ```
- If you see errors about missing native modules, try cleaning your build and reinstalling pods:
  ```sh
  cd android && ./gradlew clean && cd ..
  cd ios && pod install --repo-update && cd ..
  ```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
