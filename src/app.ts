import express, { Request, Response } from 'express';
import { exec } from 'child_process';

const app = express();

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
