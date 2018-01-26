import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { Connector } from './../../../src';
import { Lifecycle } from './../../../src/component/common';
import { Selector } from './../../../src/connector/lifecycle';
import { App } from './component';

describe('Connect component lifecycle - should work', () => {
  beforeEach(() => {
    enzyme.configure({ adapter: new Adapter() });
  });

  it('Connect component lifestyle - should work', () => {
    /// Setup
    let lifecycles: Lifecycle.Case[] = [];

    let hook: Selector = (_id: string, lifecycle: Lifecycle.Case) => {
      lifecycles.push(lifecycle);
    };

    let compClass = Connector.Lifecycle.connect(hook)(App.Self);

    /// When
    enzyme.mount(React.createElement(compClass)).unmount();

    /// Then
    expect(lifecycles).toEqual([
      Lifecycle.Case.componentWillMount,
      Lifecycle.Case.componentDidMount,
      Lifecycle.Case.componentWillUnmount,
    ]);
  });
});