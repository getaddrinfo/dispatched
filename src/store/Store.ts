import type { Dispatcher } from '../Dispatcher';
import { NotDispatchingError } from '../Error';

export type StoreCallback = () => void;
export type Revocable = { remove: () => void };

/**
 * Represents the most basic functionality of a Store.
 * 
 * T = action
 */
export abstract class Store<T> {
    public className: string;
    protected changed: boolean = false;
    protected callbacks: StoreCallback[] = [];

    private _dispatchToken: string;
    
    constructor(protected dispatcher: Dispatcher<T>) {
        this.className = (this.constructor as any).name;
        this.callbacks = [];

        this._dispatchToken = dispatcher.register((payload) => this.invoke(payload));
    }

    /**
     * Returns the dispatcher this store is assigned to.
     * 
     * @returns The dispatcher for this store
     */
    public getDispatcher(): Dispatcher<T> { 
        return this.dispatcher;
    }

    /**
     * Returns the dispatch token for this store. Commonly used in `Dispatcher.waitFor(...)`
     * 
     * @returns The dispatch token for this store
     */
    public getDispatchToken(): string {
        return this._dispatchToken;
    }

    /**
     * Add a listener to the store for changes.
     * 
     * @param callback The callback to call when an event is emitted
     * @returns An object with a cleanup function
     */
    public addListener(callback: StoreCallback): Revocable {
        this.callbacks.push(callback);

        const removeListener = () => this.callbacks.splice(this.callbacks.indexOf(callback), 1);
        return { remove: () => { removeListener(); }};
    }

    /**
     * Returns if the store has changed or not.
     * 
     * @returns If the store has changed while dispatching.
     */
    public hasChanged(): boolean {
        if(!this.dispatcher.isDispatching()) {
            throw new NotDispatchingError(this, "hasChanged");
        }

        return this.changed;
    }

    /**
     * Sets changed to true.
     */
    protected emitChange(): void {
        if(!this.dispatcher.isDispatching()) {
            throw new NotDispatchingError(this, "emitChange");
        }

        this.changed = true;
    }

    /**
     * Calls the dispatch function and then emits a change if necessary.
     * 
     * @param payload The payload to dispatch to this store.
     */
    protected invoke(payload: T): void {
        this.changed = false;
        this.dispatch(payload);

        if(this.changed) {
            this.runCallbacks();
        }
    }

    protected runCallbacks() {
        this.callbacks.forEach((cb) => cb())
    }

    abstract dispatch(payload: T): void;
}