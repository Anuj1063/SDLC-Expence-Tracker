const Expense = require("../model/expense.model");
class ExpenseController {
    async addExpense(req, res) {
      try {
        const { amount, categoryId, note, date } = req.body;
    
        // Get current month's start and end
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
        // Get total expenses for this category this month
        const totalSpent = await Expense.aggregate([
          {
            $match: {
              userId: req.user._id,
              categoryId: new mongoose.Types.ObjectId(categoryId),
              date: { $gte: startOfMonth, $lte: endOfMonth }
            }
          },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
    
        const spentAmount = totalSpent[0]?.total || 0;
    
        // Get budget for this category
        const budget = await Budget.findOne({ userId: req.user._id, categoryId });
        const limit = budget?.amount || 0;
    
        // Check if adding this expense will exceed budget
        const willExceed = spentAmount + amount > limit;
    
        const expense = new Expense({
          userId: req.user._id,
          amount,
          categoryId,
          note,
          date
        });
        await expense.save();
    
        res.status(201).json({ 
          message: 'Expense added', 
          expense,
          budgetExceeded: willExceed,
          currentTotal: spentAmount + amount,
          budgetLimit: limit
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    async getExpenses(req, res) {
      try {
        const { start, end, category, min, max } = req.query;
        const filters = { userId: req.user._id };
    
        if (start && end) filters.date = { $gte: new Date(start), $lte: new Date(end) };
        if (category) filters.categoryId = category;
        if (min || max) filters.amount = {
          ...(min && { $gte: Number(min) }),
          ...(max && { $lte: Number(max) })
        };
    
        const expenses = await Expense.find(filters).populate('categoryId');
        res.status(200).json(expenses);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    async updateExpense(req, res) {
      try {
        const updated = await Expense.findOneAndUpdate(
          { _id: req.params.id, userId: req.user._id },
          req.body,
          { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Expense not found' });
        res.status(200).json(updated);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    async deleteExpense(req, res) {
      try {
        const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) return res.status(404).json({ message: 'Expense not found' });
        res.status(200).json({ message: 'Expense deleted' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
}

module.exports = new ExpenseController();