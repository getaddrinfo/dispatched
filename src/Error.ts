import type { StoreGroup } from "./store/Group";
import type { ReduceStore } from "./store/ReduceStore";
import type { Store } from "./store/Store";

export class DispatchedError extends Error {}

// Dispatcher errors.
export class UnknownCallbackError extends DispatchedError {
    name = "UnknownCallbackError";

    constructor(id: string) {
        super(
            `Dispatcher.detach(id): ${id} is not registered.`
        )
    }
}

export class StillDispatchingError extends DispatchedError {
    name = "StillDispatchingError";

    constructor() {
        super(
            `Dispatcher.dispatch(payload): Cannot dispatch while still dispatching`
        );
    }
}

export class CircularDependencyError extends DispatchedError {
    name = "CircularDependencyError";

    constructor() {
        super(
            `Dispatcher.dependOn(...tokens): Circular dependency detected.`
        )
    }
}

// Store errors
export class NotDispatchingError extends DispatchedError {
    name = "NotDispatchingError"

    constructor(store: Store<any>, method: string) {
        super(
            `${store.className}.${method}(): Must be invoked while dispatching.`
        )
    }
}

// ReduceStore errors
export class UndefinedStateError extends DispatchedError {
    name = "UndefinedStateError";

    constructor(store: ReduceStore<any, any>) {
        const name = (store.constructor as any).name;

        super(
            `${name}.invoke(...): returned state from ${name}.reduce(...) was undefined. Did you return the state from reduce? (use null if this was intentional)`
        )
    }
}

// Group errors
export class NoStoresError extends DispatchedError {
    name = "NoStoresError";

    constructor(group: StoreGroup) {
        const name = (group.constructor as any).name;

        super(
            `new ${name}(stores, callback): No stores provided`
        )
    }
}