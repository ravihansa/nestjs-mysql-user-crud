import * as Joi from 'joi';

export const CreateUserCompanySchema = Joi.object({
    fName: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 3 characters',
        'string.max': 'First name must be at most 100 characters',
    }),
    lName: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Larst name is required',
        'string.min': 'Larst name must be at least 3 characters',
        'string.max': 'Larst name must be at most 100 characters',
    }),
    userName: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'userName is required',
        'string.min': 'userName must be at least 3 characters',
        'string.max': 'userName must be at most 30 characters',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().min(3).max(10).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 3 characters',
        'string.max': 'Password must be at most 10 characters',
    }),
    roleName: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Role name is required',
        'string.min': 'Role name must be at least 3 characters',
        'string.max': 'Role name must be at most 100 characters',
    }),
    companyData: Joi.array()
        .items(
            Joi.object({
                companyName: Joi.string().min(3).max(100).required().messages({
                    'string.empty': 'Company name is required',
                    'string.min': 'Company name must be at least 3 characters',
                    'string.max': 'Company name must be at most 100 characters',
                }),
                address: Joi.string().min(5).max(100).required().messages({
                    'string.empty': 'Address is required',
                    'string.min': 'Address must be at least 5 characters',
                    'string.max': 'Address must be at most 100 characters',
                }),
            }),
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one company must be provided',
        }),
});
