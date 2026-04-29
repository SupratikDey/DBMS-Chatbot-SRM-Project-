const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    response: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
