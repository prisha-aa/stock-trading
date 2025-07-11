export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
