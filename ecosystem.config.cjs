module.exports = {
  apps: [
    {
      name: 'vite-app',
      script: 'npx',
      args: 'serve dist --port 3220',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
