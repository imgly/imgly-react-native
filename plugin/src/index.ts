import {
  ConfigPlugin,
  withAppBuildGradle,
  withProjectBuildGradle,
  withMainApplication,
  withPlugins,
} from "@expo/config-plugins";

import * as Constants from "./constants";
import * as Helpers from "./helpers";

/** Applies all needed native configurations. */
const withReactNativeIMGLY: ConfigPlugin<
  {
    android?: {
      version?: string;
      modules?: [string];
      buildToolsVersion?: string;
      minSdkVersion?: string;
      compileSdkVersion?: string;
      targetSdkVersion?: string;
      kotlinGradlePluginVersion?: string;
    };
  } | void
> = (config, { android } = {}) => {
  const configuration: Constants.AndroidConfigurationObject = {
    version: android?.version,
    modules: android?.modules,
    buildToolsVersion: android?.buildToolsVersion,
    minSdkVersion: android?.minSdkVersion,
    compileSdkVersion: android?.compileSdkVersion,
    targetSdkVersion: android?.targetSdkVersion,
    kotlinGradlePluginVersion: android?.kotlinGradlePluginVersion,
  };
  return withPlugins(config, [
    [withIMGLYGradle, { configuration: configuration }],
    [withIMGLYConfig, { configuration: configuration }],
  ]);
};

/** Adds the imgly repos in the `android/build.gradle`. */
const withIMGLYGradle: ConfigPlugin<{
  configuration?: Constants.AndroidConfigurationObject;
}> = (config, { configuration }) => {
  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents = addIMGLYRepos(
      config.modResults.contents,
      configuration
    );
    return config;
  });
};

/** Adds the imgly modules in the `android/app/build.gradle`. */
const withIMGLYConfig: ConfigPlugin<{
  configuration?: Constants.AndroidConfigurationObject;
}> = (config, { configuration }) => {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = addIMGLYConfig(
      config.modResults.contents,
      configuration
    );
    return config;
  });
};

/** Adds the imgly repos in the `android/build.gradle`. */
function addIMGLYRepos(
  contents: string,
  configuration?: Constants.AndroidConfigurationObject
): string {
  var modifiedContents = contents;
  const repos_tag = Constants.ConfigurationTag.Repos;
  const repos_replacement = Constants.replacementForTag(
    repos_tag,
    configuration
  );
  const repos_taggedReplacement = Helpers.replaceTaggedConfiguration(
    modifiedContents,
    Constants.ConfigurationTag.Repos,
    repos_replacement
  );

  if (repos_taggedReplacement != null) {
    modifiedContents = repos_taggedReplacement;
  } else {
    const repos_tagged_replacement_block = Helpers.taggedConfigurationBlock(
      repos_tag,
      repos_replacement
    );
    if (!contents.match(repos_tagged_replacement_block)) {
      modifiedContents = repos_tagged_replacement_block.concat(contents);
    }
  }

  const maven_tag = Constants.ConfigurationTag.Maven;
  const maven_replacement = Constants.replacementForTag(maven_tag);
  const maven_taggedReplacement = Helpers.replaceTaggedConfiguration(
    modifiedContents,
    maven_tag,
    maven_replacement
  );

  if (maven_taggedReplacement != null) {
    modifiedContents = maven_taggedReplacement;
  } else {
    const maven_tagged_replacement_block = Helpers.taggedConfigurationBlock(
      maven_tag,
      maven_replacement
    );
    if (!contents.match(maven_tagged_replacement_block)) {
      modifiedContents = modifiedContents.concat(
        maven_tagged_replacement_block
      );
    }
  }

  const sdk_versions_tag = Constants.ConfigurationTag.SDKVersions;
  const versions_replacement = Constants.replacementForTag(
    sdk_versions_tag,
    configuration,
    contents
  );
  const versions_tagged_replacement = Helpers.replaceTaggedConfiguration(
    modifiedContents,
    sdk_versions_tag,
    versions_replacement
  );

  if (versions_tagged_replacement != null) {
    modifiedContents = versions_tagged_replacement;
  } else {
    const previousContent = Helpers.previousContent(
      sdk_versions_tag,
      contents
    )?.replace(/^/gm, "//");
    if (previousContent != null) {
      const versions_tagged_replacement_block = Helpers.taggedReplacementBlock(
        sdk_versions_tag,
        versions_replacement,
        previousContent
      );

      if (!contents.match(versions_tagged_replacement_block)) {
        const versionsRegex = /(^[\s]*)\bext\s*{([^}]*)}$/gm;
        modifiedContents = modifiedContents.replace(
          versionsRegex,
          versions_tagged_replacement_block
        );
      }
    }
  }

  return modifiedContents;
}

/** Adds the imgly modules in the `android/app/build.gradle`. */
function addIMGLYConfig(
  contents: string,
  configuration?: Constants.AndroidConfigurationObject
): string {
  const tag = Constants.ConfigurationTag.Modules;
  const replacement = Constants.replacementForTag(tag, configuration);
  const taggedReplacement = Helpers.replaceTaggedConfiguration(
    contents,
    tag,
    replacement
  );

  if (taggedReplacement != null) {
    return taggedReplacement;
  } else {
    const replacement_block = Helpers.taggedConfigurationBlock(
      tag,
      replacement
    );
    if (!contents.match(replacement_block)) {
      if (contents.match(Constants.imgly_config_regex)) {
        return contents.replace(
          Constants.imgly_config_regex,
          Constants.imgly_config_regex + replacement_block
        );
      }
      throw new Error(
        'Unable to configure img.ly plugins: Plugin "com.android.application" not found.'
      );
    }
    return contents;
  }
}

export default withReactNativeIMGLY;
