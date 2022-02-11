"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTaggedConfiguration = exports.taggedConfigurationBlock = void 0;
/** A tagged header for a configuration block. */
function taggedHeader(tag) {
    return `\n// IMG.LY CONFIGURATION - ${tag} - START\n`;
}
/** A tagged footer for a configuration block. */
function taggedFooter(tag) {
    return `\n// IMG.LY CONFIGURATION - ${tag} - END\n`;
}
/**
 * A tagged configuration block.
 * @param tag The corresponding `ConfigurationTag`.
 * @param content The configuration block.
 * @returns The tagged configuration block.
 */
function taggedConfigurationBlock(tag, content) {
    return `${taggedHeader(tag)}${content}${taggedFooter(tag)}`;
}
exports.taggedConfigurationBlock = taggedConfigurationBlock;
/**
 * Replaces the configuration block.
 * @param source The original input string that should be modified.
 * @param tag The corresponding `ConfigurationTag`.
 * @param replacement The replacement string.
 * @returns The modified source if a previous configuration header has been found, otherwise `null`.
 */
function replaceTaggedConfiguration(source, tag, replacement) {
    const header = taggedHeader(tag);
    if (source.match(header)) {
        const footer = taggedFooter(tag);
        const configurationBlock = source.substring(source.indexOf(header), source.lastIndexOf(footer) + footer.length);
        source = source.replace(configurationBlock, taggedConfigurationBlock(tag, replacement));
        return source;
    }
    return;
}
exports.replaceTaggedConfiguration = replaceTaggedConfiguration;
