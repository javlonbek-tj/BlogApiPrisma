"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.resetPasswordSchema = exports.updatePasswordSchema = exports.updateUserSchema = exports.loginUserSchema = exports.createUserSchema = exports.AwardEnumType = exports.RoleEnumType = void 0;
const zod_1 = require("zod");
var RoleEnumType;
(function (RoleEnumType) {
    RoleEnumType["USER"] = "USER";
    RoleEnumType["ADMIN"] = "ADMIN";
    RoleEnumType["EDITOR"] = "EDITOR";
})(RoleEnumType || (exports.RoleEnumType = RoleEnumType = {}));
var AwardEnumType;
(function (AwardEnumType) {
    AwardEnumType["BRONZE"] = "BRONZE";
    AwardEnumType["SILVER"] = "SILVER";
    AwardEnumType["GOLD"] = "GOLD";
})(AwardEnumType || (exports.AwardEnumType = AwardEnumType = {}));
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstname: zod_1.z
            .string({
            required_error: 'Firstname is required',
            invalid_type_error: 'Firstname must be a string',
        })
            .trim(),
        lastname: zod_1.z
            .string({
            required_error: 'Lastname is required',
            invalid_type_error: 'Lastname must be a string',
        })
            .trim(),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email({ message: 'Invalid email' }),
        profilPhoto: zod_1.z.string().optional(),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(8, { message: 'Password must be more than 8 characters' }),
        passwordConfirm: zod_1.z.string({
            required_error: 'passwordConfirm is required',
        }),
        role: zod_1.z.nativeEnum(RoleEnumType).default(RoleEnumType.USER),
    })
        .refine(data => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email({ message: 'Invalid email' }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstname: zod_1.z
            .string({
            invalid_type_error: 'Firstname must be a string',
        })
            .trim()
            .optional(),
        lastname: zod_1.z
            .string({
            invalid_type_error: 'Lastname must be a string',
        })
            .trim()
            .optional(),
        email: zod_1.z.string().email({ message: 'Invalid email' }).optional(),
        profilPhoto: zod_1.z.string().optional(),
    }),
});
exports.updatePasswordSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        oldPass: zod_1.z.string({
            required_error: 'old Password is required',
        }),
        newPass: zod_1.z
            .string({
            required_error: 'new Password is required',
        })
            .min(8, { message: 'Password must be more than 8 characters' }),
        newPassConfirm: zod_1.z.string({
            required_error: 'passwordConfirm is required',
        }),
    })
        .refine(data => data.newPass === data.newPassConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        password: zod_1.z
            .string({
            required_error: 'new Password is required',
        })
            .min(8, { message: 'Password must be more than 8 characters' }),
        passwordCofirm: zod_1.z.string({
            required_error: 'passwordConfirm is required',
        }),
    })
        .refine(data => data.password === data.passwordCofirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});
exports.getUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string(),
    }),
});
