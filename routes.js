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
        path: '/websites/:id/development',
        component: '@/pages/website/mode/development',
      },
    ],
  },
];

export default routes;
