const router=require('express').Router();
const expenseController=require('../../module/expense/controller/expense.controller');
const authCheck=require('../../middleware/auth.middleware')();

router.post('/add-expense',authCheck.authenticateAPI,expenseController.addExpense)
router.get('/get-expenses',authCheck.authenticateAPI,expenseController.getExpenses)
router.post('/update-expense/:id',authCheck.authenticateAPI,expenseController.updateExpense)
router.delete('/delete-expense/:id',authCheck.authenticateAPI,expenseController.deleteExpense)

module.exports=router