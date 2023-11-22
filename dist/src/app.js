"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const port = config_1.default.get('port');
async function start() {
    try {
        const app = (0, express_1.default)();
        app.use('/uploads', express_1.default.static(path_1.default.resolve('images')));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, helmet_1.default)());
        app.use((0, compression_1.default)());
        app.use((0, cors_1.default)({
            credentials: true,
            origin: config_1.default.get('clientUrl'),
        }));
        app.use('/api/v1', routes_1.default);
        app.use('*', (req, res) => {
            res.status(404).json({
                status: 'fail',
                message: `${req.originalUrl} - Route Not Found`,
            });
        });
        app.use(error_middleware_1.default);
        app.listen(port, () => {
            logger_1.default.info(`Server started on port: ${port}`);
        });
    }
    catch (e) {
        logger_1.default.error('Error in starting server', e);
    }
}
start();
