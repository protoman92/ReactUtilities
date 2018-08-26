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
