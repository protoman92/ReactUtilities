import { State } from 'type-safe-state-js';

/**
 * Represents a component that can display state of a certain type. We need this
 * interface because for React, state assignment is done via Object.assign(), so
 * if we use the type-safe State, ReactNative will throw Error since it does not
 * support assigning for this state type. As a result, we will have to convert
 * the type-safe state to a normal key-value object first before setting state
 * for a ReactNative component.
 * @template S The state type.
 * @template T The type-safe state generics.
 */
export interface Type<S, T> {
  /**
   * Convert from a type-safe state object to S.
   * @param {State.Self<T>} state A State instance.
   * @returns {S} A S instance.
   */
  convertTypeSafeStateToState(state: State.Self<T>): S;

  /**
   * Convert from a S state to a type-safe state.
   * @param {S} state An S instance.
   * @returns {State.Self<T>} A State instance.
   */
  convertStateToTypeSafeState(state: S): State.Self<T>;
}