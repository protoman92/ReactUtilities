import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Try } from 'javascriptutilities';
import { State as S, StateType } from 'type-safe-state-js';
import { Component, MVVM } from './../../src';

describe('Custom component type should work correctly', () => {
  it('Connect state for custom component should work correctly', () => {
    /// Setup
    let initial = Try.success(S.empty());
    let stateStream = new BehaviorSubject<Try<S.Self<any>>>(initial);
    let currentState: any = undefined;

    let vm: MVVM.ViewModel.ReduxType = {
      screen: { id: '', relativePath: '', },
      initialize: () => {},
      deinitialize: () => {},
      stateStream: (): Observable<Try<S.Self<any>>> => stateStream,
    };

    let component: Component.Custom.Type<{}, StateType<any>> = {
      props: {},
      platform: Component.Platform.Case.WEB,
      setState: (state: StateType<any>) => currentState = state,
    };

    /// When - web && Then
    let subscription1 = new Subscription();
    Component.Custom.connectState(component, vm, subscription1);
    stateStream.next(Try.success(S.empty()));
    expect(currentState instanceof S.Self).toBeTruthy();
    subscription1.unsubscribe();

    /// When - native && Then.
    let subscription2 = new Subscription();
    component.platform = Component.Platform.Case.NATIVE_COMMON;
    Component.Custom.connectState(component, vm, subscription2);
    expect(currentState instanceof S.Self).toBeFalsy();
    subscription2.unsubscribe();
  });
});