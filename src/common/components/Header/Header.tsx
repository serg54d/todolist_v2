import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { MenuButton } from "common/components"
// import { logout, selectIsLoggedIn } from "../../../features/auth/model/auth-slice"
import { changeTheme, selectAppStatus, selectIsLoggedIn, selectThemeMode, setIsLoggedIn } from "app/app-slice"
import { useLogoutMutation } from "features/auth/api/authAPI"
import { ResultCode } from "common/enums"
import { clearTasksAndTodolists } from "common/actions/common.actions"

export const Header = () => {
    const dispatch = useAppDispatch()

    const themeMode = useAppSelector(selectThemeMode)
    const status = useAppSelector(selectAppStatus)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const [logout] = useLogoutMutation()
    const theme = getTheme(themeMode)

    const changeModeHandler = () => {
        dispatch(changeTheme({ ThemeMode: themeMode === "light" ? "dark" : "light" }))
    }

    const logoutHandler = () => {
        logout().then((res) => {
            if (res.data?.resultCode === ResultCode.Success) {
				dispatch(setIsLoggedIn({isLoggedIn: false}))
                dispatch(clearTasksAndTodolists())
                localStorage.removeItem("sn-token")
            }
        })
    }

    return (
        <AppBar position="static" sx={{ mb: "30px" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton color="inherit">
                    <MenuIcon />
                </IconButton>
                <div>
                    {isLoggedIn && <MenuButton onClick={logoutHandler}>Logout</MenuButton>}
                    <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
                    <Switch color={"default"} onChange={changeModeHandler} />
                </div>
            </Toolbar>
            {status === "loading" && <LinearProgress />}
        </AppBar>
    )
}
