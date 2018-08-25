import { NullableKV } from 'javascriptutilities';
import * as React from 'react';
import { ReduxViewModel } from '../src';

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

export function TestComponent(props: Props & NullableKV<State>) {
  return <div>
    <div className={indexDivClass}>{props.index}</div>
    <div className={stateDivClass}>
      {props.viewModel.transformState(props)}
    </div>
  </div>;
}
