module.exports = {
  apps: [{
    name: 'eyarafashion-nextjs',
    script: '.next/standalone/server.js',
    cwd: '/home/eyarafashion/public_html',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}