import { AddItemForm } from "common/components"

import { useCreateTaskMutation } from "features/todolists/api/tasksApi"
import { FilterTasksButtons } from "./FilterTasksButtons/FilterTasksButtons"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { DomainTodolist } from "../lib/types"

type Props = {
    todolist: DomainTodolist
}

export const Todolist = ({ todolist }: Props) => {
    const [createTask] = useCreateTaskMutation()

    const addTaskCallback = (title: string) => {
        createTask({ title, todolistId: todolist.id })
    }

    return (
        <>
            <TodolistTitle todolist={todolist} />
            <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
            <Tasks todolist={todolist} />
            <FilterTasksButtons todolist={todolist} />
        </>
    )
}
