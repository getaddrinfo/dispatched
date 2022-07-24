# ReduceStore

A store that is based on mutations in response to an action.

Takes two type params:
- `T`: The type of actions that can be performed on it.
- `U`: The type of state.


## API

`ReduceStore<T, U> extends Store<T>`

`constructor(dispatcher: Dispatcher<T>): void`

Constructs a ReduceStore and associates it with the dispatcher provided.

`getState(): U`

Returns the current state of the store. If state is mutable, classes derived from ReduceStore should overwrite this method and not expose `_state` directly.

`getInitialState(): U`

Returns the initial state of the store.

`reduce(state: U, action: T)`

Reduces the state based on the action, and returns a new state.

`equal(a: U, b: U)`

Checks if two states are equal, to only update state if necessary.

`invoke(payload: T)`

Checks currentState and newState, updates and emits if state has changed.