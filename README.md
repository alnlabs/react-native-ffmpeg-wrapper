# react-native-ffmpeg-wrapper

A native Android-only React Native TurboModule that wraps FFmpeg operations using Kotlin and the Android NDK. This module serves as a foundation to build powerful FFmpeg-based features like video processing, trimming, overlays, compression, and more.

> ⚠️ Currently includes a test method `multiply(a, b)` for setup validation.

---

## 📦 Installation

```bash
npm install react-native-ffmpeg-wrapper
# or
yarn add react-native-ffmpeg-wrapper
```

---

## 🚀 Usage

### Import

```ts
import { multiply } from 'react-native-ffmpeg-wrapper';
```

### Example

```ts
const result = multiply(5, 3);
console.log('Multiplication Result:', result); // Output: 15
```

---

## 🧩 API

### `multiply(a: number, b: number): number`

Returns the result of multiplying two numbers.
✅ Used for verifying native module setup.

---

## ⚙️ Internals

- ✅ Built as a **TurboModule**
- ✅ Written in **Kotlin**
- ✅ Android-only
- ⚙️ Ready to be extended with native FFmpeg support

---

## 🧪 Development

```bash
yarn install
yarn build     # uses bob
cd example
yarn android   # run sample on Android
```

---

## 📄 License

MIT

---

> Made with ❤️ by ALN Labs using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
