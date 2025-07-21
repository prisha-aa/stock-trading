export interface TokenRepositoryPort {
    save(token:{userId:number;token:string;createdAt:Date}): Promise<void>;
    delete(token:string): Promise<void>;
    exists(token:string): Promise<boolean>;
    findByToken(token: string): Promise<{ userId: number; token: string; createdAt: Date } | null>;

}