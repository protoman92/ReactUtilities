import {mount} from 'enzyme';
import {
  CompleteDependencySetupHOCOptions,
  withCompleteDependencySetup,
} from 'hoc.all.dependency';
import {LifecycleHOCHooks} from 'hoc.lifecycle';
import {Numbers} from 'javascriptutilities';
import * as React from 'react';
import {ReactElement} from 'react';
import {NEVER} from 'rxjs';
import {anything, instance, spy, verify} from 'ts-mockito-2';
import {
  Dependency,
  DependencyProps,
  DependencyTestComponent,
  State,
} from './testcomponent';
let deepEqual = require('deep-equal');

describe('Complete dependency HOC should work correctly', () => {
  let lifecycleHooks: LifecycleHOCHooks;
  let completeOptions: CompleteDependencySetupHOCOptions<
    Dependency,
    DependencyProps
  >;
  let component: ReactElement<DependencyProps>;
  let dependency: Dependency;

  beforeEach(() => {
    dependency = spy<Dependency>({
      performCleanUp: () => {},
      stateStream: NEVER,
      transformState: () => '',
    });

    lifecycleHooks = spy<LifecycleHOCHooks>({
      onConstruction: () => {},
      componentDidMount: () => {},
      componentWillUnmount: () => {},
    });

    completeOptions = spy<
      CompleteDependencySetupHOCOptions<Dependency, DependencyProps>
    >({
      lifecycleHooks: instance(lifecycleHooks),
      checkEquality: deepEqual,
      createDependency: props => (props.dependencyFactory as any)(),
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withCompleteDependencySetup<
      State,
      Dependency,
      DependencyProps
    >(DependencyTestComponent, {
      ...instance(completeOptions),
      checkEquality: deepEqual,
      createDependency: props => (props.dependencyFactory as any)(),
    });

    component = (
      <HOCTestComponent
        index={0}
        dependencyFactory={() => instance(dependency)}
      />
    );
  });

  it('Wrapping base component class with complete wrapper - should work', () => {
    /// Setup
    let mounted = mount(component);
    mounted.unmount();

    /// When && Then
    verify(dependency.performCleanUp()).once();
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
    verify(dependency.transformState(anything())).once();
  });
});
