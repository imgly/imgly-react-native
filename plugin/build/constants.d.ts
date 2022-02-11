/** Tags for the config plugin. */
export declare enum ConfigurationTag {
    Multidex = "MULTIDEX",
    MultidexConfig = "MULTIDEX_CONFIG",
    Modules = "MODULES",
    Repos = "REPOS",
    Maven = "MAVEN"
}
export declare function replacementForTag(tag: ConfigurationTag, userInfo?: any): string;
/** The multidex declaration for the `MainApplication.java`. */
export declare const multidex = "class MainApplication extends Application";
/** The modules for the android/app/build.gradle. */
export declare const imgly_config_regex = "apply plugin: \"com.android.application\"";
