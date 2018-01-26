import { Indeterminate } from 'javascriptutilities';

/**
 * Common identification for shared custom components.
 */
export interface Type {
  /**
   * This will be translated to 'id'.
   * @type {Indeterminate<string>} Optional identity.
   */
  id: Indeterminate<string>;

  /**
   * This will be translated to 'class'.
   * @type {Indeterminate<string>} Optional identity.
   */
  className: Indeterminate<string>;
}