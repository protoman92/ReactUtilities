import {mount, shallow} from 'enzyme';
import {
  CompleteSetupHOCOptions,
  withCompleteSetup,
  withTestCompleteSetup,
} from 'hoc.all';
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

describe('Complete HOC should work correctly', () => {
  let lifecycleHooks: LifecycleHOCHooks;
  let completeOptions: CompleteSetupHOCOptions<ViewModel, ViewModelProps>;
  let component: ReactElement<ViewModelProps>;
  let viewModel: ViewModel;

  beforeEach(() => {
    viewModel = mock(ViewModel);

    lifecycleHooks = spy<LifecycleHOCHooks>({
      onConstruction: () => {},
      componentDidMount: () => {},
      componentWillUnmount: () => {},
    });

    completeOptions = spy<CompleteSetupHOCOptions<ViewModel, ViewModelProps>>({
      lifecycleHooks: instance(lifecycleHooks),
      checkEquality: deepEqual,
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withCompleteSetup<ViewModel, ViewModelProps, State>(
      ViewModelTestComponent,
      {
        ...instance(completeOptions),
        checkEquality: deepEqual,
        createViewModel: props => (props.viewModelFactory as any)(),
      }
    );

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

describe('Test complete HOC should work correctly', () => {
  let component: ReactElement<ViewModelProps>;
  let viewModel: ViewModel;

  beforeEach(() => {
    viewModel = mock(ViewModel);

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withTestCompleteSetup<
      ViewModel,
      ViewModelProps,
      State
    >(ViewModelTestComponent, {} as any);

    component = (
      <HOCTestComponent
        index={0}
        viewModelFactory={() => instance(viewModel)}
      />
    );
  });

  it('Wrapping base component class with complete wrapper - should work', () => {
    /// Setup
    let shallowed = shallow(component);

    /// When && Then
    expect(shallowed.find(ViewModelTestComponent)).toHaveLength(1);
    shallowed.unmount();
  });
});
