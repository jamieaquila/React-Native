package com.buzznog.catalyst.WhitneyPaige.debug;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.spotify.sdk.android.player.Config;
import com.spotify.sdk.android.player.ConnectionStateCallback;
import com.spotify.sdk.android.player.Error;
import com.spotify.sdk.android.player.Player;
import com.spotify.sdk.android.player.PlayerEvent;
import com.spotify.sdk.android.player.Spotify;
import com.spotify.sdk.android.player.SpotifyPlayer;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Cameron on 8/13/17.
 */

public class SpotifyManager extends ReactContextBaseJavaModule {

    Player player;

    public SpotifyManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SpotifyManager";
    }

    /**
     * Spotify Manager Functions
     */

    @ReactMethod
    public void initialize(String clientId) {
        final ReactApplicationContext context = getReactApplicationContext();

        Config spotifyConfig = new Config(getReactApplicationContext(), "", clientId);
        this.player = Spotify.getPlayer(spotifyConfig, this, new SpotifyPlayer.InitializationObserver() {
            @Override
            public void onInitialized(SpotifyPlayer spotifyPlayer) {
            }

            @Override
            public void onError(Throwable throwable) {
            }
        });

        this.player.addConnectionStateCallback(new ConnectionStateCallback() {
            @Override
            public void onLoggedIn() {
                context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("LoginSuccessful", "test");
            }

            @Override
            public void onLoggedOut() {

            }

            @Override
            public void onLoginFailed(Error error) {
                context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("LoginFailed", "test");
            }

            @Override
            public void onTemporaryError() {
            }

            @Override
            public void onConnectionMessage(String s) {

            }
        });

        this.player.addNotificationCallback(new Player.NotificationCallback() {
            @Override
            public void onPlaybackEvent(PlayerEvent playerEvent) {
                if (playerEvent == PlayerEvent.kSpPlaybackNotifyAudioDeliveryDone) {
                    context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FinishedPlayingTrack", "test");
                }
            }

            @Override
            public void onPlaybackError(Error error) {

            }
        });
    }

    @ReactMethod
    public void setAccessToken(String accessToken) {
        this.player.login(accessToken);
    }

    @ReactMethod
    public void playUri(String uri, final  Callback callback) {
        this.player.playUri(new Player.OperationCallback() {
            @Override
            public void onSuccess() {
                callback.invoke();
            }

            @Override
            public void onError(Error error) {
                try {
                    WritableMap err = new WritableNativeMap();
                    err.putString("message", error.name());
                    callback.invoke(err);
                } catch (Exception e) {
                    Log.e("SPOTIFY", e.getMessage());
                }
            }
        }, uri, 0, 0);
    }

    @ReactMethod
    public void seekTo(int position) {
        this.player.seekToPosition(new Player.OperationCallback() {
            @Override
            public void onSuccess() {

            }

            @Override
            public void onError(Error error) {

            }
        }, position * 1000);
    }

    @ReactMethod
    public void getPosition(Callback callback) {
        int pos = (int)(this.player.getPlaybackState().positionMs / 1000);
        callback.invoke(pos);
    }

    @ReactMethod
    public void resume() {
        this.player.resume(new Player.OperationCallback() {

            @Override
            public void onSuccess() {

            }

            @Override
            public void onError(Error error) {

            }
        });
    }

    @ReactMethod
    public void pause() {
        this.player.pause(new Player.OperationCallback() {
            @Override
            public void onSuccess() {

            }

            @Override
            public void onError(Error error) {

            }
        });
    }
}
