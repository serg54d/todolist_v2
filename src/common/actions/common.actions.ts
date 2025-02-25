import { createAction } from "@reduxjs/toolkit";
import { TasksStateType } from "features/todolists/model/tasksSlice";
import { DomainTodolist } from "features/todolists/model/todolistsSlice";

// export const clearTasksAndTodolists = createAction('common/clear-tasks-todolists', 
// 	(tasks: TasksStateType, todolists: DomainTodolist[]) => {

// 		return {
// 			payload: {
// 				tasks,
// 				todolists,
// 			}
// 		}
// 	}
// )

export const clearTasksAndTodolists = createAction('common/clear-tasks-todolists')