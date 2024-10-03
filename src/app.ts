import express, { Request, Response } from 'express';
import { exec , spawn } from 'child_process';
import { keyboard, Key } from '@nut-tree-fork/nut-js';
import { writeFile, unlink } from 'fs';
import path from 'path';

const app = express();

const sendTextToTerminal = async (text: string, interval: number) => {
  await new Promise(resolve => setTimeout(resolve, interval));
  for (let i = 0; i < 10; i++) {
    await keyboard.type(text); // Печатаем текст
    //await keyboaorrd.pressKey(Key.Enter); // Отправляем текст с Enter
    //await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка 1 сек
  }
};

// Открываем новый терминал и делаем его активным
app.get('/open-terminal', (req: Request, res: Response) => {
  const batFilePath = path.join(__dirname, 'temp_script.bat');  // Абсолютный путь к .bat файлу

  // Содержимое .bat файла, которое будет выполняться в терминале
  const batContent = `
    @echo off
    :start
    echo Lorem
    timeout /t 0.5
    goto start
  `;

  // Создаём .bat файл
  writeFile(batFilePath, batContent, (writeErr) => {
    if (writeErr) {
      return res.status(500).send(`Error creating bat file: ${writeErr.message}`);
    }

    // Запускаем .bat файл, передавая абсолютный путь
    exec(`start cmd /k "${batFilePath}"`, (execErr, stdout, stderr) => {
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
app.get('/open-browser-fullscreen', (req: Request, res: Response) => {
  const url = env.url;
  
  exec(`start chrome ${url}`, async (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send('Error opening browser');
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 сек
    await keyboard.pressKey(Key.F11);
    await keyboard.releaseKey(Key.F11);

    res.send('Browser opened and fullscreen mode activated with video playing');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
