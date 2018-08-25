import { NullableKV } from 'javascriptutilities';
import { ReduxViewModel } from '../src';
import { Component } from 'react';
import * as React from 'react';

export let indexDivClass = 'index-div';
export let stateDivClass = 'state-div';

export interface State {
  readonly a: number;
  readonly b: number;
}

export function transformState({ a, b }: NullableKV<State>) {
  return `${a}-${b}`;
}

export class ViewModel implements ReduxViewModel<State> {
  public static instance: number;

  public constructor() {
    ViewModel.instance += 1;
  }

  public initialize() { }
  public deinitialize() { }
  public setUpStateCallback(_callback: (state: State) => void) { }
  public transformState(_state: NullableKV<State>): string { return ''; }
}

export interface Props {
  readonly index: number;
  readonly viewModel: ViewModel;
}

export class TestComponent extends Component<Props & NullableKV<State>, never> {
  public render() {
    return <div>
      <div className={indexDivClass}>{this.props.index}</div>
      <div className={stateDivClass}>
        {this.props.viewModel.transformState(this.props)}
      </div>
    </div>;
  }
}
