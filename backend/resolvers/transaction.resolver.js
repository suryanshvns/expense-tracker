import Transaction from "../models/transaction.model.js";
const transactionResolver = {
    Query: {
        transactions: async(_,__, context) => {
            try{
                if(!context.getUser()) {
                    throw new Error("Unauthorized")
                }
                const userId = await context.getUser()._id;

                const transactions = await Transaction.find({ userId });
                return transactions;
            }catch(err) {
                console.error("Error getting transaction:", err);
                throw new Error("Error getting transactions");
            }
        },

        transaction: async(_,{transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            }catch(err) {
                console.error("Error getting transaction:", err);
                throw new Error("Error getting transaction");
            }
        },

        categoryStatistics: async (_, __, context) => {
			if (!context.getUser()) throw new Error("Unauthorized");

			const userId = context.getUser()._id;
			const transactions = await Transaction.find({ userId });
			const categoryMap = {};

			// const transactions = [
			// 	{ category: "expense", amount: 50 },
			// 	{ category: "expense", amount: 75 },
			// 	{ category: "investment", amount: 100 },
			// 	{ category: "saving", amount: 30 },
			// 	{ category: "saving", amount: 20 }
			// ];

			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount;
			});

			// categoryMap = { expense: 125, investment: 100, saving: 50 }

			return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
			// return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
		},
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
            try{
                const newTransaction = new Transaction({
                    ...input,
                     userId: context.getUser()._id
                });
                await newTransaction.save();
                return newTransaction;
            }catch(err) {
                console.error("Error in creating transaction:", err);
                throw new Error("Error creating transaction");
            }
        },
        updateTransaction: async(_, {input} ) => {
            try{
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new:true});
                return updatedTransaction;
            }catch (err) {
                console.error("Error in updating transaction:", err);
                throw new Error("Error updating transaction");
            }
        },
        deleteTransaction: async(_, {transactionId}) => {
            try{
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            }catch (err) {
                console.error("Error in deleting transaction:", err);
                throw new Error("Error deleting transaction");
            }
        }
    }
};

export default transactionResolver;
