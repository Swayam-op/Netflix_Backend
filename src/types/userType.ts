interface userType{
    id?: number;
    email: string;
    username: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    age?: number;
    profilePicture?: string;
}

export default userType;