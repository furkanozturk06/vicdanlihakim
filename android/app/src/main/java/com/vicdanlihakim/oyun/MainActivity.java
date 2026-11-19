package com.vicdanlihakim.oyun;

import android.os.Bundle;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Full screen before the first frame is drawn, so the bars never flash in between.
        // The game is always laid out on the whole screen; when the bars show for a moment
        // they come over the game instead of shrinking it (no jump between sizes).
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        hideSystemBars();
        super.onCreate(savedInstanceState);
        hideSystemBars();
    }

    @Override
    public void onResume() {
        super.onResume();
        hideSystemBars();
    }

    // Coming back to the game (from another app, after a full-screen ad): full screen again
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    // The game fills the whole screen: no status bar, no navigation buttons.
    // A swipe from the edge shows them for a moment, then they hide again.
    private void hideSystemBars() {
        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.systemBars());
    }
}
