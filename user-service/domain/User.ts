export class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public updatedAt: Date,
    public firstName: string | null,
  public lastName: string | null,
   
  ) {}

  updateProfile(update: UpdateUserProfileInput) {
    if (update.email !== undefined) this.email = update.email;
    if (update.firstName !== undefined) this.firstName = update.firstName;
    if (update.lastName !== undefined) this.lastName = update.lastName;
  }
}

export interface UpdateUserProfileInput {
  email?: string;
  firstName?: string;
  lastName?: string;
}
