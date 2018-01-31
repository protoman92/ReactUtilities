import { Subscription } from 'rxjs';
import * as React from 'react';
import { Component, ComponentClass, ComponentType, ClassType } from 'react';
import { Nullable } from 'javascriptutilities';
import { State } from 'type-safe-state-js';
import { ReduxStore } from 'reactive-rx-redux-js';
import * as MVVM from './../mvvm';

export type Selector<T> = (state: State.Self<T>) => State.Self<T>;

export namespace WrapperProps {
  /**
   * Represent the prop types for Wrapper. Components that can be wrapped should
   * have their prop types implement this interface in order for the connect
   * method to work correctly.
   */
  export interface Type {
    viewModel: Readonly<WrapperViewModel.Type>;

    /**
     * It does not matter what state is passed in, it will be replaced by a
     * custom state by the wrapper component. This value is here to enforce
     * conformance for wrapped components' prop types.
     */
    wrappedState: Readonly<State.Self<any>>;
  }
}

export namespace WrapperViewModel {
  export interface Type extends MVVM.ViewModel.Type {
    provider: Readonly<ReduxStore.Provider.Type>;
  }

  /**
   * The Wrapper view model.
   * @implements {Type} View model implementation.
   */
  export class Self implements Type {
    public readonly provider: ReduxStore.Provider.Type;
    public readonly screen: Nullable<MVVM.Navigation.Screen.BaseType>;

    public constructor(viewModel: Type) {
      this.provider = viewModel.provider;
      this.screen = viewModel.screen;
    }

    public initialize = (): void => {};
    public deinitialize = (): void => {};
  }
}

/**
 * Wrap the outermost component with a custom component that listens to state
 * changes and updates children if necessary.
 *
 * We actually do not need a wrapper just for Redux-related state handling.
 * Instead, we can use the state stream directly to listen to state changes.
 *
 * @template P Props generics.
 * @template T Component generics.
 * @template C Component class generics.
 * @param {Selector<any>} [selector=(state: State.Self<any>) => state] Optional
 * state transform function. This allows us to select the specific substate to
 * mutate.
 * @returns {(fn: ClassType<P, T, C>) => ComponentType<P>} Function returning
 * the wrapper.
 */
export function connect<
  P extends WrapperProps.Type,
  T extends Component<P, State.Self<any>>,
  C extends ComponentClass<P>> (
  selector: Selector<any> = (state: State.Self<any>) => state,
): (fn: ClassType<P, T, C>) => ComponentType<P> {
  return (fn: ClassType<P, T, C>): ComponentType<P> => {
    return class Wrapper extends Component<P, State.Self<any>> {
      private readonly viewModel: WrapperViewModel.Self;
      private readonly subscription: Subscription;

      public constructor(props: P) {
        super(props);
        this.subscription = new Subscription();
        this.viewModel = new WrapperViewModel.Self(props.viewModel);
      }

      /**
       * In this lifecycle method, we initialize the store subscription and
       * deliver states whenever the stream emits an item.
       */
      public componentWillMount() {
        let store = this.viewModel.provider.store;

        store.stateStream()
          .map(v => selector(v))
          .doOnNext(v => this.setState(v))
          .subscribe()
          .toBeDisposedBy(this.subscription);
      }

      /**
       * Dispose of the subscription here.
       */
      public componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      public render(): JSX.Element {
        /// Wrapped components should define a state key in their prop type
        /// definitions, then access the state value to set their own states.
        let props = Object.assign({}, this.props, { wrappedState: this.state });
        return React.createElement<P, T, C>(fn, props);
      }
    };
  };
}