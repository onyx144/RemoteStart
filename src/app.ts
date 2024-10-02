import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import { keyboard, Key } from '@nut-tree-fork/nut-js';

const app = express();

const sendTextToTerminal = async (text: string, interval: number) => {
  await new Promise(resolve => setTimeout(resolve, interval));
  for (let i = 0; i < 10; i++) {
    await keyboard.type(text); // Печатаем текст
    await keyboard.pressKey(Key.Enter); // Отправляем текст с Enter
    await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка 1 сек
  }
};

// Открываем новый терминал и делаем его активным
app.get('/open-terminal', (req: Request, res: Response) => {
  exec('start cmd', async (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send('Error opening terminal');
    }

    res.send('Terminal openeds');
    await new Promise(resolve => setTimeout(resolve, 2000));
    sendTextToTerminal('Lorem', 1000); // Пример отправки текста с задержкой
  });
});

// Open a browser in fullscreen mode (F11 equivalent)
app.get('/open-browser-fullscreen', (req: Request, res: Response) => {
  exec('start chrome --start-fullscreen', (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send('Error opening browser in fullscreen mode');
    }
    res.send('Browser opened in fullscreen mode');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
