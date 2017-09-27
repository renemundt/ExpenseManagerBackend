module.exports = {

    MapExpenses: function (expenses) {
        return expenses.map(e => this.MapExpense(e))
    },

    MapExpense: function (expense) {
        let expenseWire = {
            id: expense._id,
            amount: expense.amount,
            store: expense.store,
            timeOfPurchase: expense.timeOfPurchase,
            created: expense.created,
            updated: expense.updated,
            profile: profile = {
                id: expense.profile != null ? expense.profile.id : null,
                givenName: expense.profile != null ? expense.profile.givenName : null
            }
        }
        return expenseWire
    }
}
