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

export type BaseProps = Readonly<{index: number; callback?: () => void}>;

export type ViewModelProps = BaseProps &
  Readonly<{
    viewModel: ViewModel;
  }>;

export function BaseTestComponent({
  index,
  value,
}: BaseProps & Readonly<{value: string}>) {
  return (
    <div>
      <div className={indexDivClass}>{index}</div>
      <div className={stateDivClass}>{value}</div>
    </div>
  );
}

export function ViewModelTestComponent(
  props: ViewModelProps & Partial<NeverProp<State>>
) {
  return (
    <BaseTestComponent
      {...props}
      value={props.viewModel.transformState(props)}
    />
  );
}
