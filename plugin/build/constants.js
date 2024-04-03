"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgly_config_regex = exports.replacementForTag = exports.defaultTargetSdkVersion = exports.defaultCompileSdkVersion = exports.defaultMinSdkVersion = exports.defaultBuildToolsVersion = exports.ConfigurationTag = void 0;
const Helpers = __importStar(require("./helpers"));
/** Tags for the config plugin. */
var ConfigurationTag;
(function (ConfigurationTag) {
    ConfigurationTag["Modules"] = "MODULES";
    ConfigurationTag["Repos"] = "REPOS";
    ConfigurationTag["Maven"] = "MAVEN";
    ConfigurationTag["SDKVersions"] = "SDK_VERSIONS";
})(ConfigurationTag || (exports.ConfigurationTag = ConfigurationTag = {}));
/** The default `buildToolsVersion`. */
exports.defaultBuildToolsVersion = "34.0.0";
/** The default `minSdkVersion`. */
exports.defaultMinSdkVersion = "21";
/** The default `compileSdkVersion`. */
exports.defaultCompileSdkVersion = "34";
/** The default `targetSdkVersion`. */
exports.defaultTargetSdkVersion = "34";
/**
 * Returns the replacement for a given `ConfigurationTag.`
 * @param tag The `ConfigurationTag`.
 * @param userInfo The configurations of the user.
 * @param content The original content.
 * @returns The replacement string.
 */
function replacementForTag(tag, configuration, content) {
    switch (tag) {
        case ConfigurationTag.Maven:
            return imgly_allprojects_block;
        case ConfigurationTag.Modules:
            return customizedModules(configuration);
        case ConfigurationTag.Repos:
            return imgly_repos_block(configuration);
        case ConfigurationTag.SDKVersions:
            if (content != null) {
                return Helpers.parseSDKVersions(content, configuration) ?? "";
            }
            return "";
    }
}
exports.replacementForTag = replacementForTag;
/**
 * Customizes the modules for the Android SDK.
 * @param userInfo The modules that should be included.
 * @returns The parsed string.
 */
function customizedModules(configuration) {
    if (configuration?.modules != null) {
        var modules = configuration.modules.flatMap((module) => `        include '${module}'\n`);
        var config = imgly_config_start.concat(...modules, imgly_config_end);
        return config;
    }
    else {
        return imgly_config_block;
    }
}
/** The modules for the android/app/build.gradle. */
exports.imgly_config_regex = 'apply plugin: "com.android.application"';
/** The version of the native Android SDK that is needed for the plugins. */
const sdk_version = "10.9.0";
/** The Kotlin version that is needed for the plugins. */
const default_kotlin_version = "1.8.0";
/** The KSP version that is needed for the plugins. */
const default_ksp_version = "1.8.0-1.0.9";
/** The start for the imgly configuration block. */
const imgly_config_start = `
apply plugin: 'ly.img.android.sdk'
apply plugin: 'kotlin-android'

// Comment out the modules you don't need, to save size.
imglyConfig {
    modules {
`;
/** The end for the imgly configuration block. */
const imgly_config_end = `    }
}
`;
/** The modules for the android/app/build.gradle. */
const imgly_config_block = `
apply plugin: 'ly.img.android.sdk'
apply plugin: 'kotlin-android'

// Comment out the modules you don't need, to save size.
IMGLY.configure {
    modules {
        include 'ui:text'
        include 'ui:focus'
        include 'ui:frame'
        include 'ui:brush'
        include 'ui:filter'
        include 'ui:sticker'
        include 'ui:overlay'
        include 'ui:transform'
        include 'ui:adjustment'
        include 'ui:text-design'
        include 'ui:video-trim'
        include 'ui:video-library'
        include 'ui:video-composition'
        include 'ui:audio-composition'
        include 'ui:giphy-sticker'

        // This module is big, remove the serializer if you don't need that feature.
        include 'backend:serializer'

        // Remove the asset packs you don't need, these are also big in size.
        include 'assets:font-basic'
        include 'assets:frame-basic'
        include 'assets:filter-basic'
        include 'assets:overlay-basic'
        include 'assets:sticker-shapes'
        include 'assets:sticker-emoticons'
        include 'assets:sticker-animated'

        include 'backend:sticker-animated'
        include 'backend:sticker-smart'
        include 'backend:background-removal'
    }
}
`;
/** The repositories for all projects. */
const imgly_allprojects_block = `
allprojects {
    repositories {
        maven { url "https://artifactory.img.ly/artifactory/imgly" }
    }
}
`;
/** The repositories for the android/build.gradle. */
function imgly_repos_block(configuration) {
    const kotlinVers = configuration?.kotlinGradlePluginVersion ?? default_kotlin_version;
    return `buildscript {
    repositories {
        maven { url "https://artifactory.img.ly/artifactory/imgly" }
    }
    dependencies {
        def kotlinVersion = findProperty('android.kotlinVersion') ?: "${kotlinVers}"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$\{kotlinVersion}"
        classpath 'ly.img.android.sdk:plugin:${configuration?.version ?? sdk_version}'
        classpath('com.google.devtools.ksp:com.google.devtools.ksp.gradle.plugin:${configuration?.kspVersion ?? default_ksp_version}')
    }
}
`;
}
