import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { selectIsLoggedIn, setIsLoggedIn } from "./../../../../app/app-slice"

import { selectThemeMode } from "app/app-slice"
import { FieldError } from "common/types"
import { useLoginMutation } from "features/auth/api/authAPI"
import { ResultCode } from "common/enums"

type Inputs = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const theme = getTheme(themeMode)

    const dispatch = useAppDispatch()

    const [login, {}] = useLoginMutation()

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = useForm<Inputs>({ defaultValues: { email: "", password: "", rememberMe: false } })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        login(data).then((res) => {
            if (res.data?.resultCode === ResultCode.Success) { 
                dispatch(setIsLoggedIn({ isLoggedIn: true }))
                localStorage.setItem("sn-token", res.data.data.token)
            }
            reset()
        })

        // const res = (await dispatch(login(data))) as {
        //     payload?: { errors: string[]; fieldsErrors?: FieldError[] }
        // }

        // if (login.fulfilled.match(res)) {
        //     reset()
        // } else if (login.rejected.match(res)) {
        //     if (res.payload?.fieldsErrors?.length) {
        //         res.payload.fieldsErrors.forEach((fieldError: FieldError) => {
        //             setError(fieldError.field as keyof Inputs, {
        //                 type: "server",
        //                 message: fieldError.error,
        //             })
        //         })
        //     } else if (res.payload?.errors) {
        //         alert(res.payload.errors.join("\n"))
        //     }
        // }
    }

    if (isLoggedIn) {
        return <Navigate to={"/"} />
    }

    return (
        <Grid container justifyContent={"center"}>
            <Grid item justifyContent={"center"}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To login get registered
                            <a
                                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                                href={"https://social-network.samuraijs.com/"}
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>
                            <b>Email:</b> free@samuraijs.com
                        </p>
                        <p>
                            <b>Password:</b> free
                        </p>
                    </FormLabel>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Incorrect email address",
                                    },
                                })}
                                error={!!errors.email} // Передаем ошибку
                                helperText={errors.email?.message} // Отображаем сообщение об ошибке
                            />
                            {/* {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>} */}
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 3,
                                        message: "Password must be at least 3 characters long",
                                    },
                                })}
                                error={!!errors.password} // Передаем ошибку
                                helperText={errors.password?.message} // Отображаем сообщение об ошибке
                            />
                            {/* {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>} */}

                            <FormControlLabel
                                label={"Remember me"}
                                control={
                                    <Controller
                                        name={"rememberMe"}
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                            <Checkbox {...field} checked={value} />
                                        )}
                                    />
                                }
                            />
                            <Button type={"submit"} variant={"contained"} color={"primary"}>
                                Login
                            </Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}
