import { Router } from "express";
import { createProduct, deleteProduct, editProduct } from "../controller/product.controller.js";
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

export default router 