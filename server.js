const { spawn } = require('child_process');

const child = spawn('npm', ['run', 'start'], { stdio: 'inherit', shell: true });

child.on('exit', (code) => {
  console.log(`Child process exited with code ${code}`);
});
