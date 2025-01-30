import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {

    @IsNotEmpty()
    companyName: string;

    @IsNotEmpty()
    address: string;

}
