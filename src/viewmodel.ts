/**
 * Root view model type.
 */
export interface RootViewModel {
  initialize(): void;
  deinitialize(): void;
}

/**
 * Provide the relevant state stream for the component state.
 * @extends {RootViewModel} Root type extension.
 * @template State State generics.
 */
export interface ReduxViewModel<State> extends RootViewModel {
  /**
   * Listen to state changes.
   * @param {(state: State) => void} callback A state callback.
   */
  setUpStateCallback(callback: (state: State) => void): void;
}
