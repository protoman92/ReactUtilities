import { Component, Data } from './../../src';

let InputType = Data.InputType;
type Platform = Component.Platform.Case;

describe('Refining input types should work correctly', () => {
  let testPlatformInputType = (platform: Platform, def: string, ...cases: string[]): void => {
    cases.forEach(type => {
      /// Setup
      let refined = InputType.refine(platform, type).getOrThrow();

      /// When & Then
      if (InputType.isInputTypeForPlatform(platform, type)) {
        expect(refined).toBe(type);
      } else {
        expect(refined).toBe(def);
      }
    });
  };

  it('Refine input types for platform - should work correctly', () => {
    let allInputs: string[] = (<string[]>[])
      .concat(InputType.Web.allValues())
      .concat(InputType.Android.allValues())
      .concat(InputType.iOS.allValues())
      .concat(InputType.NativeCommon.allValues());

    let defNative = InputType.NativeCommon.Case.DEFAULT;
    let defWeb = InputType.Web.Case.TEXT;
    testPlatformInputType(Component.Platform.Case.ANDROID, defNative, ...allInputs);
    testPlatformInputType(Component.Platform.Case.IOS, defNative, ...allInputs);
    testPlatformInputType(Component.Platform.Case.NATIVE_COMMON, defNative, ...allInputs);
    testPlatformInputType(Component.Platform.Case.WEB, defWeb, ...allInputs);
  });
});