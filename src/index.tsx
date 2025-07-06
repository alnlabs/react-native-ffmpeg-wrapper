import FfmpegWrapper from './NativeFfmpegWrapper';

export function multiply(a: number, b: number): number {
  return FfmpegWrapper.multiply(a, b);
}
