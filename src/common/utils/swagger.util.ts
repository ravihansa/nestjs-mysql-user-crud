import { DocumentBuilder, SwaggerDocumentOptions, SwaggerCustomOptions } from '@nestjs/swagger';

export const swgrConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for specific endpoints')
    .setVersion('1.0')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
    })
    .build();

export const swgrOptions: SwaggerDocumentOptions = {
    operationIdFactory: (
        controllerKey: string,
        methodKey: string
    ) => methodKey // Use custom url path format in the documentation
};

export const swgrCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: { defaultModelsExpandDepth: -1 }, // Hide the Schemas(DTOs) section from the documentation
};
