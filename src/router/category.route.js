import express from 'express'
import { createCategory, deleteCategories, getAllCategories } from "../controller/category.controller.js";

const router = express.Router();

router.route('/create').post(createCategory);
router.route('/getAllCategories').get(getAllCategories)
router.route('/deleteCategories/:id').delete(deleteCategories)

export default router
