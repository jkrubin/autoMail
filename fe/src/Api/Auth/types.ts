export type User = {
    id: number;
    email: string;
    jwt: string;
}
export type UserResponse = {
    user: User;
    jwt: string;
}