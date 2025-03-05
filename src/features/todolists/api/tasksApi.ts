import { baseApi } from "app/baseApi"
import { BaseResponse } from "common/types"
import { DomainTask, GetTasksResponse, UpdateTaskDomainModel } from "./tasksApi.types"

export const taskAPI = baseApi.injectEndpoints({
    endpoints(builder) {
        return {
            getTasks: builder.query<GetTasksResponse, string>({
                query: (todolistId) => `todo-lists/${todolistId}/tasks`,
                providesTags: ["Tasks"],
            }),
            createTask: builder.mutation<BaseResponse<{ item: DomainTask }>, { title: string; todolistId: string }>({
                query: ({ title, todolistId }) => ({
                    method: "POST",
                    url: `todo-lists/${todolistId}/tasks`,
                    body: { title },
                }),
                invalidatesTags: ["Tasks"],
            }),
            deleteTask: builder.mutation<BaseResponse, { todolistId: string; taskId: string }>({
                query: ({ taskId, todolistId }) => ({
                    method: "DELETE",
                    url: `todo-lists/${todolistId}/tasks/${taskId}`,
                }),
                invalidatesTags: ["Tasks"],
            }),
            updateTask: builder.mutation<
                BaseResponse<{ item: DomainTask }>,
                { task: DomainTask; domainModel: UpdateTaskDomainModel }
            >({
                query: ({ domainModel, task }) => ({
                    method: "PUT",
                    url: `todo-lists/${task.todoListId}/tasks/${task.id}`,
                    body: {
                        status: task.status,
                        title: task.title,
                        deadline: task.deadline,
                        description: task.description,
                        priority: task.priority,
                        startDate: task.startDate,
                        ...domainModel,
                    },
                }),
                invalidatesTags: ["Tasks"],
            }),
        }
    },
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = taskAPI

// export const _tasksApi = {
//     getTasks(todolistId: string) {
//         return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
//     },

//     createTask(payload: { title: string; todolistId: string }) {
//         const { title, todolistId } = payload
//         return instance.post<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks`, { title })
//     },
//     deleteTask(payload: { todolistId: string; taskId: string }) {
//         const { taskId, todolistId } = payload
//         return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
//     },
//     updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
//         const { taskId, todolistId, model } = payload
//         return instance.put<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
//     },
// }
