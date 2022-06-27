//
//  ViewController.m
//  Native
//
//  Created by Team nStudio on 6/22/22.
//

#import "ViewController.h"
#import "GlobalTime.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    NSLog(@"View did load time %f ms", (CACurrentMediaTime() - AppStartTime) * 1000.0);
}

-(void)viewDidAppear:(BOOL)animated {
    NSLog(@"View did appear time %f ms", (CACurrentMediaTime() - AppStartTime) * 1000.0);
}

@end
