import { Nullable, JSObject } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';

/**
 * Represents a component that can display state of a certain type. We need this
 * interface because for React, state assignment is done via Object.assign(), so
 * if we use the type-safe State, ReactNative will throw Error since it does not
 * support assigning for this state type. As a result, we will have to convert
 * the type-safe state to a normal key-value object first before setting state
 * for a ReactNative component.
 * @template ST The state type.
 * @template T The type-safe state generics.
 */
export interface Type<ST, T> {
  /**
   * Convert from a type-safe state object to S.
   * @param {Nullable<S.Self<T>>} state A State instance.
   * @returns {ST} A ST instance.
   */
  convertTypeSafeStateToState(state: Nullable<S.Self<T>>): ST;

  /**
   * Convert from a S state to a type-safe state.
   * @param {Nullable<ST>} state A ST instance.
   * @returns {S.Self<T>} A State instance.
   */
  convertStateToTypeSafeState(state: Nullable<ST>): S.Self<T>;
}

export function convertJSObject<T>(state: Nullable<JSObject<T>>): S.Self<T> {
  return state !== undefined && state !== null ? S.fromKeyValue(state) : S.empty<T>();
}

export function convertToJSObject<T>(state: Nullable<S.Self<T>>): JSObject<T> {
  return state !== undefined && state !== null ? state.flatten() : {};
}