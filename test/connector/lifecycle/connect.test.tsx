import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { connector } from './../../../src';
import { lifecycle } from './../../../src/component';
import { Selector } from './../../../src/connector/lifecycle';
import { app } from './component';

describe('Connect component lifecycle - should work', () => {
  beforeEach(() => {
    enzyme.configure({ adapter: new Adapter() });
  });

  it('Connect component lifestyle - should work', () => {
    /// Setup
    let lifecycles: lifecycle.Case[] = [];

    let hook: Selector = (_id: string, lc: lifecycle.Case) => {
      lifecycles.push(lc);
    };

    let compClass = connector.lifecycle.trackLifecycle(hook)(app.Self);

    /// When
    enzyme.mount(React.createElement(compClass)).unmount();

    /// Then
    expect(lifecycles).toEqual([
      lifecycle.Case.componentWillMount,
      lifecycle.Case.componentDidMount,
      lifecycle.Case.componentWillUnmount,
    ]);
  });
});