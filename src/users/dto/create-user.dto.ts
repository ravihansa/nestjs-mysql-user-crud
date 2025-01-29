import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    fName: string;

    lName: string;

    @IsNotEmpty()
    userName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
