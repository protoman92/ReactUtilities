import { Try } from 'javascriptutilities';
import * as Platform from './../../component/Platform';
import { Android, iOS, NativeCommon, NativeInputType } from './native';
import * as Native from './native';
import * as Web from './web';
export { Android, iOS, NativeCommon, NativeInputType, Web };

/// Represent all possible input types, for both web and native components.
export type InputType = Web.Case | NativeInputType;

/**
 * Get all input types for a platform.
 * @param {Platform.Case} platform A Platform instance.
 * @returns {string[]} An Array of string.
 */
export let inputTypesForPlatform = (platform: Platform.Case): string[] => {
  switch (platform) {
    case Platform.Case.ANDROID: return Android.allValues();
    case Platform.Case.IOS: return iOS.allValues();
    case Platform.Case.NATIVE_COMMON: return NativeCommon.allValues();
    case Platform.Case.WEB: return Web.allValues();
    default: return [];
  }
};

/**
 * Check if an input type is allowed for a platform.
 * @param {Platform.Case} platform A Platform instance.
 * @param {string} type A string value.
 * @returns {boolean} A boolean value.
 */
export let isInputTypeForPlatform = (platform: Platform.Case, type: string): boolean => {
  switch (platform) {
    case Platform.Case.ANDROID: return Native.isAndroid(type);
    case Platform.Case.IOS: return Native.isIOS(type);
    case Platform.Case.NATIVE_COMMON: return Native.isCommon(type);
    case Platform.Case.WEB: return Web.isWeb(type);
    default: return false;
  }
};

/**
 * Refine an input type, and depending on the platform, default to a common
 * type if the specified type is not part of the allowed for said platform.
 * @param {Platform.Case} platform A Platform instance.
 * @param {string} type A string value.
 * @returns {Try<string>} A string value.
 */
export let refine = (platform: Platform.Case, type: string): Try<string> => {
  switch (platform) {
    case Platform.Case.NATIVE_COMMON:
      return Try.success(Native.isCommon(type) ? type : NativeCommon.Case.DEFAULT);

    case Platform.Case.ANDROID:
      return Try.success(Native.isAndroid(type) ? type : NativeCommon.Case.DEFAULT);

    case Platform.Case.IOS:
      return Try.success(Native.isIOS(type) ? type : NativeCommon.Case.DEFAULT);

    case Platform.Case.WEB:
      return Try.success(Web.isWeb(type) ? type : Web.Case.TEXT);

    default:
      return Try.failure(`Unknown platform ${platform}`);
  }
};