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
exports.replaceTaggedConfiguration = exports.taggedConfigurationBlock = exports.taggedReplacementBlock = exports.parseSDKVersions = exports.previousContent = void 0;
const constants_1 = require("./constants");
const Constants = __importStar(require("./constants"));
/** A tagged header for a configuration block. */
function taggedHeader(tag) {
    return `\n// IMG.LY CONFIGURATION - ${tag} - START\n`;
}
/** A tagged footer for a configuration block. */
function taggedFooter(tag) {
    return `\n// IMG.LY CONFIGURATION - ${tag} - END\n`;
}
/** The indicator for the replacement content start. */
const replacementContentStart = "// IMG.LY - PREVIOUS CONTENT - START";
/** The indicator for the replacement content end. */
const replacementContentEnd = "// IMG.LY - PREVIOUS CONTENT - END";
/** A tagged header for a replacement configuration block. */
function replacementBody(previousContent) {
    return `//\n// THIS SECTION HAS BEEN REPLACED BY THE IMG.LY SDK. THE PREVIOUS STATE\n// CAN BE FOUND BELOW:\n//\n${replacementContentStart}\n// ------------------\n${previousContent}\n// ------------------\n${replacementContentEnd}\n`;
}
/**
 * Retrieves the previous content for a given `ConfigurationTag`.
 * @param tag The `ConfigurationTag` of which to fetch the previous state.
 * @param content The original content of the file.
 * @returns The previous content if any.
 */
function previousContent(tag, content) {
    if (tag == constants_1.ConfigurationTag.SDKVersions) {
        const versionsRegex = /(^[\s]*)\bext\s*{([^}]*)}$/gm;
        const previousContent = content.match(versionsRegex);
        if (previousContent != null) {
            const parsedPreviousContent = previousContent[0];
            return parsedPreviousContent;
        }
    }
    return;
}
exports.previousContent = previousContent;
/**
 * Parses the Android SDK versions from a given source.
 * @param content The original source content.
 * @param configurationObject The `AndroidConfigurationObject` that contains the customized versions.
 * @returns The parsed content if any.
 */
function parseSDKVersions(content, configurationObject) {
    var _a, _b, _c, _d;
    let source = previousContent(constants_1.ConfigurationTag.SDKVersions, content);
    if (source != null) {
        const buildToolsRegEx = /\bbuildToolsVersion\s*=\s*"([0-9]*).([0-9]*).([0-9]*)"$/gm;
        const minSdkVersionRegEx = /\bminSdkVersion\s*=\s*([0-9]*)$/gm;
        const compileSdkVersionRegEx = /\bcompileSdkVersion\s*=\s*([0-9]*)$/gm;
        const targetSdkVersionRegEx = /\btargetSdkVersion\s*=\s*([0-9]*)$/gm;
        const newBuildTools = `buildToolsVersion = "${(_a = configurationObject === null || configurationObject === void 0 ? void 0 : configurationObject.buildToolsVersion) !== null && _a !== void 0 ? _a : Constants.defaultBuildToolsVersion}"`;
        const newMinSdkVersion = `minSdkVersion = ${(_b = configurationObject === null || configurationObject === void 0 ? void 0 : configurationObject.minSdkVersion) !== null && _b !== void 0 ? _b : Constants.defaultMinSdkVersion}`;
        const newCompileSdkVersion = `compileSdkVersion = ${(_c = configurationObject === null || configurationObject === void 0 ? void 0 : configurationObject.compileSdkVersion) !== null && _c !== void 0 ? _c : Constants.defaultCompileSdkVersion}`;
        const newTargetSdkVersion = `targetSdkVersion = ${(_d = configurationObject === null || configurationObject === void 0 ? void 0 : configurationObject.targetSdkVersion) !== null && _d !== void 0 ? _d : Constants.defaultTargetSdkVersion}`;
        source = source.replace(buildToolsRegEx, newBuildTools);
        source = source.replace(minSdkVersionRegEx, newMinSdkVersion);
        source = source.replace(compileSdkVersionRegEx, newCompileSdkVersion);
        source = source.replace(targetSdkVersionRegEx, newTargetSdkVersion);
        return source;
    }
    return;
}
exports.parseSDKVersions = parseSDKVersions;
/**
 * A tagged replacement block.
 * @param tag The corresponding `ConfigurationTag`.
 * @param content The configuration block that replaces the last content.
 * @param content The content that has been replaced.
 * @returns The tagged replacement block.
 */
function taggedReplacementBlock(tag, content, previousContent) {
    return `${taggedHeader(tag)}${replacementBody(previousContent)}${content}${taggedFooter(tag)}`;
}
exports.taggedReplacementBlock = taggedReplacementBlock;
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
        let configurationBlock = source.substring(source.indexOf(header) + header.length, source.lastIndexOf(footer));
        if (tag == constants_1.ConfigurationTag.SDKVersions) {
            const replacementBlock = source.substring(source.indexOf(`${replacementContentEnd}\n`) +
                `${replacementContentEnd}\n`.length, source.lastIndexOf(footer));
            configurationBlock = replacementBlock;
        }
        source = source.replace(configurationBlock, replacement);
        return source;
    }
    return;
}
exports.replaceTaggedConfiguration = replaceTaggedConfiguration;
