import {mount} from 'enzyme';
import {Numbers} from 'javascriptutilities';
import * as React from 'react';
import {ReactElement} from 'react';
import {NEVER, Subject} from 'rxjs';
import {anything, instance, spy, verify, when} from 'ts-mockito-2';
import {DependencyHOCHooks, withDependency} from 'hoc.dependency';
import {
  Dependency,
  DependencyProps,
  DependencyTestComponent,
  indexDivClass,
  State,
  stateDivClass,
  transformState,
} from './testcomponent';

describe('View model HOC should work correctly', () => {
  let dependencyHooks: DependencyHOCHooks;
  let component: ReactElement<DependencyProps>;
  let componentIndex: number;
  let dependency: Dependency;

  beforeEach(() => {
    dependencyHooks = spy<DependencyHOCHooks>({
      beforeDependencyCreated: () => {},
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withDependency<State, Dependency, DependencyProps>({
      dependencyHooks: instance(dependencyHooks),
      createDependency: props => (props.dependencyFactory as any)(),
    })(DependencyTestComponent);

    componentIndex = 1000;

    dependency = spy<Dependency>({
      performCleanUp: () => {},
      stateStream: NEVER,
      transformState: () => '',
    });

    component = (
      <HOCTestComponent
        index={componentIndex}
        dependencyFactory={() => instance(dependency)}
      />
    );
  });

  it('Wrapping base component class with dependency wrapper - should work', () => {
    /// Setup
    let mounted = mount(component);
    mounted.unmount();

    /// When && Then
    verify(dependency.performCleanUp()).once();
    verify(dependencyHooks.beforeDependencyCreated!()).once();
  });

  it('Mutating state in wrapper component - should re-render pure component', () => {
    /// Setup
    let times = 1000;
    let stateSb = new Subject<State>();

    when(dependency.transformState(anything())).thenCall(state => {
      return transformState(state);
    });
    when(dependency.stateStream).thenReturn(stateSb);

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

    verify(dependency.transformState(anything())).times(times + 1);
  });
});
