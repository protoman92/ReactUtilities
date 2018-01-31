import { Subscription } from 'rxjs';
import { StateType } from 'type-safe-state-js';
import * as MVVM from './../mvvm';
import * as Platform from './Platform';

/**
 * Custom component that provides additional functionalities.
 * @template P Props generics.
 * @template S State generics.
 */
export interface Type<P, S> {
  props: P;

  /**
   * Get the platform this component is built for.
   */
  platform: Readonly<Platform.Case>;
  setState(state: S, callback?: () => void): void;
}

/**
 * Connect the state stream and set state for a component. Beware that native
 * components will require some prior processing of the state object before we
 * can call setState(), because ReactNative does not allow Object.assign on a
 * custom state object that has an enumerable key in its prototype chain. This
 * is their design decision so we need to work around it here.
 * @template P Props generics.
 * @template VM Redux view model generics.
 * @param {Type<P, StateType<any>>} component A Type instance.
 * @param {VM} viewModel A VM instance.
 * @param {Subscription} subscription A Subscription instance.
 */
export function connectState<P, VM extends MVVM.ViewModel.ReduxType>(
  component: Type<P, StateType<any>>,
  viewModel: VM,
  subscription: Subscription,
): void {
  /// If this platform is native, we need to convert the state object to a
  /// normal key-value JSObject, because of RN's policy on Object.assign.
  let isNative = Platform.isNative(component.platform);

  viewModel.stateStream()
    .mapNonNilOrEmpty(v => v)
    .distinctUntilChanged()
    .map(v => isNative ? v.flatten() : v)
    .doOnNext(v => component.setState(v))
    .subscribe()
    .toBeDisposedBy(subscription);
}