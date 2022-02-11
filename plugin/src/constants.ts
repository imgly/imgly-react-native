import * as Helpers from './helpers'

/** Tags for the config plugin. */
export enum ConfigurationTag {
    Multidex = "MULTIDEX",
    MultidexConfig = "MULTIDEX_CONFIG",
    Modules = "MODULES",
    Repos = "REPOS",
    Maven = "MAVEN",
}

export function replacementForTag(tag: ConfigurationTag, userInfo?: any): string {
    switch (tag) {
        case ConfigurationTag.Maven:
            return imgly_allprojects_block
        case ConfigurationTag.Modules:
            return customizedModules(userInfo)
        case ConfigurationTag.Multidex:
            return multidex_replacement_block
        case ConfigurationTag.MultidexConfig:
            return multidex_config_block
        case ConfigurationTag.Repos:
            if (typeof userInfo === 'string') {
                sdk_version = userInfo
                return imgly_repos_block(userInfo)
            }
            return imgly_repos_block()
    }
}

function customizedModules(userInfo?: any): string {
    if (Array.isArray(userInfo) && userInfo.length > 0) {
        var modules = userInfo.flatMap( module => `        include '${module}'\n` )
        var config = imgly_config_start.concat(...modules, imgly_config_end)
        return config
    } else {
        return imgly_config_block
    }
}

/** The multidex declaration for the `MainApplication.java`. */
export const multidex = 'class MainApplication extends Application'

/** The modules for the android/app/build.gradle. */
export const imgly_config_regex = 'apply plugin: "com.android.application"'

/** The multidex declaration for the build.gradle. */
const multidex_config_block = `
android {
    defaultConfig {
        multiDexEnabled true
    }
}
dependencies {
    implementation 'androidx.multidex:multidex:2.0.1'
}
`

/** The version of the native Android SDK that is needed for the plugins. */
var sdk_version = '9.2.0'

/** The multidex declaration for the `MainApplication.java`. */
const multidex_replacement_block = 'class MainApplication extends androidx.multidex.MultiDexApplication'

/** The start for the imgly configuration block. */
const imgly_config_start = `
apply plugin: 'ly.img.android.sdk'
apply plugin: 'kotlin-android'

// Comment out the modules you don't need, to save size.
imglyConfig {
    modules {
`

/** The end for the imgly configuration block. */
const imgly_config_end = `    }
}
`

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
    }
}
`

/** The repositories for all projects. */
const imgly_allprojects_block = `
allprojects {
    repositories {
        maven { url "https://artifactory.img.ly/artifactory/imgly" }
    }
}
`

/** The repositories for the android/build.gradle. */
function imgly_repos_block(version?: string): string {
    return `buildscript {
    repositories {
        maven { url "https://artifactory.img.ly/artifactory/imgly" }
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.4.10"
        classpath 'ly.img.android.sdk:plugin:${version ?? sdk_version}'
    }
}
`
}