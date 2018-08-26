import { NullableKV, Omit } from 'javascriptutilities';
import { ComponentType, StatelessComponent } from 'react';
import { LifecycleHooksHOCOptions, withLifecycleHooks } from './hoc.lifecycle';
import { ViewModelFactoryHOCProps, ViewModelHOCOptions, ViewModelHOCProps, withViewModel } from './hoc.viewmodel';

export type CompleteSetupHOCOptions<VM, Props extends ViewModelHOCProps<VM>> =
  LifecycleHooksHOCOptions &
  ViewModelHOCOptions<VM, Props>;

/**
 * Complete set up for a view model-based component.
 */
export function withCompleteSetup<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent:
    StatelessComponent<Props & Partial<NullableKV<State>>> |
    ComponentType<Props & Partial<NullableKV<State>>>,
  options: CompleteSetupHOCOptions<VM, Props>,
): ComponentType<Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps> {
  // tslint:disable-next-line:variable-name
  let ViewModelHOC = withViewModel<VM, Props, State>(targetComponent, options);
  return withLifecycleHooks(ViewModelHOC, options);
}
