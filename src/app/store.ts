import { configureStore } from "@reduxjs/toolkit"
import { UnknownAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
// import { authReducer, authSlice } from "../features/auth/model/auth-slice"

import { todolistsReducer, todolistsSlice } from "../features/todolists/model/todolistsSlice"
import { appReducer, appSlice } from "./app-slice"
import { todolistsApi } from "features/todolists/api/todolistsApi"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "./baseApi"

export const store = configureStore({
    reducer: {
        [todolistsSlice.name]: todolistsReducer,
        [baseApi.reducerPath]: baseApi.reducer,

        [appSlice.name]: appReducer,
        // [authSlice.name]: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch

// Создаем тип диспатча который принимает как AC так и TC
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

// @ts-ignore
window.store = store
