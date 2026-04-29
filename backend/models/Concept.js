const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConceptSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, enum: ['Math', 'Science', 'History'], required: true },
    relatedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Concept', ConceptSchema);
