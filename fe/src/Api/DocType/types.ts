export type DocType = {
    id: number;
    name: string;
    snakeName: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    userId?: number;
    fields?: number[]
}

export type DocTypeInput = {
    name: string,
    description: string,
}
export const emptyDocType: DocType = {
    id: -1,
    name: '',
    description: '',
    snakeName: ''
}