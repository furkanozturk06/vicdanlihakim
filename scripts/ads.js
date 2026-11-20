/**
 * Ads: a full-screen ad between days, after every day; and ads the player chooses to
 * watch for a reward (an extra question, money at the end of the day, a second chance).
 * Only in the phone apps (Android/iOS); the web version never shows ads.
 * Users in regions that require it (e.g. the EU) are asked for consent first.
 */
import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';

// Google's test ad units. Before release, replace them with the game's own
// AdMob ad unit IDs and set TESTING to false.
const INTERSTITIAL_ID = {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
};
const REWARDED_ID = {
    android: 'ca-app-pub-3940256099942544/5224354917',
    ios: 'ca-app-pub-3940256099942544/1712485313',
};
const TESTING = true;
const EVERY_DAYS = 1; // after every day

let enabled = false; // the plugin started and ads may be requested
let loaded = false;  // an ad is ready to show
let rewardLoaded = false; // an ad with a reward is ready to show
let privacyOptions = false; // the player's region requires a way to change the ad consent later

async function load() {
    try {
        await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID[Capacitor.getPlatform()], isTesting: TESTING });
        loaded = true;
    } catch {
        loaded = false; // no ad this time (offline, no fill); the game simply goes on
    }
}

async function loadReward() {
    try {
        await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID[Capacitor.getPlatform()], isTesting: TESTING });
        rewardLoaded = true;
    } catch {
        rewardLoaded = false; // the offers simply do not show this time
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
        privacyOptions = consent.privacyOptionsRequirementStatus === 'REQUIRED';
        // iOS: Apple's tracking permission, asked once, after the consent screen (Google's
        // recommended order); without it the ads are simply not personalised
        if (enabled && Capacitor.getPlatform() === 'ios') {
            const { status } = await AdMob.trackingAuthorizationStatus();
            if (status === 'notDetermined') await AdMob.requestTrackingAuthorization();
        }
        if (enabled) await Promise.all([load(), loadReward()]);
    } catch (e) {
        console.warn('Ads unavailable:', e);
        enabled = false;
    }
}

// Settings: where the consent can be changed later (only where the law requires it, e.g. the EU)
export const adPrivacyOptionsAvailable = () => privacyOptions;

export async function showAdPrivacyOptions() {
    try {
        await AdMob.showPrivacyOptionsForm();
        const consent = await AdMob.requestConsentInfo();
        enabled = consent.canRequestAds !== false;
        if (enabled && !loaded) await load();
        if (enabled && !rewardLoaded) await loadReward();
    } catch (e) {
        console.warn('Privacy options unavailable:', e);
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

// An ad with a reward can be offered right now (the offers are not shown otherwise)
export const rewardedAdReady = () => enabled && rewardLoaded;

// Shows the ad the player chose to watch. Resolves once it is closed: true when it was
// watched to the end (the reward is earned), false when it was closed early or failed.
export async function showRewardedAd({ pause, resume } = {}) {
    if (!rewardedAdReady()) {
        if (enabled) loadReward();
        return false;
    }
    rewardLoaded = false;
    pause?.();
    let earned = false;
    try {
        await new Promise(resolve => {
            let closed = false;
            let handles = [];
            const done = () => {
                if (closed) return;
                closed = true;
                handles.forEach(h => h.remove());
                resolve();
            };
            Promise.all([
                AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { earned = true; }),
                AdMob.addListener(RewardAdPluginEvents.Dismissed, done),
                AdMob.addListener(RewardAdPluginEvents.FailedToShow, done),
            ]).then(hs => {
                handles = hs;
                if (closed) hs.forEach(h => h.remove());
            });
            AdMob.showRewardVideoAd().then(() => { earned = true; }, done);
        });
    } finally {
        resume?.();
        loadReward(); // ready for the next offer
    }
    return earned;
}
