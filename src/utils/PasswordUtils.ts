import bcrypt from 'bcryptjs';

export class PasswordUtils {
  private static saltRounds: number = 10; // Default salt rounds

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
