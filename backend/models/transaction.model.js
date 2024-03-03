import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: true,
        required: true
    },
    paymentType: {
        type: String,
        enum: ["cash", "card"],
        required: true    
    },
    category: {
        type: String,
        enum: ["saving", "expence", "investment"],
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        default: "unknown"
    },
    date: {
        type: Date,
        required: true
    }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;