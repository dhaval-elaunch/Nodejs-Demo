"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5001;
const DB_URL = process.env.DB_URL;
mongoose_1.default.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log('Connected to MongoDB');
    app_1.default.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(error => console.error('MongoDB connection error:', error));
