import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar, Header } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
// import { login } from "../features/auth/model/auth-slice"

import CircularProgress from "@mui/material/CircularProgress"
import { ResultCode } from "common/enums"
import { useMeQuery } from "features/auth/api/authAPI"
import s from "./App.module.css"
import { selectThemeMode, setIsLoggedIn } from "./app-slice"

export const App = () => {
    const themeMode = useAppSelector(selectThemeMode)
    //   const isInitialized = useAppSelector(selectIsInitialized)
    const [isInitialized, setIsInitialized] = useState(false)
    console.log("inits", isInitialized)
    const { isLoading, data } = useMeQuery()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoading) {
            setIsInitialized(true)
        }
        if (data?.resultCode === ResultCode.Success) {
            dispatch(setIsLoggedIn({isLoggedIn: true}))
        }
    }, [isLoading, data])

    return (
        <ThemeProvider theme={getTheme(themeMode)}>
            <CssBaseline />
            {isInitialized && (
                <>
                    <Header />
                    <Outlet />
                </>
            )}
            {!isInitialized && (
                <div className={s.circularProgressContainer}>
                    <CircularProgress size={150} thickness={3} />
                </div>
            )}
            <ErrorSnackbar />
        </ThemeProvider>
    )
}
