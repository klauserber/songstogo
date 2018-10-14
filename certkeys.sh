#!/bin/bash


# debug
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64

#release

keytool -list -v -keystore release-key.jks -alias releasekey -storepass android -keypass android

keytool -exportcert -alias releasekey -keystore release-key.jks | openssl sha1 -binary | openssl base64
