import * as React from 'react';
import { Component, ComponentClass, ClassType, ComponentType } from 'react';
import { Lifecycle } from './../component';

export type Selector = (id: string, lifecycle: Lifecycle.Case) => void;

/**
 * Wrap the outermost component with a custom component that listens to lifecycle
 * events.
 * @template P Props generics.
 * @template S State generics.
 * @template T Component generics.
 * @template C Component class generics.
 * @param {Selector} selector Lifecycle selector.
 * @returns {(fn: ClassType<P, T, C>) => ComponentType<P>} Function returning
 * the wrapper.
 */
export function trackLifecycle<
  P, S, T extends Component<P, S>, C extends ComponentClass<P>> (
  selector: Selector = (_e, _lifecycle) => console.log(`${_e}: ${_lifecycle}`),
): (fn: ClassType<P, T, C>) => ComponentType<P> {
  return (fn: ClassType<P, T, C>): ComponentType<P> => {
    return class Wrapper extends Component<P, S> {
      private get elementName(): string {
        return fn.displayName || fn.name;
      }

      public constructor(props: P) {
        super(props);
      }

      public componentWillMount() {
        selector(this.elementName, Lifecycle.Case.componentWillMount);
      }

      public componentDidMount() {
        selector(this.elementName, Lifecycle.Case.componentDidMount);
      }

      public componentWillUnmount() {
        selector(this.elementName, Lifecycle.Case.componentWillUnmount);
      }

      public render(): JSX.Element {
        return React.createElement<P, T, C>(fn, this.props);
      }
    };
  };
}