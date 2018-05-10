import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { mapNonNilOrEmpty } from 'rx-utilities-js';
import { StateType } from 'type-safe-state-js';
import * as Model from './model';

/**
 * Root view model type.
 */
export interface RootType {
  initialize(): void;
  deinitialize(): void;
}

/**
 * Provide the relevant state stream for the component state.
 * @extends {RootType} Root type extension.
 */
export interface ReduxType extends RootType {
  /**
   * Listen to state changes.
   * @param {(state: StateType<any>) => void} callback A state callback.
   */
  setUpStateCallback(callback: (state: StateType<any>) => void): void;
}

/**
 * Set up state callback.
 * @param {(state: StateType<any>) => void} callback A state callback.
 * @param {Model.ReduxType} model A Redux-enabled model.
 * @param {Subscription} subscription A Subscription instance.
 */
export function setUpStateCallback(
  callback: (state: StateType<any>) => void,
  model: Model.ReduxType,
  subscription: Subscription,
) {
  subscription.add(model.stateStream
    .pipe(mapNonNilOrEmpty(v => v), distinctUntilChanged())
    .subscribe(v => callback(v)));
}