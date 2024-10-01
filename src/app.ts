import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import { keyboard, Key } from '@nut-tree/nut-js';

const app = express();

const sendTextToTerminal = async (text: string, interval: number) => {
  // Задержка перед отправкой текста
  await new Promise(resolve => setTimeout(resolve, interval));
  for (let i = 0; i < 10; i++) { // Отправляем текст 10 раз
    await keyboard.type(text); // Печатаем текст
    await keyboard.pressKey(Key.Enter); // Нажимаем Enter
    await new Promise(resolve => setTimeout(resolve, 1000)); // Ждем 1 секунду перед следующей отправкой
  }
};

// Open a new terminal
app.get('/open-terminal', (req: Request, res: Response) => {
  exec('start cmd', (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send('Error opening terminal');
    }
    res.send('Terminal opened');
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
