react-native-video-overlay

A lightweight and native Android-only React Native TurboModule for applying image and text overlays on videos using FFmpeg. Ideal for branding, watermarking, or offline field use cases.

⸻

📦 Installation

npm install react-native-video-overlay

or

yarn add react-native-video-overlay


⸻

🚀 Usage

Import

import {
  getPermissionStatus,
  requestPermission,
  addOverlay,
} from 'react-native-video-overlay';

Example

const status = await getPermissionStatus();
if (status === 'not-determined') {
  await requestPermission();
}

const resultPath = await addOverlay({
  inputPath: '/storage/emulated/0/DCIM/input.mp4',
  outputPath: '/storage/emulated/0/DCIM/output.mp4',
  overlays: [
    {
      type: 'text',
      text: 'ReviewDekho',
      position: 'bottom-right',
      fontSize: 24,
      fontColor: '#ffffff',
      opacity: 0.8,
    },
    {
      type: 'image',
      source: '/storage/emulated/0/logo.png',
      position: { x: 100, y: 200 },
      width: 100,
      height: 100,
    },
  ],
  onProgress: (line) => console.log('FFmpeg:', line),
});


⸻

🧩 API

getPermissionStatus(): Promise<{ status: string }>

Checks and returns media access permission status.

requestPermission(): Promise<{ status: string }>

Prompts user for media access permission if not yet granted.

addOverlay(options): Promise<string>

Applies one or more overlays (text or image) to the input video.

options

Key	Type	Description
inputPath	string	Full path to the input video file
outputPath	string	Full path for the output video file
overlays	Array<Overlay>	List of overlays to apply
onProgress	(line: string) => void	Optional callback to track FFmpeg logs

Overlay Object (Text/Image)

Key	Type	Description
type	`‘text’	‘image’`
text	string	Text to show (if type is text)
fontSize	number	Font size for text overlay
fontColor	string	Text color (hex or name)
opacity	number	0 to 1 (transparency)
fontPath	string	Custom TTF font path
position	string or {x,y}	Predefined or custom coordinates
source	string	Image path (if type is image)
width	number	Width of image overlay
height	number	Height of image overlay

Predefined positions:
	•	top-left, top-center, top-right
	•	center-left, center, center-right
	•	bottom-left, bottom-center, bottom-right

Custom: { x: number, y: number }

⸻

⚙️ Internals
	•	Built as a TurboModule
	•	Supports Android only
	•	Uses native FFmpeg compiled with NDK
	•	Streams FFmpeg logs via onProgress

⸻

🧪 Development

yarn install
yarn build # bob build


⸻

🤝 Contributing

See the CONTRIBUTING.md guide.

⸻

📄 License

MIT

⸻

Made with ❤️ by ALN Labs using create-react-native-library.