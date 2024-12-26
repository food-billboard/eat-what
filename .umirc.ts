import { defineConfig } from 'umi';
import 'dotenv/config'

const API_DOMAIN = `http://${process.env.RASPBERRY_IP}`;
// const API_DOMAIN = 'http://localhost:4000';

export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  ...(process.env.REACT_APP_ENV === 'prod' ? {
    // base: '/api/backend/eat-what/',
    base: '/',
    publicPath: '/api/backend/eat-what/',
  } : {}),
  define: {
    'process.env.REACT_APP_ENV': process.env.REACT_APP_ENV,
    'process.env.REQUEST_API': process.env.REQUEST_API,
    'process.env.MOCK_USER_MOBILE': process.env.MOCK_USER_MOBILE,
    'process.env.MOCK_USER_PASSWORD': process.env.MOCK_USER_PASSWORD,
    'process.env.MOCK_USER_EMAIL': process.env.MOCK_USER_EMAIL,
    'process.env.API_DOMAIN': API_DOMAIN
  },
  routes: [
    { path: '/', component: '@/pages/Home/index' },
    { path: '/edit', component: '@/pages/Edit/index' },
    { path: '/random', component: '@/pages/Random/index' }
  ],
  npmClient: 'yarn',
  scripts: [
    `
    (function (designWidth, base) {
      var resize = function () {
        document.documentElement.style.fontSize = (window.innerWidth / designWidth) * base + 'px'
      }
      resize()
      window.addEventListener('resize', resize)
    })(375, 10)
    `,
  ],
  proxy: process.env.REACT_APP_ENV === 'dev' ? {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  } : {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^/api/static': '/static' },
    },
  }
});
