import { ConfigurationTag } from "./constants";
import * as Constants from "./constants";

/** A tagged header for a configuration block. */
function taggedHeader(tag: ConfigurationTag): string {
  return `\n// IMG.LY CONFIGURATION - ${tag} - START\n`;
}

/** A tagged footer for a configuration block. */
function taggedFooter(tag: ConfigurationTag): string {
  return `\n// IMG.LY CONFIGURATION - ${tag} - END\n`;
}

/** The indicator for the replacement content start. */
const replacementContentStart = "// IMG.LY - PREVIOUS CONTENT - START";

/** The indicator for the replacement content end. */
const replacementContentEnd = "// IMG.LY - PREVIOUS CONTENT - END";

/** A tagged header for a replacement configuration block. */
function replacementBody(previousContent: string): string {
  return `//\n// THIS SECTION HAS BEEN REPLACED BY THE IMG.LY SDK. THE PREVIOUS STATE\n// CAN BE FOUND BELOW:\n//\n${replacementContentStart}\n// ------------------\n${previousContent}\n// ------------------\n${replacementContentEnd}\n`;
}

/**
 * Retrieves the previous content for a given `ConfigurationTag`.
 * @param tag The `ConfigurationTag` of which to fetch the previous state.
 * @param content The original content of the file.
 * @returns The previous content if any.
 */
export function previousContent(
  tag: ConfigurationTag,
  content: string
): string | undefined {
  if (tag == ConfigurationTag.SDKVersions) {
    const versionsRegex = /(^[\s]*)\bext\s*{([^}]*)}$/gm;
    const previousContent = content.match(versionsRegex);
    if (previousContent != null) {
      const parsedPreviousContent = previousContent[0];
      return parsedPreviousContent;
    }
  }
  return;
}

/**
 * Parses the Android SDK versions from a given source.
 * @param content The original source content.
 * @param configurationObject The `AndroidConfigurationObject` that contains the customized versions.
 * @returns The parsed content if any.
 */
export function parseSDKVersions(
  content: string,
  configurationObject?: Constants.AndroidConfigurationObject
): string | undefined {
  let source = previousContent(ConfigurationTag.SDKVersions, content);

  if (source != null) {
    const buildToolsRegEx =
      /\bbuildToolsVersion\s*=\s*"([0-9]*).([0-9]*).([0-9]*)"$/gm;
    const minSdkVersionRegEx = /\bminSdkVersion\s*=\s*([0-9]*)$/gm;
    const compileSdkVersionRegEx = /\bcompileSdkVersion\s*=\s*([0-9]*)$/gm;
    const targetSdkVersionRegEx = /\btargetSdkVersion\s*=\s*([0-9]*)$/gm;

    const newBuildTools = `buildToolsVersion = "${
      configurationObject?.buildToolsVersion ??
      Constants.defaultBuildToolsVersion
    }"`;
    const newMinSdkVersion = `minSdkVersion = ${
      configurationObject?.minSdkVersion ?? Constants.defaultMinSdkVersion
    }`;
    const newCompileSdkVersion = `compileSdkVersion = ${
      configurationObject?.compileSdkVersion ??
      Constants.defaultCompileSdkVersion
    }`;
    const newTargetSdkVersion = `targetSdkVersion = ${
      configurationObject?.targetSdkVersion ?? Constants.defaultTargetSdkVersion
    }`;

    source = source.replace(buildToolsRegEx, newBuildTools);
    source = source.replace(minSdkVersionRegEx, newMinSdkVersion);
    source = source.replace(compileSdkVersionRegEx, newCompileSdkVersion);
    source = source.replace(targetSdkVersionRegEx, newTargetSdkVersion);

    return source;
  }
  return;
}

/**
 * A tagged replacement block.
 * @param tag The corresponding `ConfigurationTag`.
 * @param content The configuration block that replaces the last content.
 * @param content The content that has been replaced.
 * @returns The tagged replacement block.
 */
export function taggedReplacementBlock(
  tag: ConfigurationTag,
  content: string,
  previousContent: string
) {
  return `${taggedHeader(tag)}${replacementBody(
    previousContent
  )}${content}${taggedFooter(tag)}`;
}

/**
 * A tagged configuration block.
 * @param tag The corresponding `ConfigurationTag`.
 * @param content The configuration block.
 * @returns The tagged configuration block.
 */
export function taggedConfigurationBlock(
  tag: ConfigurationTag,
  content: string
): string {
  return `${taggedHeader(tag)}${content}${taggedFooter(tag)}`;
}

/**
 * Replaces the configuration block.
 * @param source The original input string that should be modified.
 * @param tag The corresponding `ConfigurationTag`.
 * @param replacement The replacement string.
 * @returns The modified source if a previous configuration header has been found, otherwise `null`.
 */
export function replaceTaggedConfiguration(
  source: string,
  tag: ConfigurationTag,
  replacement: string
): string | undefined {
  const header = taggedHeader(tag);
  if (source.match(header)) {
    const footer = taggedFooter(tag);
    let configurationBlock = source.substring(
      source.indexOf(header) + header.length,
      source.lastIndexOf(footer)
    );
    if (tag == ConfigurationTag.SDKVersions) {
      const replacementBlock = source.substring(
        source.indexOf(`${replacementContentEnd}\n`) +
          `${replacementContentEnd}\n`.length,
        source.lastIndexOf(footer)
      );
      configurationBlock = replacementBlock;
    }
    source = source.replace(configurationBlock, replacement);
    return source;
  }
  return;
}
