import * as React from 'react';
import { Nullable } from 'javascriptutilities';
import { State } from 'type-safe-state-js';
import { ReduxStore } from 'reactive-rx-redux-js';
import { Connector, MVVM } from './../../../src';

export namespace App {
  export interface PropType extends Connector.Redux.WrapperProps.Type {
    viewModel: ViewModel;
  }

  export class ViewModel implements Connector.Redux.WrapperViewModel.Type {
    public provider: ReduxStore.Provider.Type;
    private _renderCount: number;

    public get screen(): Readonly<Nullable<MVVM.Navigation.Screen.BaseType>> {
      return undefined;
    }

    public get renderCount(): number {
      return this._renderCount;
    }

    public constructor(provider: ReduxStore.Provider.Type) {
      this.provider = provider;
      this._renderCount = 0;
    }

    public initialize = (): void => {};
    public deinitialize = (): void => {};

    public incrementRenderCount = (): void => {
      this._renderCount += 1;
    }

    public scrapViewModel = (): Scrap.ViewModel => {
      return new Scrap.ViewModel(this.provider);
    }
  }

  export class Component extends React.Component<PropType, State.Self<any>> {
    private viewModel: ViewModel;

    public constructor(props: PropType) {
      super(props);
      this.viewModel = props.viewModel;
    }

    public render(): JSX.Element {
      this.viewModel.incrementRenderCount();
      let scrapVM = this.viewModel.scrapViewModel();
      let props = { viewModel: scrapVM, wrappedState: State.empty<any>() };

      let wrapped = Connector.Redux.connect(v => {
        return v.substateAtNode(Scrap.substatePath).getOrElse(State.empty());
      })(Scrap.Component);

      return React.createElement(wrapped, props);
    }
  }
}

export namespace Scrap {
  export let substatePath = 'a.b';
  export let nodeValuePath = 'c';
  export let fullValuePath = `${substatePath}.${nodeValuePath}`;
  export let className = 'scrap';
  export let classNameD = `.${className}`;
  export let h1ClassName = 'h1value';
  export let h1ClassNameD = `.${h1ClassName}`;

  export interface PropType extends Connector.Redux.WrapperProps.Type {
    viewModel: ViewModel;
  }

  export class ViewModel implements Connector.Redux.WrapperViewModel.Type {
    public provider: ReduxStore.Provider.Type;

    public get screen(): Readonly<Nullable<MVVM.Navigation.Screen.BaseType>> {
      return undefined;
    }

    public constructor(provider: ReduxStore.Provider.Type) {
      this.provider = provider;
    }

    public initialize = (): void => {};
    public deinitialize = (): void => {};
  }

  export class Component extends React.Component<PropType, State.Self<any>> {
    public constructor(props: PropType) {
      super(props);
    }

    public render(): JSX.Element {
      return (
        <div className={className}><h1 className={h1ClassName}>
          {this.props.wrappedState.valueAtNode(nodeValuePath).getOrElse('')}
        </h1></div>
      );
    }
  }
}