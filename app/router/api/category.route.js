const router= require('express').Router();
const categoryIconUpload = require('../../helper/categoriesIconUpload');
const categoryController= require('../../module/category/controller/category.controller');
const authCheck= require('../../middleware/auth.middleware')();

router.post('/add-category',authCheck.authenticateAPI,categoryIconUpload.single('icon'),categoryController.addCategory)
router.get('/get-all-categories',authCheck.authenticateAPI,categoryController.getallCategories)
router.get('/get-default-categories',categoryController.getDefaultCategories)
router.delete('/delete-category/:id',authCheck.authenticateAPI,categoryController.deleteCategory)

module.exports=router