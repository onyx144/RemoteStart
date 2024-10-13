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
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const nut_js_1 = require("@nut-tree-fork/nut-js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os = require('os');
const app = (0, express_1.default)();
function startUrl(url) {//Function from url open
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        (0, child_process_1.exec)(`start chrome ${url}`, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error('Error opening browser:', err);
                reject(err);
                return;
            }
            console.log('Browser opened, waiting to toggle fullscreen mode...');
            // Устанавливаем задержку 2 секунды (2000 миллисекунд)
            yield new Promise(resolve => setTimeout(resolve, 2000));
            // Переключаем в полноэкранный режим
            yield nut_js_1.keyboard.pressKey(nut_js_1.Key.F11);
            yield nut_js_1.keyboard.releaseKey(nut_js_1.Key.F11);
            console.log('Fullscreen mode toggled');
            resolve();
        }));
    }));
}
app.get('/open-terminal', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query.url || 'https://nesmeyanov.pro/birtsdate.html'; // Значение URL из запроса или дефолтное значение
    const message = req.query.message || 'Happy Birthday';
    yield startUrl(url);
    yield new Promise(resolve => setTimeout(resolve, 2000));
    const batFilePath = path_1.default.join(os.tmpdir(), 'temp_script.bat');
    const batContent = `
    @echo off
:start
echo ${message}
ping 127.0.0.1 -n 1 -w 500 >nul
goto start
exit
  `;
    (0, fs_1.writeFile)(batFilePath, batContent, (writeErr) => {
        if (writeErr) {
            return res.status(500).send(`Error creating bat file: ${writeErr.message}`);
        }
        (0, child_process_1.exec)(`start cmd /k "${batFilePath}"`, (execErr, stdout, stderr) => {
            console.log('test');
            if (execErr) {
                return res.status(500).send(`Error executing bat file: ${execErr.message}`);
            }
            setTimeout(() => {
                (0, fs_1.unlink)(batFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting bat file: ${unlinkErr.message}`);
                    }
                });
            }, 5000); // 5 секунд
            res.send('Terminal opened, text displayed, and terminal will close after 5 seconds');
        });
    });
}));
// Open a browser in fullscreen mode (F11 equivalent)
app.get('/open-browser-fullscreen', (req, res) => {
    const url = 'https://nesmeyanov.pro/birtsdate.html';
    (0, child_process_1.exec)(`start chrome ${url}`, (err, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(500).send('Error opening browser');
        }
        yield new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 сек
        yield nut_js_1.keyboard.pressKey(nut_js_1.Key.F11);
        yield nut_js_1.keyboard.releaseKey(nut_js_1.Key.F11);
        res.send('Browser opened and fullscreen mode activated with video playing');
    }));
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
