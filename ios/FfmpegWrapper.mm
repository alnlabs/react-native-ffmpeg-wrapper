#import "FfmpegWrapper.h"
#import <ffmpegkit/FFmpegKit.h>
#import <ffmpegkit/ReturnCode.h>

@implementation FfmpegWrapper
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(runFFmpegCommand:(NSString *)command
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [FFmpegKit executeAsync:command
      withCompleteCallback:^(FFmpegSession *session) {
        ReturnCode *returnCode = [session getReturnCode];
        if ([ReturnCode isSuccess:returnCode]) {
          resolve(@YES);
        } else {
          NSString *message = [NSString
              stringWithFormat:@"FFmpeg failed with code: %@", returnCode];
          reject(@"FFMPEG_ERROR", message, nil);
        }
      }];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeFfmpegWrapperSpecJSI>(params);
}
#endif

@end
