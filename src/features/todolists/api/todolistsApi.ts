import { baseApi } from "app/baseApi"
import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { Todolist } from "./todolistsApi.types"
import { DomainTodolist } from "../ui/Todolists/lib/types"

export const todolistsApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            getTodolists: builder.query<DomainTodolist[], void>({
                query: () => ({
                    // method: "GET",  - get идет по умолчанию
                    url: "todo-lists",
                }),
                transformResponse(todolists: Todolist[]): DomainTodolist[] {
                    return todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
                },
                providesTags: ["Todolist"],
            }),
            createTodolist: builder.mutation<BaseResponse<{ item: Todolist }>, string>({
                query: (title) => ({
                    method: "POST",
                    url: "todo-lists",
                    body: { title },
                }),
                invalidatesTags: ["Todolist"],
            }),
            deleteTodolist: builder.mutation<BaseResponse, string>({
                query: (id) => ({
                    method: "DELETE",
                    url: `todo-lists/${id}`,
                }),
                invalidatesTags: ["Todolist"],
            }),
            updateTodolist: builder.mutation<BaseResponse, { id: string; title: string }>({
                query: ({ id, title }) => ({
                    method: "PUT",
                    url: `todo-lists/${id}`,
                    body: { title },
                }),
                invalidatesTags: ["Todolist"],
            }),
        }
    },
})

export const {
    useGetTodolistsQuery,
    useLazyGetTodolistsQuery,
    useCreateTodolistMutation,
    useDeleteTodolistMutation,
    useUpdateTodolistMutation,

} = todolistsApi

export const _todolistsApi = {
    getTodolists() {
        return instance.get<Todolist[]>("todo-lists")
    },
    updateTodolist(payload: { id: string; title: string }) {
        const { title, id } = payload
        return instance.put<BaseResponse>(`todo-lists/${id}`, { title })
    },
    createTodolist(title: string) {
        return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponse>(`todo-lists/${id}`)
    },
}
