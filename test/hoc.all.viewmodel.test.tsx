import {mount} from 'enzyme';
import {
  CompleteViewModelSetupHOCOptions,
  withCompleteViewModelSetup,
} from 'hoc.all.viewmodel';
import {LifecycleHOCHooks} from 'hoc.lifecycle';
import {Numbers} from 'javascriptutilities';
import * as React from 'react';
import {ReactElement} from 'react';
import {anything, instance, mock, spy, verify} from 'ts-mockito-2';
import {
  State,
  ViewModel,
  ViewModelProps,
  ViewModelTestComponent,
} from './testcomponent';
let deepEqual = require('deep-equal');

describe('Complete view model HOC should work correctly', () => {
  let lifecycleHooks: LifecycleHOCHooks;
  let completeOptions: CompleteViewModelSetupHOCOptions<
    ViewModel,
    ViewModelProps
  >;
  let component: ReactElement<ViewModelProps>;
  let viewModel: ViewModel;

  beforeEach(() => {
    viewModel = mock(ViewModel);

    lifecycleHooks = spy<LifecycleHOCHooks>({
      onConstruction: () => {},
      componentDidMount: () => {},
      componentWillUnmount: () => {},
    });

    completeOptions = spy<
      CompleteViewModelSetupHOCOptions<ViewModel, ViewModelProps>
    >({
      lifecycleHooks: instance(lifecycleHooks),
      checkEquality: deepEqual,
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withCompleteViewModelSetup<
      ViewModel,
      ViewModelProps,
      State
    >(ViewModelTestComponent, {
      ...instance(completeOptions),
      checkEquality: deepEqual,
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    component = (
      <HOCTestComponent
        index={0}
        viewModelFactory={() => instance(viewModel)}
      />
    );
  });

  it('Wrapping base component class with complete wrapper - should work', () => {
    /// Setup
    let mounted = mount(component);
    mounted.unmount();

    /// When && Then
    verify(viewModel.initialize()).once();
    verify(viewModel.deinitialize()).once();
    verify(viewModel.setUpStateCallback(anything())).once();
    verify(lifecycleHooks.onConstruction!()).once();
    verify(lifecycleHooks.componentDidMount!()).once();
    verify(lifecycleHooks.componentWillUnmount!()).once();
  });

  it('Triggering updates - should filter duplicate props', () => {
    /// Setup
    let mounted = mount(component);

    /// When
    Numbers.range(0, 1000).forEach(() => mounted.setProps({index: 0}));

    /// Then
    verify(viewModel.transformState(anything())).once();
  });
});
