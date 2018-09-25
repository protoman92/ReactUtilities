import {getComponentDisplayName} from '../src/util';
import {ViewModelTestComponent} from './testcomponent';

describe('Utility functions should work correctly', () => {
  it('Getting component name should work correctly', () => {
    /// Setup && When && Then
    let displayName = 'abc';
    ViewModelTestComponent.displayName = displayName;
    expect(getComponentDisplayName(ViewModelTestComponent)).toEqual(
      displayName
    );
    ViewModelTestComponent.displayName = undefined;
    expect(getComponentDisplayName(ViewModelTestComponent)).toEqual(
      ViewModelTestComponent.name
    );
  });
});
