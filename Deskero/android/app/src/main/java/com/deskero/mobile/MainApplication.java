package com.deskero.mobile;

import android.support.annotation.Nullable;
import com.facebook.soloader.SoLoader;

import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.rnfs.RNFSPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.fileopener.FileOpenerPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.filepicker.FilePickerPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.horcrux.svg.SvgPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.rnfs.RNFSPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;

import java.util.List;
import java.util.Arrays;

public class MainApplication extends NavigationApplication {
    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
            new RNDeviceInfo(),
            new VectorIconsPackage(),
            new ReactNativeDocumentPicker(),
            new PickerPackage(),
            new FabricPackage(),
            new RNFSPackage(),
            new WebViewBridgePackage(),
            new FileOpenerPackage(),
            new RNSoundPackage(),
            new FilePickerPackage(),
            new ReactNativePushNotificationPackage(),
            new SvgPackage(),
            new RNCardViewPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new RNI18nPackage(),
            new RNVersionNumberPackage()
        );
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        Fabric.with(this, new Crashlytics());
    }
    
}
