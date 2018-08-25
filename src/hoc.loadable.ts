import { ComponentType } from 'react';
import * as Loadable from 'react-loadable';
import { Options, OptionsWithoutRender } from 'react-loadable';

export type LoadableHooks = {
  readonly beforeComponentLoaded?: () => void;
};

export type LoadableHOCOptions<Props, Exports extends object> = {
  readonly hooks?: LoadableHooks;
} & Options<Props, Exports>;

/**
 * Convert a component to Loadable.
 * @template Props Props generics.
 * @template Exports Not sure why this is even needed.
 * @param {LoadableHOCOptions<Props, Exports>} options Loadable options.
 * @returns {ComponentType<Props>} ComponentType instance.
 */
export function withLoadable<Props, Exports extends object>(
  options: LoadableHOCOptions<Props, Exports>): ComponentType<Props> {
  let actualOptions: Options<Props, Exports> = Object.assign({}, options, {
    loader: () => {
      if (options.hooks && options.hooks.beforeComponentLoaded) {
        options.hooks.beforeComponentLoaded();
      }

      return options.loader();
    },
  } as OptionsWithoutRender<Props>);

  return Loadable(actualOptions);
}
