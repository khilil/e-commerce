import { Router } from "express";
import { createProduct, deleteCategories, deleteProduct, editProduct, getAllCategories, getAllProducts, getProductById } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route('/create-product').post(
    upload.fields([
        {
            name: 'images',
            maxCount: 4,
        },
    ]),
    createProduct)

router.route('/edit-product/:id').patch(upload.fields([
    {
        name: 'images',
        maxCount: 4,
    },
]), editProduct)

router.route('/delete-product/:id').delete(deleteProduct)
router.route('/getAllProsuct').get(getAllProducts)
router.route('/getAllProducts/:id').get(getProductById)
router.route('/getAllCategories').get(getAllCategories)
router.route('/deleteCategories/:id').delete(deleteCategories)

export default router 