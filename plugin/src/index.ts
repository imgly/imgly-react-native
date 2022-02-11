import {
    ConfigPlugin,
    withAppBuildGradle,
    withProjectBuildGradle,
    withMainApplication,
    withPlugins,
} from '@expo/config-plugins';

import * as Constants from './constants'
import * as Helpers from './helpers'

/** Applies all needed native configurations. */
const withReactNativeIMGLY: ConfigPlugin<{
    android?: {
        version?: string;
        modules?: [string];
    }
} | void> = (config, { android } = {}) => {
    return withPlugins(config, [
        withMultidexApplication,
        withMultidexGradle,
        [withIMGLYGradle, { androidVersion: android?.version }],
        [withIMGLYConfig, { includedModules: android?.modules }],
    ])
}

/** Implements multidex in the `MainApplication.java`. */
const withMultidexApplication: ConfigPlugin = (config) => {
    return withMainApplication(config, (config) => {
        config.modResults.contents = addMultidexApplication(
            config.modResults.contents
        );
        return config;
    });
};

/** Implements multidex in the `android/build.gradle`. */
const withMultidexGradle: ConfigPlugin = (config) => {
    return withAppBuildGradle(config, (config) => {
        config.modResults.contents = addMultidexGradle(
            config.modResults.contents
        )
        return config
    })
}

/** Adds the imgly repos in the `android/build.gradle`. */
const withIMGLYGradle: ConfigPlugin<{androidVersion?: string}> = (config, { androidVersion }) => {
    return withProjectBuildGradle(config, (config) => {
        config.modResults.contents = addIMGLYRepos(config.modResults.contents, androidVersion)        
        return config
    })
}

/** Adds the imgly modules in the `android/app/build.gradle`. */
const withIMGLYConfig: ConfigPlugin<{includedModules?: [string]}> = (config, {includedModules}) => {
    return withAppBuildGradle(config, (config) => {
        config.modResults.contents = addIMGLYConfig(
            config.modResults.contents,
            includedModules
        )
        return config
    })
}

/** Adds the imgly repos in the `android/build.gradle`. */
function addIMGLYRepos(contents: string, androidVersion?: string): string {
    var modifiedContents = contents
    const repos_tag = Constants.ConfigurationTag.Repos
    const repos_replacement = Constants.replacementForTag(repos_tag, androidVersion)
    const repos_taggedReplacement = Helpers.replaceTaggedConfiguration(modifiedContents, Constants.ConfigurationTag.Repos, repos_replacement)

    if (repos_taggedReplacement != null) {
        modifiedContents = repos_taggedReplacement
    } else {
        const repos_tagged_replacement_block = Helpers.taggedConfigurationBlock(repos_tag, repos_replacement)
        if (!contents.match(repos_tagged_replacement_block)) {
            modifiedContents = repos_tagged_replacement_block.concat(contents)
        }
    }

    const maven_tag = Constants.ConfigurationTag.Maven
    const maven_replacement = Constants.replacementForTag(maven_tag)
    const maven_taggedReplacement = Helpers.replaceTaggedConfiguration(modifiedContents, maven_tag, maven_replacement)

    if (maven_taggedReplacement != null) {
        modifiedContents = maven_taggedReplacement
    } else {
        const maven_tagged_replacement_block = Helpers.taggedConfigurationBlock(maven_tag, maven_replacement)
        if (!contents.match(maven_tagged_replacement_block)) {
            modifiedContents = modifiedContents.concat(maven_tagged_replacement_block)
        }
    }

    return modifiedContents
}

/** Adds the imgly modules in the `android/app/build.gradle`. */
function addIMGLYConfig(contents: string, includedModules?: [string]): string {
    const tag = Constants.ConfigurationTag.Modules
    const replacement = Constants.replacementForTag(tag, includedModules)
    const taggedReplacement = Helpers.replaceTaggedConfiguration(contents, tag, replacement)

    if (taggedReplacement != null) {
        return taggedReplacement
    } else {
        const replacement_block = Helpers.taggedConfigurationBlock(tag, replacement)
        if (!contents.match(replacement_block)) {
            if (contents.match(Constants.imgly_config_regex)) {
                return contents.replace(Constants.imgly_config_regex, Constants.imgly_config_regex + replacement_block);
            }
            throw new Error(
                'Unable to configure img.ly plugins: Plugin "com.android.application" not found.'
            )
        }
        return contents
    }
}

/** Implements multidex in the `MainApplication.java`. */
function addMultidexApplication(contents: string): string {
    if (contents.match(Constants.multidex)) {
        return contents.replace(Constants.multidex, Constants.replacementForTag(Constants.ConfigurationTag.Multidex))
    }
    return contents
}

/** Implements multidex in the `android/build.gradle`. */
function addMultidexGradle(contents: string): string {
    const tag = Constants.ConfigurationTag.MultidexConfig
    const replacement = Constants.replacementForTag(tag)
    const taggedReplacementBlock = Helpers.taggedConfigurationBlock(tag, replacement)
    const taggedReplacement = Helpers.replaceTaggedConfiguration(contents, tag, replacement)

    if (taggedReplacement != null) {
        return taggedReplacement
    } else {
        if (!contents.match(taggedReplacementBlock)) {
            return contents.concat(taggedReplacementBlock)
        }
        return contents
    }
}

export default withReactNativeIMGLY;