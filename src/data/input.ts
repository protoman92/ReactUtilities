import { Indeterminate } from 'javascriptutilities';

/**
 * Represents a input header, each of which should be associated with a fixed
 * set of input items.
 */
export interface Header {
  readonly title: string;
  readonly confirmTitle: string;
  allInputs(): Type[];
}

/**
 * Represents an input item.
 */
export interface Type {
  readonly id: string;
  readonly placeholder: Indeterminate<string>;
}