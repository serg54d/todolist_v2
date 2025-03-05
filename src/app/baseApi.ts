import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setAppError } from "./app-slice"
import { ResultCode } from "common/enums"
import { handleError } from "common/utils/handleError"

export const baseApi = createApi({
    reducerPath: "todolistsApi",
    baseQuery: async (args, api, extraOptions) => {
        // await new Promise((resolve) => setTimeout(resolve, 1500)) // эмуляция задержки

        const result = await fetchBaseQuery({
            baseUrl: process.env.REACT_APP_BASE_URL,
            prepareHeaders: (headers) => {
                const token = localStorage.getItem("sn-token")
                const apiKey = process.env.REACT_APP_API_KEY
                headers.set("authorization", `Bearer ${token}`)
                headers.set("API-KEY", `${apiKey}`)
                return headers
            },
        })(args, api, extraOptions)

        handleError(api, result)

        return result
    },
    tagTypes: ["Todolist", "Tasks"],
    endpoints: () => ({}),
})
