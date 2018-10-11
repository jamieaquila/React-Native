//
//  SpotifyManager.m
//  BuzznogCatalyst
//
//  Created by Cameron Moreau on 7/16/17.
//  Copyright © 2017 Buzznog. All rights reserved.
//

#import "SpotifyManager.h"
#import <React/RCTLog.h>

@implementation SpotifyManager

// Export module "SpotifyManager"
RCT_EXPORT_MODULE(SpotifyManager);


- (NSArray<NSString *> *)supportedEvents
{
  return @[@"LoginSuccessful", @"LoginFailed", @"FinishedPlayingTrack"];
}

// Methods
RCT_EXPORT_METHOD(initialize:(NSString *) clientId) {
  self.auth = [SPTAuth defaultInstance];
  self.player = [SPTAudioStreamingController sharedInstance];
  self.player.delegate = self;
  self.player.playbackDelegate = self;
  
  NSError *audioStreamingInitError;
  [self.player startWithClientId:clientId error:&audioStreamingInitError];
  
  if(audioStreamingInitError != nil) {
    RCTLogInfo(@"Failed to start spotify sdk: %@", audioStreamingInitError.description);
  }
}

RCT_EXPORT_METHOD(setAccessToken:(NSString *) accessToken) {
  RCTLogInfo(@"Logging in");
  [self.player loginWithAccessToken:accessToken];
}

// MARK: - Spotify React song variables
RCT_EXPORT_METHOD(currentPlaybackPosition:(RCTResponseSenderBlock) callback) {
  NSInteger pos = [[self.player playbackState] position];
  callback(@[@(pos)]);
}

// MARK: - Spotify React song methods
RCT_EXPORT_METHOD(playUri:(NSString *) uri: (RCTResponseSenderBlock) callback) {
    [self.player playSpotifyURI:uri startingWithIndex:0 startingWithPosition:0 callback:^(NSError *error) {
      if (error == nil) callback(@[[NSNull null]]);
      else {
        RCTLogInfo(@"Error playing track: %@", error.description);
        NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys: [@(error.code) stringValue], @"code", error.description, @"message", nil];
        callback(@[dict]);
      }
    }];
}

RCT_EXPORT_METHOD(seekTo:(double) position) {
  [self.player seekTo:position callback:^(NSError *error) {
  }];
}

RCT_EXPORT_METHOD(getPosition:(RCTResponseSenderBlock) callback) {
  double pos = [self.player.playbackState position];
  callback(@[@(pos)]);
}


RCT_EXPORT_METHOD(resume) {
  [self.player setIsPlaying:true callback:^(NSError *error) {
  }];
}

RCT_EXPORT_METHOD(pause) {
  [self.player setIsPlaying:false callback:^(NSError *error) {
    
  }];
}

// MARK: - Spotify Methods
- (void)audioStreamingDidLogin:(SPTAudioStreamingController *)audioStreaming {
  RCTLogInfo(@"Login to spotify audio!");
  [self sendEventWithName:@"LoginSuccessful" body:@"test"];
}

- (void)audioStreaming:(SPTAudioStreamingController *)audioStreaming didReceiveError:(NSError *)error {
  RCTLogInfo(@"Audio stream error!! %@", error.description);
  [self sendEventWithName:@"LoginFailed" body:@"test"];
}

- (void)audioStreaming:(SPTAudioStreamingController *)audioStreaming didReceivePlaybackEvent: (SpPlaybackEvent)event {}

- (void)audioStreaming:(SPTAudioStreamingController *)audioStreaming didStopPlayingTrack:(NSString *)trackUri {
  [self sendEventWithName:@"FinishedPlayingTrack" body:@"test"];
}

@end
