import {defineConfig} from 'umi';

export default defineConfig({
  crossorigin: true,
  dva: {
    immer: true,
    hmr: true
  },
  lessLoader: {
    lessLoaderOptions: {}
  },
  nodeModulesTransform: {
    type: 'none'
  },
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/app.layout',
      routes: [
        {
          exact: true,
          path: '/pages/websites/:id/development',
          component: '@/pages/website/mode/development'
        }
      ]
    }
  ]
});
