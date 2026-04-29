// database/schemas.js

// Users Collection
const UserSchema = {
    username: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
};

// ChatHistory Collection
const ChatHistorySchema = {
    userId: { type: 'ObjectId', ref: 'User', required: true },
    questionId: { type: 'ObjectId', ref: 'Question', required: true },
    response: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
};

// Questions Collection
const QuestionSchema = {
    text: { type: String, required: true },
    subject: { type: String, enum: ['Math', 'Science', 'History'], required: true },
    createdAt: { type: Date, default: Date.now }
};

// Concepts Collection
const ConceptSchema = {
    name: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, enum: ['Math', 'Science', 'History'], required: true },
    relatedQuestions: [{ type: 'ObjectId', ref: 'Question' }]
};
