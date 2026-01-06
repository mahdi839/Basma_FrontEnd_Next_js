module.exports = {
  apps: [{
    name: 'eyarafashion-nextjs',
    script: '.next/standalone/server.js',
    cwd: '/home/eyarafashion/public_html',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    error_file: '/home/eyarafashion/logs/pm2-error.log',
    out_file: '/home/eyarafashion/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '5s',
    watch: false
  }]
}
