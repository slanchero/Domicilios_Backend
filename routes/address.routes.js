const { Router } = require("express");

const {
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
  createAddress,
} = require("../controllers/address.controller");

const router = Router();

router.get("/", getAddresses);

router.get("/:id", getAddress);

router.post("/", createAddress);

router.put("/:id", updateAddress);

router.delete("/:id", deleteAddress);

module.exports = router;
