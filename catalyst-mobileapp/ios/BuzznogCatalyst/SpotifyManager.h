//
//  SpotifyManager.h
//  BuzznogCatalyst
//
//  Created by Cameron Moreau on 7/16/17.
//  Copyright © 2017 Buzznog. All rights reserved.
//

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <Spotify/SpotifyAuthentication.h>
#import <Spotify/SpotifyAudioPlayback.h>

@interface SpotifyManager : RCTEventEmitter <RCTBridgeModule, SPTAudioStreamingDelegate, SPTAudioStreamingPlaybackDelegate>

@property (nonatomic, strong) SPTAuth *auth;
@property (nonatomic, strong) SPTAudioStreamingController *player;

@end
