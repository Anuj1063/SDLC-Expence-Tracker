const Budget = require("../model/budget.model");

class BudgetController {
    async setBudget(req, res) {
      try {
        const { categoryId, amount, frequency } = req.body;
        const budget = await Budget.findOneAndUpdate(
          { userId: req.user._id, categoryId },
          { amount, frequency },
          { upsert: true, new: true }
        );
        res.status(200).json({ message: 'Budget saved', budget });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    async getBudgets(req, res) {
      try {
        const budgets = await Budget.find({ userId: req.user._id }).populate('categoryId');
        res.status(200).json(budgets);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    async updateBudgets(req, res) {
      try {
        const updated = await Budget.findOneAndUpdate(
          { _id: req.params.id, userId: req.user._id },
          req.body,
          { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json(updated);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    async deleteBudget(req, res) {
      try {
        const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json({ message: 'Budget deleted' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
}

module.exports = new BudgetController();