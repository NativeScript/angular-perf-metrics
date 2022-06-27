//
//  main.m
//  Native
//
//  Created by Team nStudio on 6/22/22.
//

#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import "GlobalTime.h"
CFTimeInterval AppStartTime;

int main(int argc, char * argv[]) {
    NSString * appDelegateClassName;
    AppStartTime = CACurrentMediaTime();
    @autoreleasepool {
        // Setup code that might create autoreleased objects goes here.
        appDelegateClassName = NSStringFromClass([AppDelegate class]);
    }
    return UIApplicationMain(argc, argv, nil, appDelegateClassName);
}
