import { Schema } from 'joi';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: Schema) { }

    transform(value: any) {
        const { error, value: validatedValue } = this.schema.validate(value, {
            abortEarly: false, // Show all errors, not just the first one
        });

        if (error) {
            throw new BadRequestException(
                error.details.map((detail) => detail.message).join(', '),
            );
        }

        return validatedValue;
    }
}
