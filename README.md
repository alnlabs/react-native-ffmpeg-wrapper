# react-native-ffmpeg-wrapper

A simple React Native wrapper for running FFmpeg commands on Android and iOS using native FFmpegKit.

## Features

- Run any FFmpeg command from your React Native JS/TS code
- Supports Android (iOS support requires native implementation)
- Promise-based API

## Installation

1. **Install the package**

```sh
npm install react-native-ffmpeg-wrapper
# or
yarn add react-native-ffmpeg-wrapper
```

2. **Install FFmpegKit Native Dependency**

- For Android, add the following to your app's `android/app/build.gradle`:
  (If using ffmpeg-kit-react-native, this is managed for you. If not, add the correct FFmpegKit dependency.)

```gradle
implementation 'com.arthenica:ffmpeg-kit-full:6.0.2' # or the version matching your bridge
```

- For iOS, link the native module:

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

- Make sure the correct FFmpegKit native library is included in your app's build.gradle (Android) or Podfile (iOS).
- If you see errors about missing native modules, try cleaning your build and reinstalling pods:
  ```sh
  cd android && ./gradlew clean && cd ..
  cd ios && pod install --repo-update && cd ..
  ```
- For iOS, ensure you have implemented the native bridge in `FfmpegWrapper.mm`.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
