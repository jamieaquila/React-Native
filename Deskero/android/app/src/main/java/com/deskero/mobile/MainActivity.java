package com.deskero.mobile;

import android.widget.LinearLayout;
import android.widget.ImageView;
import android.graphics.Color;
import android.widget.TextView;
import android.view.Gravity;
import android.util.TypedValue;
import android.support.v4.content.ContextCompat;
import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {
    @Override
    public LinearLayout createSplashLayout() {
        LinearLayout view = new LinearLayout(this);
        ImageView imageView = new ImageView(this);

        view.setBackgroundColor(Color.parseColor("#e14d25"));
        view.setGravity(Gravity.CENTER);

        // hard code the width and the height of the logo
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(450, 408);
        layoutParams.gravity = Gravity.CENTER;
        imageView.setLayoutParams(layoutParams);
        imageView.setImageDrawable(ContextCompat.getDrawable(this.getApplicationContext(), R.drawable.logo));

        view.addView(imageView);
        return view;
    }
}
