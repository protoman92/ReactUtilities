import { Types } from 'javascriptutilities';

/**
 * Represents a country code.
 */
export interface Type {
  name: string;
  code: string;
  callingCode: string;
}

/**
 * Check if an object is a country code.
 * @param {*} object Any object.
 * @returns {object is Type} A boolean value.
 */
export let isInstance = (object: any): object is Type => {
  return Types.isInstance(object, 'name', 'code', 'callingCode');
};