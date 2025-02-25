import { createSlice } from "@reduxjs/toolkit"
import { setAppStatus } from "app/app-slice"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { Dispatch } from "redux"
import { authApi } from "../api/authAPI"
import { LoginArgs } from "../api/authAPI.types"
import { clearTasksAndTodolists } from "common/actions/common.actions"



export const authSlice = createSlice({
	name: 'auth',
	initialState : {
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
	reducers: (create) => ({
			setIsLoggedIn: create.reducer<{isLoggedIn: boolean}>((state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			}), 
			setIsInitialized: create.reducer<{isInitialized: boolean}>((state, action) => {
				state.isInitialized = action.payload.isInitialized
			}),
	}),
	selectors: {
		selectIsLoggedIn: (state) => state.isLoggedIn,
		selectIsInitialized: (state) => state.isInitialized
	}
})

export const authReducer = authSlice.reducer
export const {setIsInitialized, setIsLoggedIn} = authSlice.actions
export const {selectIsInitialized, selectIsLoggedIn} = authSlice.selectors


// thunks
export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status:"loading"}))
  authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({status: "succeeded"}))
        dispatch(setIsLoggedIn({isLoggedIn: true}))
        localStorage.setItem("sn-token", res.data.data.token)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({status: "succeeded"}))
        dispatch(setIsLoggedIn({isLoggedIn: false}))
		dispatch(clearTasksAndTodolists())
        localStorage.removeItem("sn-token")
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  authApi
    .me()	
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({status: "succeeded"}))
        dispatch(setIsLoggedIn({isLoggedIn: true}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitialized({isInitialized: true}))
    })
}
