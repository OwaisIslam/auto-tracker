const router = require("express").Router();
const session = require("express-session");
const {
  Owner,
  Auto,
  Driver
} = require("../../models");

////////////////////////////////////////////////////////////////////////////////////////////////
// Route to get all owners
router.get("/", (req, res) => {
  Owner.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    })
    .then((dbOwnerData) => res.json(dbOwnerData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/logout", (req, res) => {
  req.session.owner_id = "";
    req.session.email = "";
    req.session.loggedIn = false;
  res.redirect("/")
})
//////////////////////////////////////////////////////////////////////////////////////////////////
// This is the login route
router.get("/login", (req, res) => {
  console.log("In login route");
  console.log("req.body", req.body);
  console.log("req.query", req.query);
  // Query operation to validate a user
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  Owner.findOne({
    where: {
      email: req.query.email,
    },
  }).then((dbOwnerData) => {
    console.log("In owner.findOne.", dbOwnerData);
    if (!dbOwnerData) {
      console.log("no owner");
      res.status(400).json({
        message: "No user with that email address!"
      });
      return;
    }

    // Verify user by comparing passwords.  The database hashed password will be
    // in 'dbUserData', while the plaintext (user entered) password will be in req.body.
    const validPassword = dbOwnerData.checkPassword(req.query.password);

    if (!validPassword) {
      console.log("bad password");
      res.status(400).json({
        message: "Incorrect password!"
      });
      return;
    }

    // declare session variables
    console.log("ownerID: ", dbOwnerData.id);
    req.session.owner_id = dbOwnerData.id;
    req.session.email = dbOwnerData.email;
    req.session.loggedIn = true;
    console.log("logged in")
    res.redirect("/vehicle");
  })
});

////////////////////////////////////////////////////////////////////////////////////////////////
// Route to get one specific owner by ID
router.get("/:id", (req, res) => {
  Owner.findOne({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      where: {
        id: req.params.id,
      },
      include: [{
        model: Auto,
        attributes: [
          "id",
          "make",
          "model",
          "color",
          "year",
          "mileage",
          "vin",
          "license_plate",
          "registration_expiration",
          "insurance_expiration",
          "oil_mileage",
          "tire_mileage",
        ],
      }, ],
    })
    .then((dbOwnerData) => {
      if (!dbOwnerData) {
        res.status(404).json({
          message: "No owner found with this id",
        });
        return;
      }
      res.json(dbOwnerData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////
// Route to create (add) an owner
router.post("/", (req, res) => {
  Owner.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    })
    .then((dbOwnerData) => {
      // Commented out below for now until we set up a session login.

      // req.session.save(() => {
        // declare session variables
        req.session.owner_id = dbOwnerData.id;
        req.session.email = dbOwnerData.email;
        req.session.loggedIn = true;
        res.json(dbOwnerData);
      // })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////
// Route to update the data for one specific owner by ID
router.put("/:id", (req, res) => {
  Owner.update({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    }, {
      where: {
        id: req.params.id,
      },
    })
    .then((dbOwnerData) => {
      if (!dbOwnerData) {
        res.status(404).json({
          message: "No owner found with this id!",
        });
        return;
      }
      res.json(dbOwnerData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////
// Route to delete one specific owner by ID
router.delete("/:id", (req, res) => {
  Owner.destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((dbOwnerData) => {
      if (!dbOwnerData) {
        res.status(404).json({
          message: "No owner found with this id!",
        });
        return;
      }
      res.json(dbOwnerData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;