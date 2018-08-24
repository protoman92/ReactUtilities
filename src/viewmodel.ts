/**
 * Root view model type.
 */
export interface RootType {
  initialize(): void;
  deinitialize(): void;
}

/**
 * Provide the relevant state stream for the component state.
 * @extends {RootType} Root type extension.
 * @template State State generics.
 */
export interface ReduxType<State> extends RootType {
  /**
   * Listen to state changes.
   * @param {(state: State) => void} callback A state callback.
   */
  setUpStateCallback(callback: (state: State) => void): void;
}
