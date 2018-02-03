import { Types } from 'javascriptutilities';

/**
 * Represents a piece of progress-displaying information.
 */
export interface Type {
  readonly description: string;
}

export let isInstance = (object: any): object is Type => {
  return Types.isInstance(object, 'description');
};