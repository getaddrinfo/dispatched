# Store

A store generally conforms to the following requirements:
- Exposes public getters to access data, and only permits mutations via actions.
- Emits a change when their data changes, and only emits during a dispatch.
- Caches data

An implementation of Store can be seen [here](https://github.com/getaddrinfo/dispatched/blob/master/src/store/Store.ts). It implements all of the above, and is used as a base class for [ReduceStore](./ReduceStore.md).

## API

`Store<T>`

`constructor(dispatcher: Dispatcher<T>)`

Constructs and registers the store with the dispatcher.

`addListener(callback: (eventType?: string) => void): { remove: () => void }`

Adds a listener to the store, when the store changes the given callback will be called. A token is returned that can be used to remove the listener. Calling the remove() function on the returned token will remove the listener.

`getDispatcher(): Dispatcher<T>`

Returns the dispatcher this Store is registered with.

`getDispatchToken(): string`

Returns the dispatch token that is associated with this store. Used primarily for `Dispatcher.waitFor(...)` usage.`

`hasChanged(): boolean`

Returns true if the store has changed during the current dispatch. Will throw an error if called when a dispatch is not ongoing.

`emitChange(): void`

A protected function that sets changed to true that will permit the `invoke` function to emit a change and notify other stores of such.

`dispatch(payload: T): void`

An abstract method that handles how the store should mutate state to respond to the action.