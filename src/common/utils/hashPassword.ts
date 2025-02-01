import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Optimal balance between security & performance
    return bcrypt.hash(password, saltRounds);
}
