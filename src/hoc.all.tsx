import * as React from 'react';
import { ComponentType } from 'react';
import { LifecycleHooksHOCOptions, withLifecycleHooks } from './hoc.lifecycle';
import { FactorifiedViewModelHOCProps, TargetViewModelHOCComponent, ViewModelHOCOptions, ViewModelHOCProps, withViewModel } from './hoc.viewmodel';

export type CompleteSetupHOCOptions<VM, Props extends ViewModelHOCProps<VM>> =
  LifecycleHooksHOCOptions &
  ViewModelHOCOptions<VM, Props>;

/**
 * Complete set up for a view model-based component.
 */
export function withCompleteSetup<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent: TargetViewModelHOCComponent<VM, Props, State>,
  options: CompleteSetupHOCOptions<VM, Props>,
): ComponentType<FactorifiedViewModelHOCProps<Props>> {
  // tslint:disable-next-line:variable-name
  let ViewModelHOC = withViewModel<VM, Props, State>(targetComponent, options);
  return withLifecycleHooks(ViewModelHOC, options);
}

/**
 * Replace complete setup HOC with this function.
 */
export function withTestCompleteSetup<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent: TargetViewModelHOCComponent<VM, Props, State>,
  _options: CompleteSetupHOCOptions<VM, Props>,
): ComponentType<FactorifiedViewModelHOCProps<Props>> {
  return function Wrapper(_props: FactorifiedViewModelHOCProps<Props>) {
    return React.createElement(targetComponent);
  };
}
