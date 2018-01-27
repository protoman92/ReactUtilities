import { Subscription } from 'rxjs';
import { ViewModel } from './Dependency';

/**
 * Displayable interface that can display progress. The top app component should
 * implement this to handle progress displaying.
 */
export interface Type {
  viewModel: Readonly<ViewModel.Type>;
  subscription: Subscription;
  toggleProgress(enabled: boolean): void;
}

/**
 * Setup bindings for a displayable type. Call this during 'componentWillMount'.
 * @param {Type} displayable A Type instance.
 */
export let setupBindings = (displayable: Type): void => {
  let viewModel = displayable.viewModel;
  let subscription = displayable.subscription;

  viewModel
    .progressDisplayStream()
    .doOnNext(v => displayable.toggleProgress(v))
    .subscribe()
    .toBeDisposedBy(subscription);
};