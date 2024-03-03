const transactionTypeDef = `#graphql
  type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
  }

  type Query {
    transactions: [Transaction!],
    transaction(transactionId: ID): Transaction
  }

  type Mutation {
    createTransaction(input: createTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(transactionId: ID!): Transaction!
  }

  input createTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    data: String!
    location: String!
  }

  input UpdateTransactionInput {
    transactionId: ID!
    description: String
    paymentType: String
    category: String
    amount: Float
    data: String
    location: String
  }

`;

export default transactionTypeDef;
