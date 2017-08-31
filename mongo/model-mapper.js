module.exports = {

    MapExpenses: function (expenses) {
        return expenses.map(e => this.MapExpense(e))
    },

    MapExpense: function (expense) {
        let expenseWire = {
            id: expense._id,
            amount: expense.amount,
            store: expense.store,
            created: expense.created,
            updated: expense.update,
            profile: profile = {
                id: expense.profile.id,
                givenName: expense.profile.givenName
            }
        }
        return expenseWire
    }
}
