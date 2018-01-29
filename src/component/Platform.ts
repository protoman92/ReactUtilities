/**
 * Represents all possible platforms.
 */
export enum Case {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
  NATIVE_COMMON = 'native_common',
}

/**
 * Check a platform is native.
 * @param {Readonly<Case>} platform A Case instance.
 * @returns {boolean} A boolean value.
 */
export let isNative = (platform: Readonly<Case>): boolean => {
  switch (platform) {
    case Case.ANDROID:
    case Case.IOS:
    case Case.NATIVE_COMMON:
      return true;

    default: return false;
  }
};