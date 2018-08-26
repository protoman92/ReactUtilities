import { getComponentName } from '../src/util';
import { TestComponent } from './testcomponent';

describe('Utility functions should work correctly', () => {
  it('Getting component name should work correctly', () => {
    /// Setup && When && Then
    let displayName = 'abc';
    TestComponent.displayName = displayName;
    expect(getComponentName(TestComponent)).toEqual(displayName);
    TestComponent.displayName = undefined;
    expect(getComponentName(TestComponent)).toEqual(TestComponent.name);
  });
});
