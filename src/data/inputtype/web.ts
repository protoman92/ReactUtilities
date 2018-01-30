import { Collections } from 'javascriptutilities';

/**
 * Represents all possible input types for a web-based input component.
 */
export enum Case {
  CHECK_BOX = 'checkbox',
  COLOR = 'color',
  DATE = 'date',
  EMAIL = 'email',
  NUMBER = 'number',
  PASSWORD = 'password',
  TEXT = 'text',
  URL = 'url',
}

/**
 * Get all web input types.
 * @returns {Case[]} An Array of Case.
 */
export let allValues = (): Case[] => {
  return [
    Case.CHECK_BOX,
    Case.COLOR,
    Case.DATE,
    Case.EMAIL,
    Case.NUMBER,
    Case.PASSWORD,
    Case.TEXT,
    Case.URL,
  ];
};

/**
 * Check if an input is usable for a web component.
 * @param {string} type A string value.
 * @returns {boolean} A boolean value.
 */
export let isWeb = (type: string): boolean => {
  return Collections.contains(allValues(), type);
};