import * as React from 'react';
import {ComponentType} from 'react';
import * as Loadable from 'react-loadable';
import {Options, OptionsWithoutRender} from 'react-loadable';

export type LoadableHOCHooks = {
  readonly beforeComponentLoaded?: () => void;
};

export type LoadableHOCOptions<Props, Exports extends object> = {
  readonly hooks?: LoadableHOCHooks;
  readonly displayName?: string;
} & Options<Props, Exports>;

/**
 * Convert a component to Loadable.
 * @template Props Props generics.
 * @template Exports Exports generics.
 * @param {LoadableHOCOptions<Props, Exports>} options Loadable options.
 * @returns {ComponentType<Props>} ComponentType instance.
 */
export function withLoadable<Props, Exports extends object>(
  options: LoadableHOCOptions<Props, Exports>
): ComponentType<Props> {
  let actualOptions: Options<Props, Exports> = Object.assign({}, options, {
    loader: () => {
      if (options.hooks && options.hooks.beforeComponentLoaded) {
        options.hooks.beforeComponentLoaded();
      }

      return options.loader();
    },
  } as OptionsWithoutRender<Props>);

  let displayName = `${options.displayName}_LoadableWrapper`;
  let loadableComponent = Loadable(actualOptions);
  loadableComponent.displayName = displayName;
  return loadableComponent;
}

/**
 * This can be used to replace the actual loadable HOC during tests to render
 * components synchronously.
 * @template Props Props generics.
 * @template Exports Exports generics.
 * @param {LoadableHOCOptions<Props, Exports>} options Loadable options.
 * @returns {ComponentType<Props>} ComponentType instance.
 */
export function withTestLoadable<Props, Exports extends object>(
  options: LoadableHOCOptions<Props, Exports>
): ComponentType<Props> {
  if (options.hooks && options.hooks.beforeComponentLoaded) {
    options.hooks.beforeComponentLoaded();
  }

  return (_props: Props) => <div />;
}
