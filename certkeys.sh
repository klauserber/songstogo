#!/bin/bash


# https://coderwall.com/p/r09hoq/android-generate-release-debug-keystores

# debug
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000


keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64

#release

keytool -list -v -keystore release-key.jks -alias releasekey -storepass android -keypass android

keytool -exportcert -alias releasekey -keystore release-key.jks | openssl sha1 -binary | openssl base64
