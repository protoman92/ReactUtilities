import { Observable } from 'rxjs';
import { Try } from 'javascriptutilities';
import { State } from 'type-safe-state-js';

/**
 * Root model type.
 */
export interface RootType {}

/**
 * Provide the relevant state stream for the component state.
 * @extends {RootType} Root type extension.
 */
export interface ReduxType extends RootType {
  stateStream(): Observable<Try<State.Type<any>>>;
}