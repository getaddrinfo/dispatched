import type { Dispatcher } from "../Dispatcher";
import { NoStoresError } from "../Error";
import { Store } from "./Store";

export type Callback = () => void;

/**
 * StoreGroup waits for the callback on every
 * registered callback depended on by the stores provided
 * before running its own callback.
 * 
 * ```ts
 * const callback = () => {
 *   console.log("all stores provided have finished their callback");
 * };
 * 
 * const group = new StoreGroup([StoreA, StoreB, StoreC], callback);
 * ```
 *  
 */
export class StoreGroup {
    private _dispatcher: Dispatcher<any>;
    private _dispatchToken: string;

    constructor(stores: Store<any>[], callback: Callback) {
        const dispatcher = getDispatcher(stores);

        if(!dispatcher) {
            throw new NoStoresError(this);
        }

        this._dispatcher = dispatcher;

        const tokens = stores.map((store) => store.getDispatchToken());

        this._dispatchToken = this._dispatcher.register((_) => {
            this._dispatcher.waitFor(tokens);
            callback();
        })
    }

    public release(): void {
        this._dispatcher.unregister(this._dispatchToken);
    }
}

const getDispatcher = (stores: Store<any>[]) => {
    var dispatcher = stores[0]?.getDispatcher();
    return dispatcher;
}