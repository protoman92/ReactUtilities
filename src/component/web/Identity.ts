import { Indeterminate } from 'javascriptutilities';

/**
 * Common identification for shared custom components.
 */
export interface Type {
  /**
   * This will be translated to 'id'.
   * @type {Indeterminate<string>} Optional identity.
   */
  readonly id: Indeterminate<string>;

  /**
   * This will be translated to 'class'.
   * @type {Indeterminate<string>} Optional identity.
   */
  readonly className: Indeterminate<string>;
}