import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  runFFmpegCommand(command: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('FfmpegWrapper');
