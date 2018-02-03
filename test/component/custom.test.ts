import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { State as S, StateType } from 'type-safe-state-js';
import { Component, MVVM } from './../../src';

describe('Custom component type should work correctly', () => {
  type MinimalCustom<P> = {
    readonly props: P;
    readonly platform: Component.Platform.Case;
  };

  let testConnectState = (minimalComponent: MinimalCustom<{}>): void => {
    /// Setup
    let initial = Try.success(S.empty());
    let stateStream = new BehaviorSubject<Try<S.Type<any>>>(initial);
    let currentState: Nullable<StateType<any>> = undefined;

    let vm: MVVM.ViewModel.ReduxType = {
      screen: { id: '' },
      initialize: () => {},
      deinitialize: () => {},
      stateStream: (): Observable<Try<S.Type<any>>> => stateStream,
    };

    let component: Component.Custom.Type<{}, StateType<any>> = {
      ...minimalComponent,
      setState: (state: StateType<any>) => currentState = state,
    };

    switch (true) {
      case Component.Platform.isNative(component.platform):
        /// When && Then - native.
        let subscription2 = new Subscription();
        Component.Custom.connectState(component, vm, subscription2);
        expect(currentState).not.toHaveProperty('builder');
        subscription2.unsubscribe();
        break;

      default:
        /// When && Then - web.
        let subscription1 = new Subscription();
        Component.Custom.connectState(component, vm, subscription1);
        stateStream.next(Try.success(S.empty()));
        expect(currentState).toHaveProperty('builder');
        subscription1.unsubscribe();
    }
  };

  it('Connect state for custom web component should work correctly', () => {
    testConnectState({ props: {}, platform: Component.Platform.Case.WEB });
  });

  it('Connect state for custom native component should work correctly', () => {
    testConnectState({ props: {}, platform: Component.Platform.Case.NATIVE_COMMON });
  });
});