import {
  ConfigPlugin,
  withAppBuildGradle,
  withGradleProperties,
  withPlugins,
  withProjectBuildGradle,
} from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

import * as Constants from "./constants";
import * as Helpers from "./helpers";

type GradlePropertyItem =
  | {
      type: "comment";
      value: string;
    }
  | {
      type: "empty";
    }
  | {
      type: "property";
      key: string;
      value: string;
    };

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
      kspVersion?: string;
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
    kspVersion: android?.kspVersion,
  };
  return withPlugins(config, [
    [withIMGLYGradle, { configuration: configuration }],
    [withIMGLYConfig, { configuration: configuration }],
    [withIMGLYGradleProperties, { configuration: configuration }],
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

/** Updates modern Android Gradle properties used by recent Expo templates. */
const withIMGLYGradleProperties: ConfigPlugin<{
  configuration?: Constants.AndroidConfigurationObject;
}> = (config, { configuration }) => {
  return withGradleProperties(config, (config) => {
    config.modResults = addIMGLYGradleProperties(
      config.modResults,
      configuration,
      config.modRequest.projectRoot
    );
    return config;
  });
};

/** Returns a version from the React Native version catalog if available. */
function versionCatalogValue(
  projectRoot: string,
  key: string
): string | undefined {
  const versionCatalogPath = path.join(
    projectRoot,
    "node_modules",
    "react-native",
    "gradle",
    "libs.versions.toml"
  );

  if (!fs.existsSync(versionCatalogPath)) {
    return;
  }

  const versionCatalog = fs.readFileSync(versionCatalogPath, "utf8");
  const match = versionCatalog.match(
    new RegExp(`^${key}\\s*=\\s*"([^"]+)"$`, "m")
  );

  if (match == null) {
    return;
  }

  return match[1];
}

/** Adds or updates a Gradle property in `android/gradle.properties`. */
function upsertGradleProperty(
  properties: GradlePropertyItem[],
  key: string,
  value: string,
  overwrite = true
): GradlePropertyItem[] {
  const previousProperty = properties.find(
    (
      property
    ): property is Extract<GradlePropertyItem, { type: "property" }> =>
      property.type === "property" && property.key === key
  );

  if (previousProperty != null) {
    if (overwrite) {
      previousProperty.value = value;
    }
    return properties;
  }

  properties.push({
    type: "property",
    key,
    value,
  });
  return properties;
}

/** Adds Expo specific Gradle properties for modern Android templates. */
function addIMGLYGradleProperties(
  properties: GradlePropertyItem[],
  configuration?: Constants.AndroidConfigurationObject,
  projectRoot?: string
): GradlePropertyItem[] {
  const detectedKotlinVersion =
    projectRoot != null ? versionCatalogValue(projectRoot, "kotlin") : undefined;
  const effectiveKotlinVersion =
    configuration?.kotlinGradlePluginVersion ?? detectedKotlinVersion;
  const effectiveKspVersion =
    configuration?.kspVersion ??
    Constants.kspVersionForKotlinVersion(effectiveKotlinVersion);

  if (configuration?.buildToolsVersion != null) {
    upsertGradleProperty(
      properties,
      "android.buildToolsVersion",
      configuration.buildToolsVersion
    );
  }
  if (configuration?.minSdkVersion != null) {
    upsertGradleProperty(
      properties,
      "android.minSdkVersion",
      configuration.minSdkVersion
    );
  }
  if (configuration?.compileSdkVersion != null) {
    upsertGradleProperty(
      properties,
      "android.compileSdkVersion",
      configuration.compileSdkVersion
    );
  }
  if (configuration?.targetSdkVersion != null) {
    upsertGradleProperty(
      properties,
      "android.targetSdkVersion",
      configuration.targetSdkVersion
    );
  }
  if (effectiveKotlinVersion != null) {
    upsertGradleProperty(
      properties,
      "android.kotlinVersion",
      effectiveKotlinVersion,
      configuration?.kotlinGradlePluginVersion != null
    );
  }
  if (effectiveKspVersion != null) {
    upsertGradleProperty(
      properties,
      "android.kspVersion",
      effectiveKspVersion,
      configuration?.kspVersion != null ||
        configuration?.kotlinGradlePluginVersion != null
    );
  }

  return properties;
}

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
        'Unable to configure IMG.LY plugins: Plugin "com.android.application" not found.'
      );
    }
    return contents;
  }
}

export default withReactNativeIMGLY;
