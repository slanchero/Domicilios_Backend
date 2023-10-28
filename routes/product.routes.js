const {Router}=require("express");
const {createProduct,deleteProduct,getProduct,getProducts,updateProduct}=require("../controllers/product.controller");

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
