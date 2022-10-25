import * as Helpers from "./helpers";

/** An interface for customizations for the Android config plugin. */
export interface AndroidConfigurationObject {
  /** The version of the IMG.LY Android SDK. */
  version?: string;

  /** The modules of the IMG.LY Android SDK. */
  modules?: [string];

  /** The `buildToolsVersion` of the Android application. */
  buildToolsVersion?: string;

  /** The `minSdkVersion` of the Android application. */
  minSdkVersion?: string;

  /** The `compileSdkVersion` of the Android application. */
  compileSdkVersion?: string;

  /** The `targetSdkVersion` of the Android application. */
  targetSdkVersion?: string;

  /** The Kotlin Gradle plugin version used. */
  kotlinGradlePluginVersion?: string;
}

/** Tags for the config plugin. */
export enum ConfigurationTag {
  Modules = "MODULES",
  Repos = "REPOS",
  Maven = "MAVEN",
  SDKVersions = "SDK_VERSIONS",
}

/** The default `buildToolsVersion`. */
export const defaultBuildToolsVersion = "31.0.0";

/** The default `minSdkVersion`. */
export const defaultMinSdkVersion = "21";

/** The default `compileSdkVersion`. */
export const defaultCompileSdkVersion = "31";

/** The default `targetSdkVersion`. */
export const defaultTargetSdkVersion = "30";

/**
 * Returns the replacement for a given `ConfigurationTag.`
 * @param tag The `ConfigurationTag`.
 * @param userInfo The configurations of the user.
 * @param content The original content.
 * @returns The replacement string.
 */
export function replacementForTag(
  tag: ConfigurationTag,
  configuration?: AndroidConfigurationObject,
  content?: string
): string {
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

/**
 * Customizes the modules for the Android SDK.
 * @param userInfo The modules that should be included.
 * @returns The parsed string.
 */
function customizedModules(configuration?: AndroidConfigurationObject): string {
  if (configuration?.modules != null) {
    var modules = configuration.modules.flatMap(
      (module) => `        include '${module}'\n`
    );
    var config = imgly_config_start.concat(...modules, imgly_config_end);
    return config;
  } else {
    return imgly_config_block;
  }
}

/** The modules for the android/app/build.gradle. */
export const imgly_config_regex = 'apply plugin: "com.android.application"';

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
function imgly_repos_block(configuration?: AndroidConfigurationObject): string {
  return `buildscript {
    repositories {
        maven { url "https://artifactory.img.ly/artifactory/imgly" }
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:${
          configuration?.kotlinGradlePluginVersion ?? default_kotlin_version
        }"
        classpath 'ly.img.android.sdk:plugin:${
          configuration?.version ?? sdk_version
        }'
    }
}
`;
}
