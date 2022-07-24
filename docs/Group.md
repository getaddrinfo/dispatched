# Group

Represents a group of Stores that invokes a callback once all have finished their callbacks.


## API

`StoreGroup`

`constructor(stores: Store<any>[], callback: () => void): void`

Constructs a new StoreGroup, registers a new dispatch token that waits for all tokens from `Store[]` to resolve and calls the callback provided.

`release(): void`

Unregisters the `dispatchToken` for this group. Callback will no longer be called on every dispatch.