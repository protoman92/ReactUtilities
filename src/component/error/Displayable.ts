import { Subscription } from 'rxjs';
import { ViewModel } from './dependency/base';

/**
 * Displayable interface that can display errors. The top app component should
 * implement this to handle error displaying.
 */
export interface Type {
  viewModel: Readonly<ViewModel.Type>;
  subscription: Subscription;
  displayErrorMessage(error: Error): void;
}

/**
 * Setup bindings for a displayable type. Call this during 'componentWillMount'.
 * @param {Type} displayable A Type instance.
 */
export let setupBindings = (displayable: Type): void => {
  let viewModel = displayable.viewModel;
  let subscription = displayable.subscription;
  
  /// Immediately delete the error from global state once it is displayed,
  /// otherwise the error will be displayed whenever the state changes.
  viewModel
    .operationErrorStream()
    .mapNonNilOrEmpty(v => v)
    .doOnNext(v => displayable.displayErrorMessage(v))
    .map(() => undefined)
    .subscribe(viewModel.operationErrorTrigger())
    .toBeDisposedBy(subscription);
};