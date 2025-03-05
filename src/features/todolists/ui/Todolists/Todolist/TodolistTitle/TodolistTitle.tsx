import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import { EditableSpan } from "common/components"
import { useAppDispatch } from "common/hooks"
import s from "./TodolistTitle.module.css"
import { todolistsApi, useDeleteTodolistMutation, useUpdateTodolistMutation } from "features/todolists/api/todolistsApi"
import { RequestStatus } from "app/app-slice"
import { DomainTodolist } from "../../lib/types"

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
    const { title, id, entityStatus } = todolist

    const dispatch = useAppDispatch()
    const [deleteTodolist] = useDeleteTodolistMutation()
    const [updateTodolist] = useUpdateTodolistMutation()

    const updateQueryData = (status: RequestStatus) => {
        dispatch(
            todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
                const index = state.findIndex((tl) => tl.id === id)
                if (index !== -1) {
                    state[index].entityStatus = status
                }
            }),
        )
    }

    const removeTodolistHandler = () => {
        // dispatch(removeTodolist(id))
        updateQueryData("loading")

        deleteTodolist(id)
            .unwrap()
            .then(() => {
                updateQueryData("succeeded")
            })
            .catch(() => {
                updateQueryData("failed")
            })
    }
    const updateTodolistHandler = (title: string) => {
        // dispatch(updateTodolistTitle({ id, title }))
        updateTodolist({ id, title })
    }

    return (
        <div className={s.container}>
            <h3>
                <EditableSpan value={title} onChange={updateTodolistHandler} disabled={entityStatus === "loading"} />
            </h3>
            <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
