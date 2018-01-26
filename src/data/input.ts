import { Indeterminate } from 'javascriptutilities';

/**
 * Represents a input header, each of which should be associated with a fixed
 * set of input items.
 */
export interface Header {
  title: string;
  confirmTitle: string;
  allInputs(): Type[];
}

/**
 * Represents an input item.
 */
export interface Type {
  id: string;
  placeholder: Indeterminate<string>;
}