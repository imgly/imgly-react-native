import { ConfigurationTag } from "./constants";
import * as Constants from "./constants";
/**
 * Retrieves the previous content for a given `ConfigurationTag`.
 * @param tag The `ConfigurationTag` of which to fetch the previous state.
 * @param content The original content of the file.
 * @returns The previous content if any.
 */
export declare function previousContent(tag: ConfigurationTag, content: string): string | undefined;
/**
 * Parses the Android SDK versions from a given source.
 * @param content The original source content.
 * @param configurationObject The `AndroidConfigurationObject` that contains the customized versions.
 * @returns The parsed content if any.
 */
export declare function parseSDKVersions(content: string, configurationObject?: Constants.AndroidConfigurationObject): string | undefined;
/**
 * A tagged replacement block.
 * @param tag The corresponding `ConfigurationTag`.
 * @param content The configuration block that replaces the last content.
 * @param content The content that has been replaced.
 * @returns The tagged replacement block.
 */
export declare function taggedReplacementBlock(tag: ConfigurationTag, content: string, previousContent: string): string;
/**
 * A tagged configuration block.
 * @param tag The corresponding `ConfigurationTag`.
 * @param content The configuration block.
 * @returns The tagged configuration block.
 */
export declare function taggedConfigurationBlock(tag: ConfigurationTag, content: string): string;
/**
 * Replaces the configuration block.
 * @param source The original input string that should be modified.
 * @param tag The corresponding `ConfigurationTag`.
 * @param replacement The replacement string.
 * @returns The modified source if a previous configuration header has been found, otherwise `null`.
 */
export declare function replaceTaggedConfiguration(source: string, tag: ConfigurationTag, replacement: string): string | undefined;
