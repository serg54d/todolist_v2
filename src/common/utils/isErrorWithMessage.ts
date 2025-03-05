export function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
        typeof error === "object" && // Проверяем, что error – это объект
        error != null && // Убеждаемся, что это не null
        "message" in error && // Проверяем, есть ли у объекта свойство 'message'
        typeof (error as any).message === "string" // Убеждаемся, что это строка
    )
}
