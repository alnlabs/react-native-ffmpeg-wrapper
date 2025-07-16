import NativeFfmpegWrapper from './NativeFfmpegWrapper';

export function runFFmpegCommand(command: string): Promise<boolean> {
  return NativeFfmpegWrapper.runFFmpegCommand(command);
}