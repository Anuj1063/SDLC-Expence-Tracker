const categoryModel = require("../model/category.model");

class CategoryController {
    async addCategory(req, res) {
        try {
            const exists = await categoryModel.findOne({ name: req.body.name, userId: req.user._id });
            if (exists) return res.status(400).json({ message: 'Category already exists' });
        
            const category = new categoryModel({
              name: req.body.name,
              userId: req.user._id,
              isDefault: false
            });
            await category.save();
            res.status(201).json({message: 'Category created successfully ' , category: category});
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
    }
    async getDefaultCategories(req, res) {
        try {
            const category = await categoryModel.find({ isDefault: true });
            res.json({message: 'Default category fetched successfully ' , category: category});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async getallCategories(req, res) {
        try {
            const categories = await categoryModel.find({ userId: req.user._id });
            res.json({message: 'Categories fetched successfully ' , categories: categories});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async deleteCategory(req, res) {
        try {
            const category = await categoryModel.findOne({ _id: req.params.id });
            console.log(category,"category");
            if (!category) return res.status(404).json({ message: 'Category not found' });
            if (category.isDefault || category.userId.toString() !== req.user._id.toString())
              return res.status(403).json({ message: 'Cannot delete this category' });
        
            await category.deleteOne();
            res.json({ message: 'Category deleted' });
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
    }
}

module.exports = new CategoryController();