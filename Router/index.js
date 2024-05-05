const UserRouter = require("./User/index.js");
const ProductsRouter = require("./Products/index.js")

const routes = [
    {
        path: "/api/user",
        handler: UserRouter,
    },
    {
        path: "/api/products",
        handler: ProductsRouter,
    },
];

exports.connectRoute = (app) => {
    routes.forEach((route) => {
        app.use(route.path, route.handler);
    });

    app.use('*', (req, res) => {
        res.status(404).send({ message: 'No such URL found' });
    });
};
