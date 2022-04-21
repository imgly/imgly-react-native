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
export declare enum ConfigurationTag {
    Modules = "MODULES",
    Repos = "REPOS",
    Maven = "MAVEN",
    SDKVersions = "SDK_VERSIONS"
}
/** The default `buildToolsVersion`. */
export declare const defaultBuildToolsVersion = "31.0.0";
/** The default `minSdkVersion`. */
export declare const defaultMinSdkVersion = "21";
/** The default `compileSdkVersion`. */
export declare const defaultCompileSdkVersion = "31";
/** The default `targetSdkVersion`. */
export declare const defaultTargetSdkVersion = "30";
/**
 * Returns the replacement for a given `ConfigurationTag.`
 * @param tag The `ConfigurationTag`.
 * @param userInfo The configurations of the user.
 * @param content The original content.
 * @returns The replacement string.
 */
export declare function replacementForTag(tag: ConfigurationTag, configuration?: AndroidConfigurationObject, content?: string): string;
/** The modules for the android/app/build.gradle. */
export declare const imgly_config_regex = "apply plugin: \"com.android.application\"";
