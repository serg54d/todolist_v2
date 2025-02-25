import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { Dispatch } from "redux"
import { AppDispatch, RootState } from "../../../app/store"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../api/tasksApi.types"
// import { AddTodolistActionType, RemoveTodolistActionType } from "./todolistsSlice"
import { setAppStatus } from "app/app-slice"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addTodolist, removeTodolist } from "./todolistsSlice"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { log } from "node:console"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"

export type TasksStateType = {
  [key: string]: DomainTask[]
}

const initialState: TasksStateType = {}

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState: {} as TasksStateType,
	reducers: (create) => ({
		removeTask: create.reducer<{taskId: string; todolistId: string}>((state, action) => {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex((task) => task.id === action.payload.taskId)
			if (index !==-1) tasks.splice(index, 1)
		}),
		// removeTask: {
		// 	reducer: (state, action: PayloadAction<{taskId: string, todolistId: string}>) => {
		// 		const tasks = state[action.payload.todolistId]
		// 		const index = tasks.findIndex((task) => task.id === action.payload.taskId)
		// 		if (index !==-1) tasks.splice(index, 1)
		// 	},
		// 	prepare:({taskId, todolistId}) => {
		// 		return {
		// 			payload: {
		// 				taskId, todolistId
		// 			}
		// 		}
		// 	}, 
		// },
		addTask: create.reducer<{task: DomainTask}>((state, action) => {
			const tasks = state[action.payload.task.todoListId]
			tasks.unshift(action.payload.task)
		}),
		updateTask: create.reducer<{taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel}>((state, action) => {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex((task) => task.id === action.payload.taskId )
			if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
		}),
		// clearTasks: create.reducer(() => {
		// 	return {}
		// }),

		
	}),
	extraReducers(builder) {
		builder
		.addCase(addTodolist, (state, action) => {
			state[action.payload.todolist.id]= []
		})
		.addCase(removeTodolist, (state, action) => {
			delete state[action.payload.id]
		})
		.addCase(clearTasksAndTodolists, (state, action) => {
			return {}
		})
		.addCase(fetchTasks.fulfilled, (state, action) => {
			state[action.payload.todolistId] = action.payload.tasks
		})
	},
	selectors: {
		selectTasks: (state) => state
	}
})

export const {addTask,  removeTask, updateTask} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const {selectTasks} = tasksSlice.selectors

// Thunks


export const fetchTasks = createAppAsyncThunk<{todolistId: string, tasks: DomainTask[]}, string>(
	`${tasksSlice.name}/fetchTasks`, 
	async (todolistId: string, thunkApi) => {
	const {dispatch, rejectWithValue} = thunkApi
	dispatch(setAppStatus({status: "loading"}))
	try {
		const res = await tasksApi.getTasks(todolistId)
        dispatch(setAppStatus({status: "succeeded"}))
        // dispatch(setTasks({ todolistId, tasks: res.data.items }))
		return {todolistId, tasks: res.data.items}
	} catch(error: any)  {
       handleServerNetworkError(error, dispatch)
	//    console.log(error);
	   
	   return rejectWithValue(error)
    }
})

// export const _fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({status: "loading"}))
//   tasksApi
//     .getTasks(todolistId)
//     .then((res) => {
//       dispatch(setAppStatus({status: "succeeded"}))
//       dispatch(setTasks({ todolistId, tasks: res.data.items }))
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

export const removeTaskTC = (arg: { taskId: string; todolistId: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  tasksApi
    .deleteTask(arg)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({status: "succeeded"}))
        dispatch(removeTask(arg))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const addTaskTC = (arg: { title: string; todolistId: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  tasksApi
    .createTask(arg)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({status: "succeeded"}))
        dispatch(addTask({ task: res.data.data.item }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const updateTaskTC =
  (arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const { taskId, todolistId, domainModel } = arg

    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find((t) => t.id === taskId)

    if (task) {
      const model: UpdateTaskModel = {
        status: task.status,
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        ...domainModel,
      }

      dispatch(setAppStatus({status: "loading"}))
      tasksApi
        .updateTask({ taskId, todolistId, model })
        .then((res) => {
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatus({status: "succeeded"}))
            dispatch(updateTask(arg))
          } else {
            handleServerAppError(res.data, dispatch)
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch)
        })
    }
  }

