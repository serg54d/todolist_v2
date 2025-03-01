import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import { AddItemForm } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { Path } from "common/router"

import { useCreateTodolistMutation } from "features/todolists/api/todolistsApi"
import { Navigate } from "react-router-dom"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { selectIsLoggedIn } from "./app-slice"

export const Main = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn)

    const [createTodolist, {}] = useCreateTodolistMutation()

    const addTodolist = (title: string) => {
        createTodolist(title)
    }

    if (!isLoggedIn) {
        return <Navigate to={Path.Login} />
    }

    return (
        <Container fixed>
            <Grid container sx={{ mb: "30px" }}>
                <AddItemForm addItem={addTodolist} />
            </Grid>
            <Grid container spacing={4}>
                <Todolists />
            </Grid>
        </Container>
    )
}
