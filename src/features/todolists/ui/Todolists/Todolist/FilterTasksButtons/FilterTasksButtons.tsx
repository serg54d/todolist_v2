import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useAppDispatch } from "common/hooks"

import { filterButtonsContainerSx } from "./FilterTasksButtons.styles"
import { todolistsApi } from "features/todolists/api/todolistsApi"
import { DomainTodolist, FilterValues } from "../../lib/types"

type Props = {
    todolist: DomainTodolist
}

export const FilterTasksButtons = ({ todolist }: Props) => {
    const { filter, id } = todolist

    const dispatch = useAppDispatch()

    const changeFilterTasksHandler = (filter: FilterValues) => {
        // dispatch(changeTodolistFilter({ id, filter }))
        dispatch(
            todolistsApi.util.updateQueryData("getTodolists", undefined, (todolists: DomainTodolist[]) => {
                const todolist = todolists.find((todo) => todo.id === id)
                if (todolist) todolist.filter = filter
            }),
        )
    }

    return (
        <Box sx={filterButtonsContainerSx}>
            <Button
                variant={filter === "all" ? "outlined" : "text"}
                color={"inherit"}
                onClick={() => changeFilterTasksHandler("all")}
            >
                All
            </Button>
            <Button
                variant={filter === "active" ? "outlined" : "text"}
                color={"primary"}
                onClick={() => changeFilterTasksHandler("active")}
            >
                Active
            </Button>
            <Button
                variant={filter === "completed" ? "outlined" : "text"}
                color={"secondary"}
                onClick={() => changeFilterTasksHandler("completed")}
            >
                Completed
            </Button>
        </Box>
    )
}
