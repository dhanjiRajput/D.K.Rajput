import { createAction } from "@reduxjs/toolkit";
import { configureStore, createReducer } from "@reduxjs/toolkit";
interface StateType {
    count: number;
};

export const increment = createAction("increment");
export const decrement = createAction("decrement");

const initialState: StateType = { count: 0 };

const rootReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(increment, (state) => {
        state.count += 1;
    })
    .addCase(decrement, (state) => {
        state.count -= 1;
    })
})

export const store = configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof store.getState>;