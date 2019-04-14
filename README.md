
# Development

This are personal notes for my development environment. Feel free and create your firebase project under https://firebase.google.com/ to start your own development. Place your Firebase configuration in a file named `src/app/firebaseconfig.ts` - see the corresponding template file `firebaseconfig.ts_template`. 

## node/npm

You need node 9.x. Consider to use node version manager: https://github.com/creationix/nvm

## ionic install

    npm i -g ionic cordova serve

## Clone repo and start development mode

    git clone git@github.com:klauserber/songstogo.git
    cd songstogo
    npm i
    ionic serve

The browser starts automatically or visit http://localhost:8100

## Test as PWA

    ionic build --prod
    serve -p 8080 www

Visit http://localhost:8080 and test the offline capabilities.

## Java setup

Install java8 in the way you like (brew on MacOSX, apt-get or similar on linux, scoop or similar on Windows):

    brew tap caskroom/versions
    brew cask install java8

... and also gradle

    brew install gradle

## Android Setup

Download Command line tools from: https://developer.android.com/studio/#downloads

Unzip to a path of your choice.

Set environment variables:

    export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk

    # avdmanager, sdkmanager
    export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin

    # adb, logcat
    export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools

    # emulator
    export PATH=$PATH:$ANDROID_SDK_ROOT/emulator

Restart your shell.

Install these packages:

    sdkmanager "build-tools;27.0.3" "emulator" "platforms;android-27" "system-images;android-27;google_apis;x86" "platform-tools" "extras;intel;Hardware_Accelerated_Execution_Manager"

Create a virtual device:

    avdmanager create avd -n "Nexus9" -d "Nexus 9" -k "system-images;android-27;google_apis;x86"

Test the virtual device:
    
    emulator -avd "Nexus9"


## Test with a emulated Andriod device

### Generate a development keystore:

    keytool -genkey -v -keystore ~/.android/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000

### Retrieve the Google SHA1 key:

    keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

And add it in the firebase console of the app: https://console.firebase.google.com/u/0/project/de-isium-songstogo/settings/general/android:de.isium.songstogo

### Retrieve the Facebook key info:

    keytool -exportcert -alias androiddebugkey -keystore ~\.android\debug.keystore | openssl sha1 -binary | openssl base64

And add it in the Facebook developer console of the app: https://developers.facebook.com/apps/238695393326428/dashboard/

### Start the app in the Android emulator

    ionic cordova emulate android

## Test with a real Android device

* Connect your Android device via USB - Developer Mode and USB debugging must be turned on.
* Allow USB for the connected computer an the device.

Test if the device is connected:

    adb devices

One device must be listet.

Start the app on the device:

    ionic cordova run android 

## iOS Setup

*only on mac*

* Download and install Xcode 9 from: https://developer.apple.com/download/more/
* Create a development team (read more: https://beta.ionicframework.com/docs/installation/ios)
* Switch Xcode

    sudo xcode-select --switch /Applications/Xcode.app

* Install ios-sim & ios-deploy

    npm install -g ios-sim ios-deploy


## Test with a emulated iOS device

    ionic cordova run ios

Workaround 1 - for a working Google login:
because of a problem with cordova-plugin-googleplus:7.0.1 and iOS 12.2 you need to use Version 5.3.2, see issues: https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/565 and https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/592

In addition to the infos in the issues, you have to edit the file plugins⁩/cordova-plugin-googleplus⁩/hooks⁩/ios⁩/prerequisites.js and change the 2 findings of context.requireCordovaModule(...) to require(...)

Workaround 2 - to successful deploy to a iOS simulator:
    cd platform/ios/cordova
    npm install ios-sim

## Test with a real iOS device

* Load the XCode project in 'platforms/ios' and select your develop tean für code signing (section 'general')
* Connect your iOS device via USB.
* run

    ionic cordova run ios

* The first run will fail. Trust you as an app developer on the device. 
