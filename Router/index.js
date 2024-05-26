const UserRouter = require("./User/index.js");
const ProductsRouter = require("./Products/index.js")
const AttributeRouter = require("./Attribute/index.js");
const categoryRouter = require("./Category/index.js");

const routes = [
    {
        path: "/api/user",
        handler: UserRouter,
    },
    {
        path: "/api/products",
        handler: ProductsRouter,
    },
    {
        path: "/api/attributes",
        handler: AttributeRouter,
    },
    {
        path: "/api/categories",
        handler: categoryRouter,
    },
];

exports.connectRoute = (app) => {
    routes.forEach((route) => {
        app.use(route.path, route.handler);
    });

    app.use('/', (req, res, next) => {
        if (req.path === '/') {
            res.send( 'Server is running' );
        } else {
            next();
        }
    });

    app.use('*', (req, res) => {
        res.status(404).send({ message: 'No such URL found' });
    });
};
