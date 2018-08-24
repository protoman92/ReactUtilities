import { mount, shallow } from 'enzyme';
import { NullableKV, Numbers } from 'javascriptutilities';
import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Subject } from 'rxjs';
import { anything, instance, spy, verify, when } from 'ts-mockito-2';
import { ReduxViewModel, withViewModel } from '../src';
let deepEqual = require('deep-equal');

describe('View model HOC should work correctly', () => {
  let indexDivClass = 'index-div';
  let stateDivClass = 'state-div';

  interface State {
    readonly a: number;
    readonly b: number;
  }

  function transformState({ a, b }: NullableKV<State>) {
    return `${a}-${b}`;
  }

  class ViewModel implements ReduxViewModel<State> {
    public static instance: number;

    public constructor() {
      ViewModel.instance += 1;
    }

    public initialize() { }
    public deinitialize() { }
    public setUpStateCallback(_callback: (state: State) => void) { }
    public transformState(_state: NullableKV<State>): string { return ''; }
  }

  interface Props {
    readonly index: number;
    readonly viewModel: ViewModel;
  }

  class TestComponent extends Component<Props & NullableKV<State>, never> {
    public render() {
      return <div>
        <div className={indexDivClass}>{this.props.index}</div>
        <div className={stateDivClass}>
          {this.props.viewModel.transformState(this.props)}
        </div>
      </div>;
    }
  }

  // tslint:disable-next-line:variable-name
  let HOCTestComponent = withViewModel<ViewModel, Props, State>(TestComponent, {
    hooks: { beforeViewModelCreated: () => { } },
    filterPropDuplicates: true,
    checkEquality: deepEqual,
    createViewModel: props => (props.viewModelFactory as any)(),
  });

  let component: ReactElement<Props>;
  let componentIndex: number;
  let viewModel: ViewModel;

  beforeEach(() => {
    ViewModel.instance = -1;
    componentIndex = 1000;
    viewModel = spy(new ViewModel());

    component = <HOCTestComponent
      index={componentIndex}
      viewModelFactory={() => instance(viewModel)} />;
  });

  it('Wrapping base component class with view model wrapped - should work', () => {
    /// Setup
    let shallowed = shallow(component);
    shallowed.unmount();

    /// When && Then
    verify(viewModel.initialize()).once();
    verify(viewModel.deinitialize()).once();
    verify(viewModel.setUpStateCallback(anything())).once();
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
      mounted.setProps({ index });
    });

    /// Then
    verify(viewModel.transformState(anything())).times(times + 1);
    expect(ViewModel.instance).toEqual(0);
  });

  it('Filtering duplicate props with defined keys - should ensure non-duplicate props', () => {
    /// Setup
    HOCTestComponent = withViewModel<ViewModel, Props, State>(TestComponent, {
      filterPropDuplicates: true,
      checkEquality: deepEqual,
      propKeysForComparison: ['index'],
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    component = <HOCTestComponent index={-1}
      viewModelFactory={() => instance(viewModel)} />;

    let times = 1000;
    let mounted = mount(component);

    /// When
    Numbers.range(0, times).forEach(index => {
      mounted.setProps({ index });
    });

    /// Then
    verify(viewModel.transformState(anything())).times(times + 1);
  });

  it('Filtering duplicate props without prop keys - should use all keys', () => {
    /// Setup
    HOCTestComponent = withViewModel<ViewModel, Props, State>(TestComponent, {
      filterPropDuplicates: true,
      checkEquality: deepEqual,
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    component = <HOCTestComponent index={-1}
      viewModelFactory={() => instance(viewModel)} />;

    let times = 1000;
    let mounted = mount(component);

    /// When
    Numbers.range(0, times).forEach(index => {
      mounted.setProps({ index });
    });

    /// Then
    verify(viewModel.transformState(anything())).times(times + 1);
  });
});
