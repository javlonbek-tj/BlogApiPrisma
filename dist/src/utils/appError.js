"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.statusCode = statusCode;
        this.errors = errors;
    }
    static UnauthenticatedError() {
        return new ApiError(401, 'User not authenticated');
    }
    static UnauthorizedError() {
        return new ApiError(403, 'You are not allowed to do this action');
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}
exports.default = ApiError;
