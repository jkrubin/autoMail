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
