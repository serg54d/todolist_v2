import { setAppError, setAppStatus } from "app/app-slice"
import { Dispatch } from "redux"


export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppError({error: error.message}))
  dispatch(setAppStatus({status: "failed"}))
}
