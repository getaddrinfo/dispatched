# dispatched

Derivation of the Flux project with no dependency on React.

Although Facebook have retired Flux, many large applications still utilise it and may not wish to move away. This package provides a near drop-in alternative to Flux to allow applications to continue development without rewriting their state management.


## Benefits

- No dependency on React (works with React 18.0, as well as other frameworks).
- Written in TypeScript, provides stricter typings (derivation of types straight from code allows for more flexible usage).
- Only depends on [eventemitter3](https://npmjs.com/package/eventemitter3).

## Removals & Changes
- `FluxContainer`, and through association:
  - `FluxContainerSubcriptions`
- `FluxMixinLegacy`

Many changes have occurred to cleanup methods and use more modern approaches to problems imposed through its design (abstraction, errors).

A migration guide can be accessed [here](https://github.com/getaddrinfo/dispatched/blob/master/docs/Migration.md), which details the changes necessary to move to `dispatched`

## Docs

Docs are viewable in the `docs/` directory:
- [Dispatcher](https://github.com/getaddrinfo/dispatched/blob/master/docs/Dispatcher.md)
- [Group](https://github.com/getaddrinfo/dispatched/blob/master/docs/Group.md)
- [Store](https://github.com/getaddrinfo/dispatched/blob/master/docs/Store.md)
- [ReduceStore](https://github.com/getaddrinfo/dispatched/blob/master/docs/ReduceStore.md)


## Examples

Examples are to come, but generally most of [flux's examples](https://github.com/facebook/flux/tree/main/examples) should be applicable to this.

## Installation and Usage

```sh
$ npm install dispatched
```


## Example usage

```ts
import * as Dispatched from "dispatched";

type Action = 
    | { type: "create-todo", id: string, name: string, body: string, done: boolean }
    | { type: "delete-todo", id: string }
    | { type: "update-todo", id: string, name?: string, body?: string, done?: boolean }

type DispatchToken = { dispatchToken: string };

interface Todo {
    id: string;
    name: string;
    body: string;
    done: boolean;
}

const TodoStore = {
    todos: [],
    dispatchToken: ""
} as { todos: Todo[] } & DispatchToken;


const Dispatcher = new Dispatched.Dispatcher<Action>();

// Register a callback
TodoStore.dispatchToken = Dispatcher.register((action) => {
    switch(action.type) {
        case 'create-todo':
            TodoStore.todos.push({
                id: action.id,
                name: action.name,
                body: action.body,
                done: action.done
            });

            break;

        case 'delete-todo':
            TodoStore.todos = TodoStore.todos.filter((todo) => todo.id !== action.id);

            break;

        case 'update-todo':
            const todoIndex = TodoStore.todos.findIndex((todo) => todo.id === action.id);

            const oldTodo = TodoStores.todos[todoIndex];

            TodoStore.todos[todoIndex] = {
                id: action.id,
                name: action.name ?? oldTodo.name,
                body: action.body ?? oldTodo.body,
                done: action.done ?? oldTodo.done
            };

            break;
    }
});
```

## License

`dispatched` is BSD-licensed, and derived from Facebook's [flux](https://github.com/facebook/flux). It's original `LICENSE` file has been retained, bar from the addition of line 6.