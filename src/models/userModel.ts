import { User as PrismaUser } from '@prisma/client';
import prisma from '../utils/db';
import userType from '../types/userType';

class User {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  profilePicture?: string;

  constructor(user: userType) {
    this.email = user.email;
    this.username = user.username;
    this.firstName = user.firstName ?? '';
    this.lastName = user.lastName ?? '';
    this.age = user.age??0;
  }

  getFullName():string | null{
    if(this.firstName && this.lastName)
        return this.firstName + this.lastName;
    return null;
  }
  // Example static method to find a user by email
  static async findByEmail(email: string): Promise<PrismaUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  
  async saveToDb():Promise<PrismaUser>{
    const newUser = await prisma.user.create({
        data : {
            email : this.email,
            username : this.username,
            firstName : this.firstName,
            lastName : this.lastName,
            age : this.age,
            profilePicture : this.profilePicture
        },
    });
    return newUser;
  }
  // Other methods specific to User can be added here
}

export default User;