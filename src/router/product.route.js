import { Router } from "express";
import { createProduct, deleteProduct } from "../controller/product.controller.js";
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

router.route('/delete-product/:id').delete(deleteProduct)

export default router 