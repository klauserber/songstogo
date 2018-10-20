#!/bin/bash


# https://coderwall.com/p/r09hoq/android-generate-release-debug-keystores

# debug
keytool -genkey -v -keystore ~/.android/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000

# google: https://console.firebase.google.com/u/0/project/de-isium-songstogo/settings/general/android:de.isium.songstogo
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# facebook: https://developers.facebook.com/apps/238695393326428/dashboard/
# Issue: https://github.com/jeduan/cordova-plugin-facebook4/issues/599
keytool -exportcert -alias androiddebugkey -keystore ~\.android\debug.keystore | openssl sha1 -binary | openssl base64

#release

keytool -list -v -keystore release-key.jks -alias releasekey -storepass android -keypass android

keytool -exportcert -alias releasekey -keystore release-key.jks | openssl sha1 -binary | openssl base64
