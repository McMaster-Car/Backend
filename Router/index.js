const UserRouter = require("./User/index.js");
const ProductsRouter = require("./Products/index.js")
const AttributeRouter = require("./Attribute/index.js");
const categoryRouter = require("./Category/index.js");

const routes = [
    {
        path: "/user",
        handler: UserRouter,
    },
    {
        path: "/products",
        handler: ProductsRouter,
    },
    {
        path: "/attributes",
        handler: AttributeRouter,
    },
    {
        path: "/categories",
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
