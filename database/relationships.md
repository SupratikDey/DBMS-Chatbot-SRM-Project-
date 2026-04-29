In MongoDB, a NoSQL database, we establish logical relationships between collections using references, similar to foreign keys in relational databases.

### Users and ChatHistory (One-to-Many)
- A single `User` can have multiple `ChatHistory` records.
- The `ChatHistory` schema contains a `userId` field of type `ObjectId` that references the `_id` of a document in the `Users` collection.

### Questions and ChatHistory (One-to-One)
- Each `ChatHistory` record is associated with exactly one `Question`.
- The `ChatHistory` schema has a `questionId` field that references a document in the `Questions` collection.

### Questions and Concepts (Many-to-Many)
- A `Question` can be related to multiple `Concepts`, and a `Concept` can be related to multiple `Questions`.
- This is implemented by embedding an array of `questionId`s (`relatedQuestions`) within the `Concepts` collection.
