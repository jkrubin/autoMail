export type Field = {
    id: number;
    userId: number;
    name: string;
    snakeName: string;
    description: string;
    updatedAt: string;
    createdAt: string;
    docTypes: number[];
    isLoading: boolean;
}

export type DocType = {
    id: number;
    name: string;
    snameName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    fields: number[]
    isLoading: boolean;
}

export type User = {
    id: number;
    email: string;
    jwt: string;
    isLoading: boolean;
}
export interface Store {
    auth: User | null;
    docTypes: DocType[], 
    fields: Field[],
    error: string
}