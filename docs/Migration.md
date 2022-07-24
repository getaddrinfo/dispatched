# Migration

Detailed below are the changes between `dispatched` and `flux`.


## Dispatcher

Properties:
- `_isHandled` -> `_handled`
- `_isPending` -> `_pending`
- `_lastID` -> `_internalId`
- `_pendingPayload` -> `_current`

Methods:
- `_startDispatching(payload)` (private) -> `begin(payload)` (protected)
- `_invokeCallback(id)` (private) -> `process(id)` (protected)
- `_stopDispatching()` (private) -> `finish()` (protected)

New methods:
- `generateNextId()`: Generates the next id for dispatch tokens
- `_reset()`: Cleans up the state before a dispatch is processed


## Group

Functions:
- `_getUniformDispatcher(stores: FluxStore[])` -> `getDispatcher(stores: Store<any>[])`



## Store

Properties:
- `__changed` -> `changed`
- `__changeEvent` -> `changeEvent`
- `__className` -> `className`
- `__dispatcher` -> `dispatcher`
- `__emitter` -> `emitter`

Methods: 
- `__emitChange()` -> `emitChange()`
- `__invokeOnDispatch(payload)` -> `invoke(payload)`
- `__onDispatch(payload)` -> `dispatch(payload)`


## ReduceStore

Major changes are derived from `Store`

Methods:
- `areEqual` -> `equal`


## Removed:

- FluxMixinLegacy
- FluxStoreGroup
- FluxContainer, and by association:
  - FluxContainerSubscriptions

Recommended action: Reimplement them from the flux codebase (https://github.com/facebook/flux) for your own needs. 
They are not implemented here as to not link this library to a required react version.