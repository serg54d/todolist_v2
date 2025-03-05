import { RequestStatus } from "app/app-slice"
import { Todolist } from "features/todolists/api/todolistsApi.types"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
	filter: FilterValues
	entityStatus: RequestStatus
}