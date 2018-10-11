package com.mobile.mekaniku;

import android.support.annotation.Nullable;
import com.facebook.soloader.SoLoader;

import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.airbnb.android.react.maps.MapsPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.gettipsi.stripe.StripeReactPackage;

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
            new MapsPackage(),
            new RNGeocoderPackage(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage(),
            new StripeReactPackage()           
        );
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);   
    }
}
