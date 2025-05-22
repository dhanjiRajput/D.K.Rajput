import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./Slices"

export const store=configureStore({reducer:{root:rootReducer}});