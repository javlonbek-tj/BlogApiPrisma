"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_extra_1 = require("fs-extra");
const app_root_path_1 = require("app-root-path");
const format_1 = __importDefault(require("date-fns/format"));
const fileStorage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const destinationDir = 'uploads';
        await (0, fs_extra_1.ensureDir)(destinationDir);
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const dateFolder = (0, format_1.default)(new Date(), 'yyyy-MM-dd');
        const uploadFolder = `${app_root_path_1.path}/uploads/${dateFolder}`;
        cb(null, uploadFolder + '-' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('/image')) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const maxSize = 2 * 1024 * 1024;
const upload = (0, multer_1.default)({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
});
exports.default = upload;
