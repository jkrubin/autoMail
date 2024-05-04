export type Field = {
    id: number;
    name: string;
    description: string;
    snakeName: string;
    userId?: number;
    updatedAt?: string;
    createdAt?: string;
}

export const emptyField: Field = {
    id: -1,
    name: '',
    description: '',
    snakeName: ''
}
export type FieldInput = {
    name: string, 
    description: string,
}