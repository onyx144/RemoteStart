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
const app = (0, express_1.default)();
const sendTextToTerminal = (text, interval) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => setTimeout(resolve, interval));
    for (let i = 0; i < 10; i++) {
        yield nut_js_1.keyboard.type(text); // Печатаем текст
        //await keyboaorrd.pressKey(Key.Enter); // Отправляем текст с Enter
        //await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка 1 сек
    }
});
// Открываем новый терминал и делаем его активным
app.get('/open-terminal', (req, res) => {
    const batFilePath = path_1.default.join(__dirname, 'temp_script.bat'); // Абсолютный путь к .bat файлу
    // Содержимое .bat файла, которое будет выполняться в терминале
    const batContent = `
    @echo off
    :start
    echo Lorem
    timeout /t 0.5
    goto start
  `;
    // Создаём .bat файл
    (0, fs_1.writeFile)(batFilePath, batContent, (writeErr) => {
        if (writeErr) {
            return res.status(500).send(`Error creating bat file: ${writeErr.message}`);
        }
        // Запускаем .bat файл, передавая абсолютный путь
        (0, child_process_1.exec)(`start cmd /k "${batFilePath}"`, (execErr, stdout, stderr) => {
            console.log('test');
            if (execErr) {
                return res.status(500).send(`Error executing bat file: ${execErr.message}`);
            }
            // После выполнения удаляем временный .bat файл
            // unlink(batFilePath, (unlinkErr) => {
            //   if (unlinkErr) {
            //     console.error(`Error deleting bat file: ${unlinkErr.message}`);
            //   }
            // });
            res.send('Terminal opened and text sent');
        });
    });
});
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
