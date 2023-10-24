const { Router } = require("express");

const {
  getUsers,
  getUserID,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

const router = Router();

router.get("/", getUsers);

router.get("/:id", getUserID);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
