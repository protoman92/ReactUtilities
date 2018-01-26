import { Observable } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { State } from 'typesafereduxstate-js';
import * as Navigation from './../navigation';

export interface Type {
  screen: Readonly<Nullable<Navigation.Screen.Type>>;
  initialize(): void;
  deinitialize(): void;
}

/**
 * Provide the relevant state stream for the component state.
 * @extends {Type} Type extension.
 */
export interface ReduxType extends Type {
  stateStream(): Observable<Try<State.Self<any>>>;
}