import { ConfigPlugin } from '@expo/config-plugins';
/** Applies all needed native configurations. */
declare const withReactNativeIMGLY: ConfigPlugin<{
    android?: {
        version?: string;
        modules?: [string];
    };
} | void>;
export default withReactNativeIMGLY;
