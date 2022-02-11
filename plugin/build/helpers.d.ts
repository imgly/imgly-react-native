import { ConfigurationTag } from './constants';
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
