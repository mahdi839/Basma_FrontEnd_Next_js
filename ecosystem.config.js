module.exports = {
  apps: [
    {
      name: "eyarafashion-nextjs",
      cwd: "/home/eyarafashion/public_html",
      script: "npm",
      args: "start",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "2G"
    }
  ]
};