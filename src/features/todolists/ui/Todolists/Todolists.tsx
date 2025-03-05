import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"

import { useGetTodolistsQuery, useLazyGetTodolistsQuery } from "features/todolists/api/todolistsApi"
import { Todolist } from "./Todolist/Todolist"
import { Skeleton } from "@mui/material"
import { TodolistSkeleton } from "./skeletons/TodolistSkeleton/TodolistSkeleton"

export const Todolists = () => {
    const { data: todolists, refetch, isLoading } = useGetTodolistsQuery(undefined, { skip: false })
    // const [trigger, { data: todolists }] = useLazyGetTodolistsQuery()

    // const handlerGetTodo = () => {
    // 	trigger()
    // }
    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "32px" }}>
                {Array(3)
                    .fill(null)
                    .map((_, id) => (
                        <TodolistSkeleton key={id} />
                    ))}
            </div>
        )
    }
    return (
        <>
            {todolists?.map((tl) => {
                return (
                    <>
                        {/* <button onClick={refetch}>Получить свежие данные</button> */}
                        {/* <button onClick={handlerGetTodo}></button> */}
                        <Grid key={tl.id}>
                            <Paper sx={{ p: "0 20px 20px 20px" }}>
                                <Todolist key={tl.id} todolist={tl} />
                            </Paper>
                        </Grid>
                    </>
                )
            })}
        </>
    )
}
