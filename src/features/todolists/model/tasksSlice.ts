import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { Dispatch } from "redux"
import { AppDispatch, RootState } from "../../../app/store"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../api/tasksApi.types"
// import { AddTodolistActionType, RemoveTodolistActionType } from "./todolistsSlice"
import { setAppError, setAppStatus } from "app/app-slice"
import { asyncThunkCreator, buildCreateSlice, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addTodolist, removeTodolist } from "./todolistsSlice"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { BaseResponse } from "common/types"
import { Try } from "@mui/icons-material"

export type TasksStateType = {
    [key: string]: DomainTask[]
}

const initialState: TasksStateType = {}

const createSliceWithThunks = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

export const tasksSlice = createSliceWithThunks({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: (create) => {
        const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null | BaseResponse }>()
        return {
            removeTask: createAThunk(
                async (arg: { taskId: string; todolistId: string }, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        const res = await tasksApi.deleteTask(arg)
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            return arg
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(res.data)
                        }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        const tasks = state[action.payload.todolistId]
                        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                        if (index !== -1) tasks.splice(index, 1)
                    },
                },
            ),
            addTask: createAThunk(
                async (arg: { title: string; todolistId: string }, thunkAPI) => {
                    const { dispatch, rejectWithValue } = thunkAPI
                    dispatch(setAppStatus({ status: "loading" }))
                    const res = await tasksApi.createTask(arg)
                    try {
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            // dispatch(addTask({ task: res.data.data.item }))
                            return { task: res.data.data.item }
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(res.data)
                        }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        const tasks = state[action.payload.task.todoListId]
                        tasks.unshift(action.payload.task)
                    },
                },
            ),
            updateTask: createAThunk(
                async (
                    arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel },
                    { dispatch, rejectWithValue, getState },
                ) => {
                    try {
                        const { taskId, todolistId, domainModel } = arg

                        const allTasksFromState = (getState() as RootState).tasks
                        const tasksForCurrentTodolist = allTasksFromState[todolistId]
                        const task = tasksForCurrentTodolist.find((t) => t.id === taskId)

                        if (!task) {
                            dispatch(setAppError({ error: "Task not found" }))
                            return rejectWithValue(null)
                        }

                        const model: UpdateTaskModel = {
                            status: task.status,
                            title: task.title,
                            deadline: task.deadline,
                            description: task.description,
                            priority: task.priority,
                            startDate: task.startDate,
                            ...domainModel,
                        }

                        dispatch(setAppStatus({ status: "loading" }))

                        const res = await tasksApi.updateTask({ taskId, todolistId, model })

                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatus({ status: "succeeded" }))
                            return arg
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(null)
                        }
                    } catch (error) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(null)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        const tasks = state[action.payload.todolistId]
                        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                        if (index !== -1) {
                            tasks[index] = { ...tasks[index], ...action.payload.domainModel }
                        }
                    },
                },
            ),
            fetchTasks: createAThunk(
                async (todolistId: string, thunkApi) => {
                    const { dispatch, rejectWithValue, getState } = thunkApi
                    // const isLoggedIn = (getState() as RootState).auth.isLoggedIn

                    dispatch(setAppStatus({ status: "loading" }))
                    try {
                        const res = await tasksApi.getTasks(todolistId)
                        dispatch(setAppStatus({ status: "succeeded" }))
                        // dispatch(setTasks({ todolistId, tasks: res.data.items }))
                        return { todolistId, tasks: res.data.items }
                    } catch (error: any) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(error)
                    }
                },
                {
                    fulfilled: (state, action) => {
                        state[action.payload.todolistId] = action.payload.tasks
                    },
                },
            ),
        }
    },
    extraReducers(builder) {
        builder
            .addCase(addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(clearTasksAndTodolists, (state, action) => {
                return {}
            })
    },
    selectors: {
        selectTasks: (state) => state,
    },
})

export const { addTask, removeTask, updateTask, fetchTasks } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
