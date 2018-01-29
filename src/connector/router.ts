import * as React from 'react';
import { Component, ComponentElement, ComponentType, ClassAttributes } from 'react';
import * as ReactRouter from 'react-router';
import { RouteComponentProps } from 'react-router';

export type CElement<P> = ComponentElement<P, Component<P, {}>>;

/**
 * Retrofit a component to include a router in its props.
 * @template O Generics parameter.
 * @template P Props generics.
 * @template T Component generics.
 * @param {ComponentType<P & RouteComponentProps<{}>>} element The element to
 * be wrapped.
 * @param {(ClassAttributes<T> & P)} props The props to be added.
 * @returns {CElement<Pick<RouteComponentProps<O>, never>>} A CElement instance.
 */
export function retrofit<O, P, T extends Component<P & RouteComponentProps<O>, {}>>(
  element: ComponentType<P & RouteComponentProps<{}>>,
  props: ClassAttributes<T> & P,
): CElement<Pick<RouteComponentProps<O>, never>> {
  let cwr = ReactRouter.withRouter<any>(element);
  return React.createElement(cwr, props);
}