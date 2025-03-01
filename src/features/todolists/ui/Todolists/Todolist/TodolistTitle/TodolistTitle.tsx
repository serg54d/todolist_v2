import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import { EditableSpan } from "common/components"
import { useAppDispatch } from "common/hooks"
import { DomainTodolist, removeTodolist, updateTodolistTitle } from "../../../../model/todolistsSlice"
import s from "./TodolistTitle.module.css"
import { useDeleteTodolistMutation, useUpdateTodolistMutation } from "features/todolists/api/todolistsApi"

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
    const { title, id, entityStatus } = todolist

      const dispatch = useAppDispatch()
	const [deleteTodolist] = useDeleteTodolistMutation()
	const [updateTodolist] = useUpdateTodolistMutation()
    const removeTodolistHandler = () => {
        // dispatch(removeTodolist(id))
		deleteTodolist(id)
    }
    const updateTodolistHandler = (title: string) => {
        // dispatch(updateTodolistTitle({ id, title }))
		updateTodolist({id, title})
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
