import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { useEffect } from "react"

import { useGetTasksQuery } from "features/todolists/api/tasksApi"
import { Task } from "./Task/Task"
import { TasksSkeleton } from "../../skeletons/TasksSkeleton/TasksSkeleton"
import { useAppDispatch } from "common/hooks"
import { setAppError } from "app/app-slice"
import { DomainTodolist } from "../../lib/types"

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
    const { data: tasks, isLoading, error } = useGetTasksQuery(todolist.id)
    // console.log(error)
	const dispatch = useAppDispatch()
    

    if (isLoading) {
        return <TasksSkeleton />
    }

    let tasksForTodolist = tasks?.items

    if (todolist.filter === "active") {
        tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.New)
    }

    if (todolist.filter === "completed") {
        tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.Completed)
    }

    return (
        <>
            {tasksForTodolist?.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <List>
                    {tasksForTodolist?.map((task) => {
                        return <Task key={task.id} task={task} todolist={todolist} />
                    })}
                </List>
            )}
        </>
    )
}
