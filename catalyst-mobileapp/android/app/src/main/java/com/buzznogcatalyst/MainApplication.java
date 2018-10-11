package com.buzznog.catalyst.WhitneyPaige.debug;

import android.app.Application;
import android.util.Log;
import com.flurry.android.FlurryAgent;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.chirag.RNMail.RNMail;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.leblaaanc.RNStreamingKitManager.RNStreamingKitManagerPackage;
import cl.json.RNSharePackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.keychain.KeychainPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.eguma.barcodescanner.BarcodeScannerPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.tanguyantoine.react.MusicControl;
import com.airbnb.android.react.maps.MapsPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.kgom.cameralibrary.RNCameraLibraryPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.evollu.react.fcm.FIRMessagingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new RNMail(),
            new MusicControl(),
            new InAppBillingBridgePackage(),
            new BlurViewPackage(),
            new ReactVideoPackage(),
            new RNStreamingKitManagerPackage(),
            new RNSharePackage(),
            new PhotoViewPackage(),
            new OrientationPackage(),
            new LinearGradientPackage(),
            new KeychainPackage(),
            new ImageResizerPackage(),
            new ExtraDimensionsPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage(),
            new RCTCameraPackage(),
            new BarcodeScannerPackage(),
            new RNPermissionsPackage(),
            new SpotifyManagerPackage(),
            new RNFetchBlobPackage(),
            new MapsPackage(),
            new RNGeocoderPackage(),
            new VectorIconsPackage(),
            new KCKeepAwakePackage(),
            new RNCameraLibraryPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new FIRMessagingPackage()
        );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    String str = getResources().getString(R.string.flurry_app_id);
    Log.d("MyTagGoesHere", str);
    FlurryAgent.init(this, str);
    FlurryAgent.onStartSession(this, str);
   //CodePush.getJSBundleFile("main.bundle");
  }
}
