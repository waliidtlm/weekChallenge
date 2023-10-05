const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Library for password hashing
const { body, validationResult, cookie } = require("express-validator");
const rateLimit = require("express-rate-limit");
const xss = require("xss");

const app = express();

const saltRounds = 10; // The number of salt rounds for password hashing
const users = [
  {
    id: 1,
    username: "alice",
    passwordHash: bcrypt.hashSync("user123", saltRounds), // Hash the password and store it
    role: "user",
  },
  {
    id: 2,
    username: "admin",
    passwordHash: bcrypt.hashSync("admin1234", saltRounds), // Hash the password and store it
    role: "admin",
  },
];

// This is to validate and sanitize login inputs
const loginValidator = [
  body("username", "Username cannot be empty").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
];

// This is for Rate Limiter in login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit to 3 login attempts per IP within the window
});

// Define a strong secret key for sessions (consider using an environment variable)
const secretKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5NTY0NzAxOCwiaWF0IjoxNjk1NjQ3MDE4fQ.SMr1eGjU5OJW2Hxa0pzZHLi2a-y-njx2CteH5e0qL5c";

// Middleware
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // This makes me debug for hours, and it is simple
    },
  })
);

const formParser = bodyParser.urlencoded({ extended: false });
app.use(cookieParser());
const csrfProtect = csurf({ cookie: true });
app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // Handle CSRF token errors here
  res.status(403);
  res.send("Form tampered with");
});
app.use(express.json());
app.set("view engine", "ejs"); // Set EJS as the view engine

// Passport.js Config
app.use(passport.initialize());

// Add the middleware to implement a session with Passport.js below:
app.use(passport.session());

// Complete the serializeUser function below:
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

// Passport.js setup
passport.use(
  new LocalStrategy((username, password, done) => {
    const sanitizedUsername = xss(username);
    const sanitizedPassword = xss(password);
    const user = users.find((u) => u.username === sanitizedUsername);

    if (!user) {
      return done(null, false, { message: "Invalid username or password" });
    }

    if (!bcrypt.compareSync(sanitizedPassword, user.passwordHash)) {
      return done(null, false, { message: "Invalid username or password" });
    }

    return done(null, user);
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Authentication App using Passport.js");
});

// Registration form route
app.get("/register", (req, res) => {
  res.render("register", { error: "" }); // Initialize error as an empty string
});

app.post("/register", formParser, (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    // Pass the error message to the template
    return res.render("register", { error: "Username already exists" });
  }

  // Hash the password
  const passwordHash = bcrypt.hashSync(password, saltRounds);

  // Create a new user object and add it to the array
  const newUser = {
    id: users.length + 1,
    username,
    passwordHash,
    role: "user", // You can set the role as needed
  };

  users.push(newUser);

  // Redirect to a success page or login page
  res.redirect("/login");
});

app.get("/login", csrfProtect, (req, res) => {
  // Initialize errors as an empty array
  const errors = [];
  res.render("login", { csrfToken: req.csrfToken(), errors });
});

app.post(
  "/login",
  loginValidator, // to be fixed Later
  loginLimiter,
  formParser,
  csrfProtect,
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render("login", {
          csrfToken: req.csrfToken(),
          errors: [{ msg: info.message }], // Pass the error message as an array
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/profile");
      });
    })(req, res, next);
  }
);

const escapeHtml = (unsafe) => {
  return unsafe.replace(/[&<"']/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
    }
  });
};

app.get("/profile", csrfProtect, (req, res) => {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    res.render("profile", { username, escapeHtml, csrfToken: req.csrfToken() });
  } else {
    res.redirect("/login");
  }
});

// Profile route (protected)
app.get("/profile", csrfProtect, (req, res) => {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    res.render("profile", { username, csrfToken: req.csrfToken() });
  } else {
    res.redirect("/login");
  }
});

// Handle profile updates
app.post("/profile/edit", formParser, csrfProtect, (req, res) => {
  if (req.isAuthenticated()) {
    const { username, password } = req.body;

    // You can update the user's information here, such as changing the username or password.
    // Example: Update the user's username
    req.user.username = username;

    // Redirect back to the profile page
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/login");
      }
    });
  }
});

// Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});