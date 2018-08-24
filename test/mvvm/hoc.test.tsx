import { mount, shallow } from 'enzyme';
import { Numbers } from 'javascriptutilities';
import { ReduxViewModel, withViewModel } from 'mvvm';
import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Subject } from 'rxjs';
import { anything, instance, spy, verify, when } from 'ts-mockito-2';

describe('View model HOC should work correctly', () => {
  let indexDivClass = 'index-div';
  let stateDivClass = 'state-div';

  interface State {
    readonly a?: number;
    readonly b?: number;
  }

  function transformState({ a, b }: State) {
    return `${a}-${b}`;
  }

  interface ViewModel extends ReduxViewModel<State> {
    transformState(state: State): string;
  }

  interface Props {
    readonly index: number;
    readonly viewModel: ViewModel;
  }

  class TestComponent extends Component<Props & State, never> {
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
    createViewModel: props => (props.viewModelFactory as any)(),
  });

  let component: ReactElement<Props>;
  let componentIndex: number;
  let viewModel: ViewModel;

  beforeEach(() => {
    componentIndex = 0;

    viewModel = spy({
      initialize: () => { },
      deinitialize: () => { },
      setUpStateCallback: () => { },
      transformState: () => '',
    });

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
    let times = 10000;
    let stateSb = new Subject<State>();

    when(viewModel.transformState(anything())).thenCall(state => {
      return transformState(state);
    });

    when(viewModel.setUpStateCallback(anything())).thenCall(callback => {
      stateSb.subscribe(state => callback(state));
    });

    let mounted = mount(component);

    let newState: State = {
      a: Numbers.randomBetween(0, 1000),
      b: Numbers.randomBetween(0, 1000),
    };

    Numbers.range(0, times).forEach(() => {
      /// When
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
});
