"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
})(ConfigurationTag = exports.ConfigurationTag || (exports.ConfigurationTag = {}));
/** The default `buildToolsVersion`. */
exports.defaultBuildToolsVersion = "31.0.0";
/** The default `minSdkVersion`. */
exports.defaultMinSdkVersion = "21";
/** The default `compileSdkVersion`. */
exports.defaultCompileSdkVersion = "31";
/** The default `targetSdkVersion`. */
exports.defaultTargetSdkVersion = "30";
/**
 * Returns the replacement for a given `ConfigurationTag.`
 * @param tag The `ConfigurationTag`.
 * @param userInfo The configurations of the user.
 * @param content The original content.
 * @returns The replacement string.
 */
function replacementForTag(tag, configuration, content) {
    var _a;
    switch (tag) {
        case ConfigurationTag.Maven:
            return imgly_allprojects_block;
        case ConfigurationTag.Modules:
            return customizedModules(configuration);
        case ConfigurationTag.Repos:
            return imgly_repos_block(configuration);
        case ConfigurationTag.SDKVersions:
            if (content != null) {
                return (_a = Helpers.parseSDKVersions(content, configuration)) !== null && _a !== void 0 ? _a : "";
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
    if ((configuration === null || configuration === void 0 ? void 0 : configuration.modules) != null) {
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
const sdk_version = "10.4.0";
/** The Kotlin version that is needed for the plugins. */
const default_kotlin_version = "1.5.32";
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
imglyConfig {
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
    var _a, _b;
    return `buildscript {
    repositories {
        maven { url "https://artifactory.img.ly/artifactory/imgly" }
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:${(_a = configuration === null || configuration === void 0 ? void 0 : configuration.kotlinGradlePluginVersion) !== null && _a !== void 0 ? _a : default_kotlin_version}"
        classpath 'ly.img.android.sdk:plugin:${(_b = configuration === null || configuration === void 0 ? void 0 : configuration.version) !== null && _b !== void 0 ? _b : sdk_version}'
    }
}
`;
}
