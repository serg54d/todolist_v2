import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export const appSlice = createSlice({
	name: 'app',
	initialState: {
  	themeMode: "light" as ThemeMode,
  	status: "idle" as RequestStatus,
  	error: null as string | null,
	},
	reducers: (create) => ({
		changeTheme: create.reducer<{ThemeMode: ThemeMode}>((state, action) => {
			state.themeMode = action.payload.ThemeMode
		}),
		setAppStatus: create.reducer<{status: RequestStatus}>((state, action) => {
			state.status = action.payload.status
		}),
		setAppError: create.reducer<{error: string | null}>((state, action) => {
			state.error = action.payload.error
		}),
	}), 
	selectors: {
		selectThemeMode: (state) => state.themeMode,
		selectAppStatus: (state) => state.status,
		selectAppError: (state) => state.error
	}
})

export const appReducer = appSlice.reducer
export const {changeTheme, setAppError, setAppStatus} = appSlice.actions
export const {selectAppError, selectAppStatus, selectThemeMode} = appSlice.selectors
type AppInitialState = ReturnType <typeof appSlice.getInitialState>









