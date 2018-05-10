import { BehaviorSubject, Subscription } from 'rxjs';
import { Try, Numbers } from 'javascriptutilities';
import { StateType } from 'type-safe-state-js';
import { mvvm } from './../../src';

describe(`View model utilities should be implemented correctly`, () => {
  let iterations = 1000;

  it(`Set up state listener - should work`, () => {
    /// Setup
    let currentState: StateType<any> = {};
    let previousState = currentState;
    let stateSb = new BehaviorSubject(Try.success(currentState));
    let subscription = new Subscription();

    let callback = (state: StateType<any>): void => {
      currentState = state;
    };

    let model: mvvm.model.ReduxType = {
      stateStream: stateSb.asObservable(),
    };

    mvvm.viewmodel.setUpStateCallback(callback, model, subscription);

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