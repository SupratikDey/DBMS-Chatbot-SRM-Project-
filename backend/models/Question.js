const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    text: { type: String, required: true },
    subject: { type: String, enum: ['Math', 'Science', 'History'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);
