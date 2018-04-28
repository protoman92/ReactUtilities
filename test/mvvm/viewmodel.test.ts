import { BehaviorSubject, Subscription } from 'rxjs';
import { Try, Numbers } from 'javascriptutilities';
import { StateType } from 'type-safe-state-js';
import { MVVM } from './../../src';

describe(`View model utilities should be implemented correctly`, () => {
  let iterations = 1000;

  it(`Set up state listener - should work`, () => {
    /// Setup
    let currentState: StateType<any> = {};
    let previousState = currentState;
    let stateSb = new BehaviorSubject(Try.success(currentState));
    let subscription = new Subscription();

    let view = {
      setState: (state: StateType<any>): void => {
        currentState = state;
      },
    };

    let model: MVVM.Model.ReduxType = {
      stateStream: stateSb.asObservable(),
    };

    MVVM.ViewModel.setUpStateChanges(view, model, subscription);

    /// When && Then
    Numbers.range(0, iterations).forEach(v => {
      stateSb.next(Try.failure(''));
      expect(currentState).toEqual(previousState);
      stateSb.next(Try.success({ a: v }));
      expect(currentState).toEqual({ a: v });
      previousState = currentState;
    });
  });
});