import {getComponentDisplayName} from '../src/util';
import {TestComponent} from './testcomponent';

describe('Utility functions should work correctly', () => {
  it('Getting component name should work correctly', () => {
    /// Setup && When && Then
    let displayName = 'abc';
    TestComponent.displayName = displayName;
    expect(getComponentDisplayName(TestComponent)).toEqual(displayName);
    TestComponent.displayName = undefined;
    expect(getComponentDisplayName(TestComponent)).toEqual(TestComponent.name);
  });
});
