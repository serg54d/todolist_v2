import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { taskAPI } from "features/todolists/api/tasksApi"
import { todolistsApi } from "features/todolists/api/todolistsApi"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export const appSlice = createSlice({
    name: "app",
    initialState: {
        themeMode: "light" as ThemeMode,
        status: "idle" as RequestStatus,
        error: null as string | null,
        isLoggedIn: false,
    },
    reducers: (create) => ({
        changeTheme: create.reducer<{ ThemeMode: ThemeMode }>((state, action) => {
            state.themeMode = action.payload.ThemeMode
        }),
        setAppStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
            state.status = action.payload.status
        }),
        setAppError: create.reducer<{ error: string | null }>((state, action) => {
            state.error = action.payload.error
        }),
        setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }),
    }),
    extraReducers(builder) {
        builder
            // .addMatcher(
            //     (action) => {
            //         return action.type.endsWith("/pending")
            //     },
            //     (state, action) => {
            //         state.status = "loading"
            //     },
            // )
            .addMatcher(isPending, (state, action) => {
                if (todolistsApi.endpoints.getTodolists.matchPending(action) || taskAPI.endpoints.getTasks.matchPending(action)) {
                    return
                }
                state.status = "loading"
            })
            .addMatcher(isFulfilled, (state, action) => {
                state.status = "succeeded"
            })
            .addMatcher(isRejected, (state, action) => {
                state.status = "failed"
            })
    },
    selectors: {
        selectThemeMode: (state) => state.themeMode,
        selectAppStatus: (state) => state.status,
        selectAppError: (state) => state.error,
        selectIsLoggedIn: (state) => state.isLoggedIn,
    },
})

export const appReducer = appSlice.reducer
export const { changeTheme, setAppError, setAppStatus, setIsLoggedIn } = appSlice.actions
export const { selectAppError, selectAppStatus, selectThemeMode, selectIsLoggedIn } = appSlice.selectors
type AppInitialState = ReturnType<typeof appSlice.getInitialState>
