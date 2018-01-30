import { Collections } from 'javascriptutilities';

export namespace NativeCommon {
  /**
   * Input types for both Android and iOS RN components.
   */
  export enum Case {
    DEFAULT = 'default',
    NUMERIC = 'numeric',
    EMAIL = 'email-address',
    PHONE = 'phone-pad',
  }

  /**
   * Get all native common input types.
   * @returns {Case[]} An Array of Case.
   */
  export let allValues = (): Case[] => {
    return [
      Case.DEFAULT,
      Case.NUMERIC,
      Case.EMAIL,
      Case.PHONE,
    ];
  };
}

export namespace Android {
  /**
   * Input types for Android RN components.
   */
  export enum Case {
    VISIBLE_PASSWORD = 'visible-password',
  }

  /**
   * Get all Android input types.
   * @returns {Case[]} An Array of Case.
   */
  export let allValues = (): Case[] => {
    return [Case.VISIBLE_PASSWORD];
  };
}

export namespace iOS {
  export enum Case {
    ASCII_CAPABLE = 'ascii-capable',
    NUMBERS_AND_PUNCTUATION = 'numbers-and-punctuation',
    URL = 'url',
    NUMBER_PAD = 'number-pad',
    NAME_PHONE_PAD = 'name-phone-pad',
    DECIMAL_PAD = 'decimal-pad',
    TWITTER = 'twitter',
    WEB_SEARCH = 'web-search',
  }

  /**
   * Get all iOS input types.
   * @returns {Case[]} An Array of Case.
   */
  export let allValues = (): Case[] => {
    return [
      Case.ASCII_CAPABLE,
      Case.NUMBERS_AND_PUNCTUATION,
      Case.URL,
      Case.NUMBER_PAD,
      Case.NAME_PHONE_PAD,
      Case.DECIMAL_PAD,
      Case.TWITTER,
      Case.WEB_SEARCH,
    ];
  };
}

/**
 * Check if an input is common to both Android and iOS native components.
 * @param {string} type A string value.
 * @returns {boolean} A boolean value.
 */
export let isCommon = (type: string): boolean => {
  return Collections.contains(NativeCommon.allValues(), type);
};

/**
 * Check if an input is applicable to an Android RN component.
 * @param {string} type A string value.
 * @returns {boolean} A boolean value.
 */
export let isAndroid = (type: string): boolean => {
  return Collections.contains(Android.allValues(), type) || isCommon(type);
};

/**
 * Check if an input is applicable to an iOS RN component.
 * @param {string} type A string value.
 * @returns {boolean} A boolean value.
 */
export let isIOS = (type: string): boolean => {
  return Collections.contains(iOS.allValues(), type) || isCommon(type);
};

/// Represents all possible native input types.
export type NativeInputType = NativeCommon.Case | Android.Case | iOS.Case;