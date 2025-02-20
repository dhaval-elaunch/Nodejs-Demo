"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({ username, password: hashedPassword, email });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_model_1.default.findOne({ username });
        if (!user)
            return res.status(400).json({ message: 'User not found' });
        const validPass = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPass)
            return res.status(400).json({ message: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Login error', error });
    }
});
exports.login = login;
const logout = (req, res) => {
    // In a stateless JWT system, logout typically involves invalidating the token on the client side
    // Here we're just sending a message
    res.json({ message: 'Logged out' });
};
exports.logout = logout;
