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
const config_plugins_1 = require("@expo/config-plugins");
const Constants = __importStar(require("./constants"));
const Helpers = __importStar(require("./helpers"));
/** Applies all needed native configurations. */
const withReactNativeIMGLY = (config, { android } = {}) => {
    return (0, config_plugins_1.withPlugins)(config, [
        withMultidexApplication,
        withMultidexGradle,
        [withIMGLYGradle, { androidVersion: android === null || android === void 0 ? void 0 : android.version }],
        [withIMGLYConfig, { includedModules: android === null || android === void 0 ? void 0 : android.modules }],
    ]);
};
/** Implements multidex in the `MainApplication.java`. */
const withMultidexApplication = (config) => {
    return (0, config_plugins_1.withMainApplication)(config, (config) => {
        config.modResults.contents = addMultidexApplication(config.modResults.contents);
        return config;
    });
};
/** Implements multidex in the `android/build.gradle`. */
const withMultidexGradle = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        config.modResults.contents = addMultidexGradle(config.modResults.contents);
        return config;
    });
};
/** Adds the imgly repos in the `android/build.gradle`. */
const withIMGLYGradle = (config, { androidVersion }) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        config.modResults.contents = addIMGLYRepos(config.modResults.contents, androidVersion);
        return config;
    });
};
/** Adds the imgly modules in the `android/app/build.gradle`. */
const withIMGLYConfig = (config, { includedModules }) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        config.modResults.contents = addIMGLYConfig(config.modResults.contents, includedModules);
        return config;
    });
};
/** Adds the imgly repos in the `android/build.gradle`. */
function addIMGLYRepos(contents, androidVersion) {
    var modifiedContents = contents;
    const repos_tag = Constants.ConfigurationTag.Repos;
    const repos_replacement = Constants.replacementForTag(repos_tag, androidVersion);
    const repos_taggedReplacement = Helpers.replaceTaggedConfiguration(modifiedContents, Constants.ConfigurationTag.Repos, repos_replacement);
    if (repos_taggedReplacement != null) {
        modifiedContents = repos_taggedReplacement;
    }
    else {
        const repos_tagged_replacement_block = Helpers.taggedConfigurationBlock(repos_tag, repos_replacement);
        if (!contents.match(repos_tagged_replacement_block)) {
            modifiedContents = repos_tagged_replacement_block.concat(contents);
        }
    }
    const maven_tag = Constants.ConfigurationTag.Maven;
    const maven_replacement = Constants.replacementForTag(maven_tag);
    const maven_taggedReplacement = Helpers.replaceTaggedConfiguration(modifiedContents, maven_tag, maven_replacement);
    if (maven_taggedReplacement != null) {
        modifiedContents = maven_taggedReplacement;
    }
    else {
        const maven_tagged_replacement_block = Helpers.taggedConfigurationBlock(maven_tag, maven_replacement);
        if (!contents.match(maven_tagged_replacement_block)) {
            modifiedContents = modifiedContents.concat(maven_tagged_replacement_block);
        }
    }
    return modifiedContents;
}
/** Adds the imgly modules in the `android/app/build.gradle`. */
function addIMGLYConfig(contents, includedModules) {
    const tag = Constants.ConfigurationTag.Modules;
    const replacement = Constants.replacementForTag(tag, includedModules);
    const taggedReplacement = Helpers.replaceTaggedConfiguration(contents, tag, replacement);
    if (taggedReplacement != null) {
        return taggedReplacement;
    }
    else {
        const replacement_block = Helpers.taggedConfigurationBlock(tag, replacement);
        if (!contents.match(replacement_block)) {
            if (contents.match(Constants.imgly_config_regex)) {
                return contents.replace(Constants.imgly_config_regex, Constants.imgly_config_regex + replacement_block);
            }
            throw new Error('Unable to configure img.ly plugins: Plugin "com.android.application" not found.');
        }
        return contents;
    }
}
/** Implements multidex in the `MainApplication.java`. */
function addMultidexApplication(contents) {
    if (contents.match(Constants.multidex)) {
        return contents.replace(Constants.multidex, Constants.replacementForTag(Constants.ConfigurationTag.Multidex));
    }
    return contents;
}
/** Implements multidex in the `android/build.gradle`. */
function addMultidexGradle(contents) {
    const tag = Constants.ConfigurationTag.MultidexConfig;
    const replacement = Constants.replacementForTag(tag);
    const taggedReplacementBlock = Helpers.taggedConfigurationBlock(tag, replacement);
    const taggedReplacement = Helpers.replaceTaggedConfiguration(contents, tag, replacement);
    if (taggedReplacement != null) {
        return taggedReplacement;
    }
    else {
        if (!contents.match(taggedReplacementBlock)) {
            return contents.concat(taggedReplacementBlock);
        }
        return contents;
    }
}
exports.default = withReactNativeIMGLY;
