const express = require('express');
const { exec } = require('child_process');
const { keyboard, Key } = require('@nut-tree-fork/nut-js');
const { writeFile, unlink } = require('fs');
const path = require('path');
const os = require('os');

const app = express();

function startUrl(url) {
  return new Promise(async (resolve, reject) => {
    exec(`start chrome ${url}`, async (err, stdout, stderr) => {
      if (err) {
        console.error('Error opening browser:', err);
        reject(err);
        return;
      }

      console.log('Browser opened, waiting to toggle fullscreen mode...');

      // Устанавливаем задержку 2 секунды (2000 миллисекунд)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Переключаем в полноэкранный режим
      await keyboard.pressKey(Key.F11);
      await keyboard.releaseKey(Key.F11);

      console.log('Fullscreen mode toggled');
      resolve();
    });
  });
}

app.get('/open-terminal', async (req, res) => {
  const url = req.query.url ;
  const message = req.query.message ;

  await startUrl(url);

  await new Promise(resolve => setTimeout(resolve, 2000));

  const batFilePath = path.join(os.tmpdir(), 'temp_script.bat');

  const batContent = `
    @echo off
    :start
    echo ${message}
    ping 127.0.0.1 -n 1 -w 500 >nul
    goto start
    exit
  `;

  writeFile(batFilePath, batContent, (writeErr) => {
    if (writeErr) {
      return res.status(500).send(`Error creating bat file: ${writeErr.message}`);
    }

    exec(`start cmd /k "${batFilePath}"`, (execErr, stdout, stderr) => {
      console.log('test');
      if (execErr) {
        return res.status(500).send(`Error executing bat file: ${execErr.message}`);
      }

      setTimeout(() => {
        unlink(batFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting bat file: ${unlinkErr.message}`);
          }
        });
      }, 5000); // 5 секунд

      res.send('Terminal opened, text displayed, and terminal will close after 5 seconds');
    });
  });
});

// Open a browser in fullscreen mode (F11 equivalent)
app.get('/open-browser-fullscreen', (req, res) => {
  const url = 'https://nesmeyanov.pro/birtsdate.html';

  exec(`start chrome ${url}`, async (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send('Error opening browser');
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    await keyboard.pressKey(Key.F11);
    await keyboard.releaseKey(Key.F11);

    res.send('Browser opened and fullscreen mode activated with video playing');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
