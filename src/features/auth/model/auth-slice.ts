// import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
// import { setAppStatus } from "app/app-slice"
// import { clearTasksAndTodolists } from "common/actions/common.actions"
// import { ResultCode } from "common/enums"
// import { FieldError } from "common/types"
// import { handleServerAppError } from "common/utils/handleServerAppError"
// import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
// import { _authApi } from "../api/authAPI"
// import { LoginArgs } from "../api/authAPI.types"

// const createSliceWithThunks = buildCreateSlice({
//     creators: { asyncThunk: asyncThunkCreator },
// })

// export const authSlice = createSliceWithThunks({
//     name: "auth",
//     initialState: {
       
  
//     },

//     reducers: (create) => {
//         const createAThunk = create.asyncThunk.withTypes<{
//             rejectValue: { errors: Array<string>; fieldsErrors?: FieldError[] }
//         }>()
//         return {
//             login: create.asyncThunk(
//                 async (data: LoginArgs, thunkAPI) => {
//                     const { dispatch, rejectWithValue } = thunkAPI
//                     dispatch(setAppStatus({ status: "loading" }))
//                     try {
//                         const res = await _authApi.login(data)
//                         if (res.data.resultCode === ResultCode.Success) {
//                             dispatch(setAppStatus({ status: "succeeded" }))
//                             // dispatch(setIsLoggedIn({ isLoggedIn: true }))
//                             localStorage.setItem("sn-token", res.data.data.token)
//                             return
//                         } else {
//                             handleServerAppError(res.data, dispatch)
//                             return rejectWithValue({
//                                 errors: res.data.messages, // Используем messages вместо errors
//                                 fieldsErrors: res.data.fieldsErrors,
//                             })
//                         }
//                     } catch (error: any) {
//                         handleServerNetworkError(error, dispatch)
//                         return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
//                     }
//                 },
//                 {
//                     fulfilled: (state) => {
//                         state.isLoggedIn = true
//                     },
//                 },
//             ),
//             logout: createAThunk(
//                 async (_, thunkAPI) => {
//                     const { dispatch, rejectWithValue } = thunkAPI
//                     dispatch(setAppStatus({ status: "loading" }))
//                     try {
//                         const res = await _authApi.logout()
//                         if (res.data.resultCode === ResultCode.Success) {
//                             dispatch(setAppStatus({ status: "succeeded" }))
//                             dispatch(clearTasksAndTodolists())
//                             localStorage.removeItem("sn-token")
//                             return
//                         } else {
//                             handleServerAppError(res.data, dispatch)
//                             return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
//                         }
//                     } catch (error: any) {
//                         handleServerNetworkError(error, dispatch)
//                         return rejectWithValue({ errors: [], fieldsErrors: undefined })
//                     }
//                 },
//                 {
//                     fulfilled: (state) => {
//                         state.isLoggedIn = false
//                     },
//                 },
//             ),
      
//         }
//     },
//     selectors: {
//         // selectIsLoggedIn: (state) => state.isLoggedIn,
      
//     },
// })

// export const authReducer = authSlice.reducer
// export const {  login, logout } = authSlice.actions
// export const {   } = authSlice.selectors
