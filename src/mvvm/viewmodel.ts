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
   * @param {{ setState: (state: StateType<any>) => void }} view A minimal slice
   * of React Components.
   */
  setUpStateChanges(view: { setState: (state: StateType<any>) => void }): void;
}

/**
 * Set up state changes listener for a view.
 * @param {{ setState: (state: StateType<any>) => void }} view A minimal slice
 * of React Components.
 * @param {Model.ReduxType} model A Redux-enabled model.
 * @param {Subscription} subscription A Subscription instance.
 */
export function setUpStateChanges(
  view: { setState: (state: StateType<any>) => void },
  model: Model.ReduxType,
  subscription: Subscription,
) {
  let disposable = model.stateStream
    .pipe(
      mapNonNilOrEmpty(v => v),
      distinctUntilChanged())
    .subscribe(v => view.setState(v));

  subscription.add(disposable);
}