// database/sample_data.js

// Sample User
db.users.insertOne({
    username: "student123"
});

// Sample Question
db.questions.insertOne({
    text: "What is the Pythagorean theorem?",
    subject: "Math"
});

// Let's assume the IDs are:
// User ID: 60d0fe4f5311236168a109ca
// Question ID: 60d0fe5f5311236168a109cb

// Sample Chat History
db.chathistories.insertOne({
    userId: ObjectId("60d0fe4f5311236168a109ca"),
    questionId: ObjectId("60d0fe5f5311236168a109cb"),
    response: "The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse side is equal to the sum of squares of the other two sides.",
    timestamp: new Date()
});

// Sample Concept
db.concepts.insertOne({
    name: "Trigonometry",
    description: "A branch of mathematics that studies relationships between side lengths and angles of triangles.",
    subject: "Math",
    relatedQuestions: [ObjectId("60d0fe5f5311236168a109cb")]
});
