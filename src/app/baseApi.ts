import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "todolistsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("sn-token")
            const apiKey = process.env.REACT_APP_API_KEY
            headers.set("authorization", `Bearer ${token}`)
            headers.set("API-KEY", `${apiKey}`)
            return headers
        },
    }),
    tagTypes: ["Todolist", "Tasks"],
	endpoints:() => ({})
})