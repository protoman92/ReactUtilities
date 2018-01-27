import { Try } from 'javascriptutilities';
import * as Web from './../../web';

export namespace Identity {
  /**
   * Identity for error display component.
   * @extends {Common.Identity.Type} Common identity extension.
   */
  export interface Type extends Web.Identity.Type {}

  /**
   * Identity for error display container component.   
   * @extends {Web.Identity.Type} Web identity extension.
   */
  export interface ContainerType extends Web.Identity.Type {}

  /**
   * Selector for error display identity, based on whether there is error to
   * display.
   */
  export interface SelectorType {
    identity(enabled: boolean): Try<Type>;
    containerIdentity(enabled: boolean): Try<ContainerType>;
  }

  /**
   * Provide identity for error display component.
   */
  export interface ProviderType {
    error?: SelectorType;
  }

  /**
   * Create a default identity selector.
   * @returns {SelectorType} A SelectorType instance.
   */
  export let createDefaultSelector = (): SelectorType => {
    return {
      containerIdentity: (): Try<ContainerType> => {
        return Try.success({
          id: undefined,
          className: 'error-display-container display-container',
        });
      },
    
      identity: (enabled: boolean): Try<Type> => {
        let common = 'error-display';

        if (enabled) {
          return Try.success({ id: undefined, className: common });
        } else {
          return Try.success({
            id: undefined,
            className: `error-display-hidden ${common}`,
          });
        }
      },
    };
  };
}