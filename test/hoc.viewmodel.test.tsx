import {mount} from 'enzyme';
import {Numbers} from 'javascriptutilities';
import * as React from 'react';
import {ReactElement} from 'react';
import {Subject} from 'rxjs';
import {anything, instance, spy, verify, when} from 'ts-mockito-2';
import {ViewModelHOCHooks, withViewModel} from '../src/hoc.viewmodel';
import {
  indexDivClass,
  State,
  stateDivClass,
  transformState,
  ViewModel,
  ViewModelProps,
  ViewModelTestComponent,
} from './testcomponent';

describe('View model HOC should work correctly', () => {
  let viewModelHooks: ViewModelHOCHooks;
  let component: ReactElement<ViewModelProps>;
  let componentIndex: number;
  let viewModel: ViewModel;

  beforeEach(() => {
    viewModelHooks = spy({
      beforeViewModelCreated: () => {},
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withViewModel<ViewModel, ViewModelProps, State>(
      ViewModelTestComponent,
      {
        viewModelHooks: instance(viewModelHooks),
        createViewModel: props => (props.viewModelFactory as any)(),
      }
    );

    ViewModel.instance = -1;
    componentIndex = 1000;
    viewModel = spy(new ViewModel());

    component = (
      <HOCTestComponent
        index={componentIndex}
        viewModelFactory={() => instance(viewModel)}
      />
    );
  });

  it('Wrapping base component class with view model wrapper - should work', () => {
    /// Setup
    let mounted = mount(component);
    mounted.unmount();

    /// When && Then
    verify(viewModel.initialize()).once();
    verify(viewModel.deinitialize()).once();
    verify(viewModel.setUpStateCallback(anything())).once();
    verify(viewModelHooks.beforeViewModelCreated!()).once();
  });

  it('Mutating state in wrapper component - should re-render pure component', () => {
    /// Setup
    let times = 1000;
    let stateSb = new Subject<State>();

    when(viewModel.transformState(anything())).thenCall(state => {
      return transformState(state);
    });

    when(viewModel.setUpStateCallback(anything())).thenCall(callback => {
      stateSb.subscribe(state => callback(state));
    });

    let mounted = mount(component);

    Numbers.range(0, times).forEach(() => {
      /// When
      let newState: State = {
        a: Numbers.randomBetween(0, 1000),
        b: Numbers.randomBetween(0, 1000),
      };

      stateSb.next(newState);
      mounted.update();

      /// Then
      let indexDiv = mounted.find(`.${indexDivClass}`);
      let stateDiv = mounted.find(`.${stateDivClass}`);
      expect(indexDiv.text()).toEqual(`${componentIndex}`);
      expect(stateDiv.text()).toEqual(transformState(newState));
    });

    verify(viewModel.transformState(anything())).times(times + 1);
  });

  it('Updating component - should initialize view model only once', () => {
    let times = 1000;
    let mounted = mount(component);

    /// When
    Numbers.range(0, times).forEach(index => {
      mounted.setProps({index});
    });

    /// Then
    verify(viewModel.transformState(anything())).times(times + 1);
    expect(ViewModel.instance).toEqual(0);
  });
});
