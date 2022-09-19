import { CircularDependencyError, StillDispatchingError, UnknownCallbackError } from "./Error";

type Optional<T> = T | null
export type RegisterCallback<T> = (payload: T) => void;
export type DispatchToken = string;

/**
 * Represents a Dispatcher that can dispatch events to many callbacks.
 * There should only be one instance of this to dispatch to all callbacks.
 * 
 * Every payload is dispatched to all callbacks. Callbacks can be deferred 
 * until other callbacks have finished via `Dispatcher.waitFor(...)`
 */
export class Dispatcher<T> {
    /**
     * The registered callbacks for this dispatcher.
     * 
     * @private
     */
    private _callbacks: {[key: DispatchToken]: (payload: T) => void} = {};

    /**
     * The pending callbacks for this dispatcher.
     * 
     * @private
     */
    private _pending: {[key: DispatchToken]: boolean} = {};
    
    /**
     * The handled callbacks for this dispatcher.
     * 
     * @private
     */
    private _handled: {[key: DispatchToken]: boolean} = {};

    /**
     * The current payload of this dispatcher (if dispatching).
     * 
     * @private
     */
    private _current: Optional<T> = null;

    // Purely internal variables

    /**
     * If the dispatcher is dispatching.
     * 
     * @private
     */
    private _isDispatching: boolean = false;

    /**
     * An internal counter used to assign ids to subscribed consumers.
     * 
     * @private
     */
    private _internalId: number = -1;

    /**
     * Registers a callback that will have actions distributed to it.
     * 
     * @param callback The callback for this token
     * @returns {string}
     */
    public register(callback: RegisterCallback<T>): string {
        const id = this.generateNextId();
        this._callbacks[id] = callback;

        return id;
    }

    /**
     * Removes a callback 
     *
     * @param id The id of the callback to remove.
     */
    public unregister(id: string): void {
        if(!this._callbacks[id]) {
            throw new UnknownCallbackError(id);
        }

        delete this._callbacks[id];
    }

    /**
     * Dispatches a payload to all the subscribed stores.
     * 
     * @param payload The payload to dispatch
     */
    public dispatch(payload: T): void {
        if(this._isDispatching) {
            throw new StillDispatchingError();
        }

        this.begin(payload);
        this.intermediate();
        this.finish();
    }

    /**
     * Is the Dispatcher currently Dispatching?
     */
    public isDispatching(): boolean {
        return this._isDispatching;
    }


    /**
     * Waits for the callbacks specified to be invoked before continuing execution
     * of the current callback. This method should only be used by a callback in
     * response to a dispatched payload.
     * 
     * @param tokens The tokens to wait for first.
     */
    public waitFor(tokens: string[]): void {
        for(const token of tokens) {
            if(!this._callbacks[token]) {
                throw new UnknownCallbackError(token);
            }

            if(this._pending[token]) {
                if(this._handled[token]) {
                    throw new CircularDependencyError();
                }

                continue;
            }

            this.process(token);
        }
    }

    /**
     * Begin the dispatch process (reset, set current and isPending)
     * 
     * @param payload The payload to begin dispatching
     */
    protected begin(payload: T): void {
        this._reset();

        this._current = payload;
        this._isDispatching = true;
    }

    /**
     * Call each callback
     * 
     * @param payload The payload to begin dispatching
     */
    protected intermediate(): void {
        for(const id of Object.keys(this._callbacks)) {
            if(this._pending[id]) continue; // If the callback has already been called, skip it.
            this.process(id);
        }
    }

    /**
     * Prep the Dispatcher to go back to it's base state.
     */
    protected finish(): void {
        this._current = null;
        this._isDispatching = false;
    }

    /**
     * Cleanup the state of the Dispatcher before beginning a dispatch.
     */
    private _reset(): void {
        // cleanup
        this._pending = {};
        this._handled = {};

        for(const id of Object.keys(this._callbacks)) {
            this._pending[id] = false;
            this._handled[id] = false;
        }
    }

    /**
     * Process a callback with the current payload.
     * 
     * @param id The id of the callback to process
     */
    protected process(id: string): void {
        this._pending[id] = true;
        this._callbacks[id]!(this._current!);
        this._handled[id] = true;
    }

    /**
     * Generate an id for a callback.
     * 
     * @returns The next id
     */
    private generateNextId(): string {
        return "cbck_" + this._internalId++;
    }
}