import { Observable } from 'rxjs';
import { Indeterminate, Try } from 'javascriptutilities';
import { State } from 'type-safe-state-js';
import * as Navigation from './navigation';

/**
 * Root view model type.
 */
export interface RootType {
  readonly screen: Indeterminate<Navigation.Screen.RootType>;
  initialize(): void;
  deinitialize(): void;
}

/**
 * Provide the relevant state stream for the component state.
 * @extends {RootType} Root type extension.
 */
export interface ReduxType extends RootType {
  stateStream(): Observable<Try<State.Type<any>>>;
}