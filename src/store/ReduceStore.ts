import type { Dispatcher } from '../Dispatcher';
import { UndefinedStateError } from '../Error';
import { Store } from "./Store";

/**
 * A store that reduces state based on the actions provided to it.
 * 
 * T = payload,
 * U = state
 */
export abstract class ReduceStore<T, U> extends Store<T> {
    private _state: U;

    public constructor(dispatcher: Dispatcher<T>) {
        super(dispatcher);

        this._state = this.getInitialState();
    }

    /**
     * Returns the state of this store. If state is not immutable, you should override this function and
     * not expose `_state` directly.
     * 
     * @returns The current state
     */
    getState(): U {
        return this._state;
    }

    protected invoke(payload: T): void {
        this.changed = false;

        const currentState = this._state;
        const newState = this.reduce(currentState, payload); 

        if(newState === undefined) {
            throw new UndefinedStateError(this);
        }

        if(!this.equal(currentState, newState)) {
            this._state = newState;
            this.emitChange();
        }

        if(this.changed) {
            this.emitter.emit(this.changeEvent);
        }     
    }

    /**
     * Compare current state and new state to see if they are equal.
     * Used to ensure only changes are emitted via the store.
     * 
     * @returns If the states are equal
     */
    protected equal(a: U, b: U): boolean {
        return a === b;
    }

    /**
     * Modifies the current state based on the action, and returns it.
     * 
     * @param state The current state
     * @param action The action to reduce upon
     * @returns The new state
     */
    abstract reduce(state: U, action: T): U;

    /**
     * Gets the initial state of the store.
     * 
     * @returns The initial state
     */
    abstract getInitialState(): U;
}