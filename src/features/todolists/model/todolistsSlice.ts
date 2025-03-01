import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { ResultCode } from "common/enums"
import { BaseResponse } from "common/types"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { RequestStatus, setAppStatus } from "../../../app/app-slice"
import { _todolistsApi } from "../api/todolistsApi"
import { Todolist } from "../api/todolistsApi.types"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
    filter: FilterValuesType
    entityStatus: RequestStatus
}

const initialState: DomainTodolist[] = []

const createSliceWithThunks = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

export const todolistsSlice = createSliceWithThunks({
    name: "todolists",
    initialState: [] as DomainTodolist[],
    reducers: (create) => {
        const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null | BaseResponse }>()

        return {
            // THUNK
            removeTodolist: createAThunk(
                async (id: string, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        dispatch(changeTodolistEntityStatus({ id, entityStatus: "loading" }))
                        const res = await _todolistsApi.deleteTodolist(id)

                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            return { id }
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(res.data)
                        }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        dispatch(changeTodolistEntityStatus({ id, entityStatus: "failed" }))
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        const index = state.findIndex((todo) => todo.id === action.payload.id)
                        if (index !== -1) state.splice(index, 1)
                    },
                },
            ),
            addTodolist: createAThunk(
                async (title: string, { dispatch, rejectWithValue }) => {
                    try {
                        dispatch(setAppStatus({ status: "loading" }))
                        const res = await _todolistsApi.createTodolist(title)
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            debugger
                            return { todolist: res.data.data.item }
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
                        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
                    },
                },
            ),
            fetchTodolists: createAThunk(
                async (_, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        const res = await _todolistsApi.getTodolists()
                        dispatch(setAppStatus({ status: "succeeded" }))
                        return { todolists: res.data }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        action.payload.todolists.forEach((tl: Todolist) => {
                            state.push({ ...tl, filter: "all", entityStatus: "idle" })
                        })
                    },
                },
            ),
            updateTodolistTitle: createAThunk(
                async (arg: { id: string; title: string }, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        const res = await _todolistsApi.updateTodolist(arg)
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            // dispatch(changeTodolistTitle(arg))
                            return arg
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
                        const index = state.findIndex((todo) => todo.id === action.payload.id)
                        if (index !== -1) state[index].title = action.payload.title
                    },
                },
            ),

            // reducers/actions

            changeTodolistFilter: create.reducer<{ id: string; filter: FilterValuesType }>((state, action) => {
                const todolist = state.find((todo) => todo.id === action.payload.id)
                if (todolist) todolist.filter = action.payload.filter
            }),
            changeTodolistEntityStatus: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id)
                if (index !== -1) state[index].entityStatus = action.payload.entityStatus
            }),
        }

        // }),
    },
    selectors: {
        selectTodolists: (state) => state,
    },
    extraReducers(builder) {
        builder.addCase(clearTasksAndTodolists, (state, action) => {
            return []
        })
    },
})

export const todolistsReducer = todolistsSlice.reducer
export const {
    addTodolist,
    changeTodolistEntityStatus,
    changeTodolistFilter,
    removeTodolist,
    fetchTodolists,
    updateTodolistTitle,
} = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
