//
//  RCTInsetUtils.m
//  RnAnimationsPlayground
//
//  Created by Julien Brayere on 18/01/2022.
//

#import <React/RCTBridgeModule.h>
#import <UIKit/UIView.h>


@interface RCTInsetUtils : NSObject<RCTBridgeModule>

- (NSDictionary *) _getInsets;

@end


@implementation RCTInsetUtils

-(NSDictionary *) _getInsets {

  UIWindow *window = UIApplication.sharedApplication.windows.firstObject;

  NSDictionary *insets = @{
    @"bottom": @(window.safeAreaInsets.bottom),
    @"top": @(window.safeAreaInsets.top),
    @"left": @(window.safeAreaInsets.left),
    @"right": @(window.safeAreaInsets.right)
  };

  return insets;

}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getInsets){
  return [self _getInsets];
}

RCT_EXPORT_MODULE(RCTInsetUtils);

@end
