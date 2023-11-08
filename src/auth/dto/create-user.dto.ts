import {IsEmail, IsString, Length} from "@nestjs/class-validator";

export class CreateUserDto {

    @IsString({message: 'Only string values'})
    // @IsEmail({}, {message: "Incorrect email"})
    email: string;

    @IsString({message: 'Only string values'})
    @Length(4, 16, {message: 'At list 4 to 16 characters'})
    password: string;

}