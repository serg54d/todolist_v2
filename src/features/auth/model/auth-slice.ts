import { asyncThunkCreator, buildCreateSlice, createSlice } from "@reduxjs/toolkit"
import { setAppStatus } from "app/app-slice"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { Dispatch } from "redux"
import { authApi } from "../api/authAPI"
import { LoginArgs } from "../api/authAPI.types"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { BaseResponse } from "common/types"

const createSliceWithThunks = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

export const authSlice = createSliceWithThunks({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        isInitialized: false,
    },
    // reducers: {
    // 	setIsLoggedIn: (state, action:PayloadAction<{isLoggedIn: boolean}>) => {
    // 		// return { ...state, isLoggedIn: action.payload.isLoggedIn }
    // 		state.isLoggedIn = action.payload.isLoggedIn
    // 	},
    // 	setIsInitialized: (state, action:PayloadAction<{isInitialized: boolean}>) => {
    // 		// return { ...state, isInitialized: action.payload.isInitialized }
    // 		state.isInitialized = action.payload.isInitialized
    // 	}
    // }
    reducers: (create) => {
        const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null | BaseResponse }>()
        return {
            login: createAThunk(
                async (data: LoginArgs, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        const res = await authApi.login(data)
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            // dispatch(setIsLoggedIn({ isLoggedIn: true }))
                            localStorage.setItem("sn-token", res.data.data.token)
                            return { isLoggedIn: true }
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(null)
                        }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        state.isLoggedIn = action.payload.isLoggedIn
                    },
                },
            ),
            logout: createAThunk(
                async (_, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        const res = await authApi.logout()
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            dispatch(clearTasksAndTodolists())
                            localStorage.removeItem("sn-token")
                            return { isLoggedIn: false }
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(null)
                        }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        state.isLoggedIn = action.payload.isLoggedIn
                    },
                },
            ),
            initializeApp: createAThunk(
                async (_, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        const res = await authApi.me()
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            // dispatch(setIsLoggedIn({ isLoggedIn: true }))
                            return { isLoggedIn: true }
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(null)
                        }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        state.isLoggedIn = action.payload.isLoggedIn
                    },
                    settled: (state) => {
                        state.isInitialized = true
                    },
                },
            ),
        }
    },
    selectors: {
        selectIsLoggedIn: (state) => state.isLoggedIn,
        selectIsInitialized: (state) => state.isInitialized,
    },
})

export const authReducer = authSlice.reducer
export const { initializeApp, login, logout } = authSlice.actions
export const { selectIsInitialized, selectIsLoggedIn } = authSlice.selectors

// thunks

// export const logoutTC = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatus({ status: "loading" }))
//     authApi
//         .logout()
//         .then((res) => {
//             if (res.data.resultCode === ResultCode.Success) {
//                 dispatch(setAppStatus({ status: "succeeded" }))
//                 dispatch(setIsLoggedIn({ isLoggedIn: false }))
//                 dispatch(clearTasksAndTodolists())
//                 localStorage.removeItem("sn-token")
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }

// export const initializeAppTC = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatus({ status: "loading" }))
//     authApi
//         .me()
//         .then((res) => {
//             if (res.data.resultCode === ResultCode.Success) {
//                 dispatch(setAppStatus({ status: "succeeded" }))
//                 dispatch(setIsLoggedIn({ isLoggedIn: true }))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
//         .finally(() => {
//             dispatch(setIsInitialized({ isInitialized: true }))
//         })
// }
