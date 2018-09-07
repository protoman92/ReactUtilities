import {NeverProp} from 'javascriptutilities';
import * as React from 'react';
import {ReduxViewModel} from '../src';

export let indexDivClass = 'index-div';
export let stateDivClass = 'state-div';

export interface State {
  readonly a: number;
  readonly b: number;
}

export function transformState({a, b}: NeverProp<State>) {
  return `${a}-${b}`;
}

export class ViewModel implements ReduxViewModel<State> {
  public static instance: number;

  public constructor() {
    ViewModel.instance += 1;
  }

  public initialize() {}
  public deinitialize() {}
  public setUpStateCallback(_callback: (state: State) => void) {}
  public transformState(_state: Partial<NeverProp<State>>): string {
    return '';
  }
}

export interface Props {
  readonly index: number;
  readonly callback?: () => void;
  readonly viewModel: ViewModel;
}

// tslint:disable-next-line:variable-name
export function TestComponent(props: Props & Partial<NeverProp<State>>) {
  return (
    <div>
      <div className={indexDivClass}>{props.index}</div>
      <div className={stateDivClass}>
        {props.viewModel.transformState(props)}
      </div>
    </div>
  );
}
