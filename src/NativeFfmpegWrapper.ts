import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | { x: number; y: number };

export type Overlay = {
  type: 'text' | 'image';
  position?: Position;
  opacity?: number;

  // Text-specific
  text?: string;
  fontSize?: number;
  fontColor?: string;
  fontPath?: string;

  // Image-specific
  source?: string;
  width?: number;
  height?: number;
};

export interface AddOverlayParams {
  inputPath: string;
  outputPath: string;
  overlays: Overlay[];
}

export interface Spec extends TurboModule {
  addOverlay(params: AddOverlayParams): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('FfmpegWrapper');
