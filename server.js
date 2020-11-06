const path = require("path");
const express = require("express");
const sequelize = require("./config/connection");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const routes = require("./controllers");

const exphbs = require("express-handlebars");
const hbs = exphbs.create({});
// const helpers = require('./utils/helpers');

// const sess = {
//     secret: process.env.DB_SECRET,
//     cookie: {},
//     resave: false,
//     saveUninitialized: true,
//     store: new SequelizeStore({
//         db: sequelize,
//         checkExpirationInterval: 1000 * 60 * 10, // will check every 10 minutes
//         expiration: 1000 * 60 * 30 // will expire after 30 minutes
//     })
// };

const app = express();
const PORT = process.env.PORT || 3001;

// app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(routes);

sequelize.sync();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
