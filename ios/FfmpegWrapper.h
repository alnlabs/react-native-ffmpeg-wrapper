#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <FfmpegWrapperSpec/FfmpegWrapperSpec.h>
#endif

@interface FfmpegWrapper : NSObject <RCTBridgeModule>
@end

#ifdef RCT_NEW_ARCH_ENABLED
@interface FfmpegWrapper () <NativeFfmpegWrapperSpec>
@end
#endif
