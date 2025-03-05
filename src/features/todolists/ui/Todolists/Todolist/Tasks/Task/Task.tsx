import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import { EditableSpan } from "common/components"
import { TaskStatus } from "common/enums"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "features/todolists/api/tasksApi"
import { ChangeEvent } from "react"
import { DomainTask } from "../../../../../api/tasksApi.types"
import { getListItemSx } from "./Task.styles"
import { DomainTodolist } from "../../../lib/types"

type Props = {
    task: DomainTask
    todolist: DomainTodolist
}

export const Task = ({ task, todolist }: Props) => {
    const [deleteTask] = useDeleteTaskMutation()
    const [updateTask] = useUpdateTaskMutation()
    const removeTaskHandler = () => {
        deleteTask({ taskId: task.id, todolistId: todolist.id })
    }

    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
        updateTask({ task, domainModel: { status } })
    }

    const changeTaskTitleHandler = (title: string) => {
        // dispatch(updateTask({ taskId: task.id, todolistId: todolist.id, domainModel: { title } }))
        updateTask({ task, domainModel: { title } })
    }

    const disabled = todolist.entityStatus === "loading"

    return (
        <ListItem key={task.id} sx={getListItemSx(task.status === TaskStatus.Completed)}>
            <div>
                <Checkbox
                    checked={task.status === TaskStatus.Completed}
                    onChange={changeTaskStatusHandler}
                    disabled={disabled}
                />
                <EditableSpan value={task.title} onChange={changeTaskTitleHandler} disabled={disabled} />
            </div>
            <IconButton onClick={removeTaskHandler} disabled={disabled}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    )
}
