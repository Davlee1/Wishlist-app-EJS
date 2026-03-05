require("dotenv").config();
require("express-async-errors");

const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");

const url = process.env.MONGO_URI;
const app = express();

/* ---------------- Security Middleware ---------------- */

app.use(helmet());
app.use(xssClean());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);


/* ---------------- Body + Cookie Parseers ---------------- */
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));

/*------------------Session Store------------------*/
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", console.log);

/*------------------Defines Session Config OBJ------------------*/
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}
app.use(session(sessionParms));

/*------------------Passport------------------*/
const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

/*------------------Flash------------------*/
app.use(require("connect-flash")());
app.use(require("./middleware/storeLocals"));

/*------------------CSRF------------------*/
const csrfMiddleware = csrf.csrf();

app.use(csrfMiddleware);
app.use((req, res, next) => {
  res.locals._csrf = csrf.getToken(req, res);
  next();
});

/* ---------------- Routes ---------------- */
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);
const wishlistRouter = require("./routes/wishlist");
app.use("/wishlist", auth, wishlistRouter);

/* ---------------- Errors ---------------- */
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

/* ---------------- START SERVER ---------------- */
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
