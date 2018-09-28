import {NeverProp} from 'javascriptutilities';
import * as React from 'react';
import {Observable} from 'rxjs';
import {ReduxViewModel, BasicDependency} from '../src';
export let indexDivClass = 'index-div';
export let stateDivClass = 'state-div';

export type State = Readonly<{a: number; b: number}>;

export function transformState({a, b}: NeverProp<State>) {
  return `${a}-${b}`;
}

export type Dependency = BasicDependency<State> &
  Readonly<{
    performInitialization: () => void;
    performCleanUp: () => void;
    stateStream: Observable<State>;
    transformState: (state: Partial<NeverProp<State>>) => string;
  }>;

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
export type DependencyProps = BaseProps & Readonly<{dependency: Dependency}>;

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

export function DependencyTestComponent(
  props: DependencyProps & Partial<NeverProp<State>>
) {
  return (
    <BaseTestComponent
      {...props}
      value={props.dependency.transformState(props)}
    />
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
