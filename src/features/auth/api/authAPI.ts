import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { LoginArgs } from "./authAPI.types"
import { baseApi } from "app/baseApi"
import { url } from "inspector"

export const authAPI = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            me: builder.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
                query: () => "auth/me",
            }),
            login: builder.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
                query: (payload) => ({
                    url: "auth/login",
                    method: "POST",
                    body: payload,
                }),
            }),
            logout: builder.mutation<BaseResponse, void>({
                query: () => ({
                    url: "auth/login",
                    method: "delete",
                }),
            }),
        }
    },
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authAPI

export const _authApi = {
    login(payload: LoginArgs) {
        return instance.post<BaseResponse<{ userId: number; token: string }>>(`auth/login`, payload)
    },
    logout() {
        return instance.delete<BaseResponse>("auth/login")
    },
    me() {
        return instance.get<BaseResponse<{ id: number; email: string; login: string }>>("auth/me")
    },
}
