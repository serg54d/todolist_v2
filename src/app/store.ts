import { configureStore } from "@reduxjs/toolkit"
import { UnknownAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { authReducer, authSlice } from "../features/auth/model/auth-slice"
import { tasksReducer, tasksSlice } from "../features/todolists/model/tasksSlice"
import { todolistsReducer, todolistsSlice } from "../features/todolists/model/todolistsSlice"
import { appReducer, appSlice } from "./app-slice"

export const store = configureStore({
  reducer: {
  	[tasksSlice.name]: tasksReducer,
  	[todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [authSlice.name]: authReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch

// Создаем тип диспатча который принимает как AC так и TC
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

// @ts-ignore
window.store = store
