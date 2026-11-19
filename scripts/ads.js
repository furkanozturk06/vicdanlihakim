/**
 * Ads: a full-screen ad between days, after every day.
 * Only in the phone apps (Android/iOS); the web version never shows ads.
 * Users in regions that require it (e.g. the EU) are asked for consent first.
 */
import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus, InterstitialAdPluginEvents } from '@capacitor-community/admob';

// Google's test ad units. Before release, replace them with the game's own
// AdMob ad unit IDs and set TESTING to false.
const INTERSTITIAL_ID = {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
};
const TESTING = true;
const EVERY_DAYS = 1; // after every day

let enabled = false; // the plugin started and ads may be requested
let loaded = false;  // an ad is ready to show

async function load() {
    try {
        await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID[Capacitor.getPlatform()], isTesting: TESTING });
        loaded = true;
    } catch {
        loaded = false; // no ad this time (offline, no fill); the game simply goes on
    }
}

export async function initAds() {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await AdMob.initialize();
        let consent = await AdMob.requestConsentInfo();
        if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
            consent = await AdMob.showConsentForm();
        }
        enabled = consent.canRequestAds !== false;
        // iOS: Apple's tracking permission, asked once, after the consent screen (Google's
        // recommended order); without it the ads are simply not personalised
        if (enabled && Capacitor.getPlatform() === 'ios') {
            const { status } = await AdMob.trackingAuthorizationStatus();
            if (status === 'notDetermined') await AdMob.requestTrackingAuthorization();
        }
        if (enabled) await load();
    } catch (e) {
        console.warn('Ads unavailable:', e);
        enabled = false;
    }
}

// After the evening of `finishedDay`. Resolves once the ad is closed (or at
// once when there is no ad), so the next day starts after it.
export async function adBetweenDays(finishedDay, { pause, resume } = {}) {
    if (!enabled || finishedDay % EVERY_DAYS !== 0) return;
    if (!loaded) {
        load(); // try again for next time
        return;
    }
    loaded = false;
    pause?.();
    try {
        await new Promise(resolve => {
            const handles = [];
            const done = () => { handles.forEach(h => h.remove()); resolve(); };
            Promise.all([
                AdMob.addListener(InterstitialAdPluginEvents.Dismissed, done),
                AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, done),
            ]).then(hs => handles.push(...hs));
            AdMob.showInterstitial().catch(done);
        });
    } finally {
        resume?.();
        load(); // ready for the next time
    }
}
