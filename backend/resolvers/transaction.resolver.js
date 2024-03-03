import { transactions } from "../dummy-data/data.js";

const transactionResolver = {
    Query: {
        transactions: () => {
            return transactions
        }
    },
    Mutation: {}
}

export default transactionResolver;
