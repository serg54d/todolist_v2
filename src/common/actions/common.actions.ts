import { createAction } from "@reduxjs/toolkit";

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