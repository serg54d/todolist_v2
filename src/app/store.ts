import { applyMiddleware, combineReducers, legacy_createStore, UnknownAction } from "redux"
import { thunk, ThunkDispatch } from "redux-thunk"
import { authReducer } from "../features/auth/model/auth-slice"
import { tasksReducer } from "../features/todolists/model/tasksSlice"
import { todolistsReducer } from "../features/todolists/model/todolistsSlice"
import { appReducer } from "./app-slice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
  	tasks: tasksReducer,
  	todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch

// Создаем тип диспатча который принимает как AC так и TC
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

// @ts-ignore
window.store = store
