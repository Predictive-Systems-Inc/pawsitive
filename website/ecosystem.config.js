module.exports = {
  apps: [
    {
      name: 'pawsitive',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'fastapi-app',
      script: 'uvicorn',
      args: 'api.index:app --host 0.0.0.0 --port 8000',
      interpreter: 'python3',
      env: {
        PORT: 8000,
      }
    }
  ]
};