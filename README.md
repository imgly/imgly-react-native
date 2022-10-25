<p align="center">
  <a href="https://img.ly/?utm_campaign=Projects&utm_source=Github&utm_medium=IMGLY&utm_content=React-Native"">
    <img src="https://uploads-ssl.webflow.com/5f7574bdf1696c4b4bf518ea/5f75b58e3a7013e64675400c_IMG_LY.svg" alt="IMG.LY Logo"/>
  </a>
</p>
<p align="center">
  <a href="https://npmjs.org/package/react-native-imglysdk">
    <img src="https://img.shields.io/npm/v/react-native-imglysdk.svg" alt="NPM version">
  </a>
  <a href="https://npmjs.org/package/react-native-imglysdk">
    <img src="https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg" alt="Platform support">
  </a>
  <a href="http://twitter.com/imgly">
    <img src="https://img.shields.io/badge/twitter-@imgly-blue.svg?style=flat" alt="Twitter">
  </a>
</p>

# React Native plugin for IMG.LY SDK

A module containing the expo config plugin for the use with [`react-native-photoeditorsdk`](https://www.npmjs.com/package/react-native-photoeditorsdk) and [`react-native-videoeditorsdk`](https://www.npmjs.com/package/react-native-videoeditorsdk).

## Usage

**You only need to integrate this package once regardless of whether you are integrating `react-native-photoeditorsdk`, `react-native-videoeditorsdk` or both.**

In order to use this module with the Expo CLI you can make use of our integrated Expo config plugin:

1. Add our module to your Expo application:

   ```sh
   expo install react-native-imglysdk
   ```

2. Inside your app's `app.json` or `app.config.js` add our config plugin:

   ```json
   {
     "plugins": ["react-native-imglysdk"]
   }
   ```

   If needed, you can also use a specific version of our native library for Android as well as define explicitly the included modules. By default, all modules for both PhotoEditor SDK and VideoEditor SDK are included. Furthermore, you can configure the `buildToolsVersion`, `minSdkVersion`, `compileSdkVersion`, `targetSdkVersion`, and `kotlinGradlePluginVersion`.

   ```json
   {
     "plugins": [
       [
         "react-native-imglysdk",
         {
           "android": {
             "version": "10.4.0",
             "modules": [
               "ui:core",
               "ui:transform",
               "ui:filter",
               "assets:filter-basic"
             ],
             "buildToolsVersion": "31.0.0",
             "minSdkVersion": "21",
             "compileSdkVersion": "31",
             "targetSdkVersion": "30",
             "kotlinGradlePluginVersion": "1.5.32"
           }
         }
       ]
     ]
   }
   ```

   For further information on the available modules, please refer to step 4 of the respective React Native CLI guide for the [`react-native-photoeditorsdk`](https://www.github.com/imgly/pesdk-react-native/#android) and [`react-native-videoeditorsdk`](https://www.github.com/imgly/vesdk-react-native/#android) module.

3. The changes will be applied on `expo prebuild` or during the prebuild phase of `eas build`.

For further information on how to integrate Expo config plugins please also refer to the official [docs](https://docs.expo.dev/guides/config-plugins/#using-a-plugin-in-your-app).

## License Terms

Make sure you have a [commercial license](https://img.ly/pricing?utm_campaign=Projects&utm_source=Github&utm_medium=IMGLY&utm_content=React-Native) for PhotoEditor SDK and/or VideoEditor SDK before releasing your app.
A commercial license is required for any app or service that has any form of monetization: This includes free apps with in-app purchases or ad supported applications. Please contact us if you want to purchase the commercial license.

## Support and License

Use our [service desk](https://support.img.ly) for bug reports or support requests. To request a commercial license, please use the [license request form](https://img.ly/pricing?utm_campaign=Projects&utm_source=Github&utm_medium=IMGLY&utm_content=React-Native) on our website.
