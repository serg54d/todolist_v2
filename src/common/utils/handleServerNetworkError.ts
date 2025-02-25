import { setAppError, setAppStatus } from "app/app-slice"
import { Dispatch } from "redux"
import axios from 'axios'
 
export const handleServerNetworkError = (error: unknown, dispatch: Dispatch): void => {
  let errorMessage = 'Some error occurred'
 
  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(error)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = error.response?.data?.message || error?.message || errorMessage
    // ❗ Проверка на наличие нативной ошибки
  } else if (error instanceof Error) {
    errorMessage = `Native error: ${error.message}`
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(error)
  }
 
  dispatch(setAppError({ error: errorMessage }))
  dispatch(setAppStatus({ status: 'failed' }))
}


export const _handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppError({error: error.message}))
  dispatch(setAppStatus({status: "failed"}))
}
