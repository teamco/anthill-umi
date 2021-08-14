/**
 * @export
 * @default
 * @constant
 */
const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/app.layout',
    routes: [
      {
        exact: true,
        path: '/websites/:websiteKey/development',
        component: '@/pages/website/mode/development',
      },
    ],
  },
];

export default routes;
