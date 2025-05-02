import { db } from "./db.js"; // Adjust the path as necessary
import { UserAnswer } from "./schema.js"; // Adjust the path as necessary
import { v4 as uuidv4 } from "uuid";

const questions = [
  "What is your greatest strength?",
  "What is your greatest weakness?",
  "Why do you want to work here?",
  "Where do you see yourself in five years?",
  "Why should we hire you?",
];

const generateRandomAnswer = () => {
  const answers = [
    "I am a quick learner and adapt easily to new environments.",
    "I tend to be a perfectionist, which can slow me down.",
    "I admire the company's values and mission.",
    "I see myself in a leadership role, contributing to the company's growth.",
    "I believe my skills and experiences align well with the job requirements.",
  ];
  const feedbacks = [
    "Good answer, but provide more examples.",
    "Needs improvement in clarity.",
    "Excellent response!",
    "Consider elaborating on your skills.",
    "Satisfactory answer.",
  ];
  const ratings = [1, 2, 3, 4, 5];

  return {
    userAns: answers[Math.floor(Math.random() * answers.length)],
    feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
    rating: ratings[Math.floor(Math.random() * ratings.length)],
  };
};

const insertMockData = async () => {
  const mockId = uuidv4(); // Use a single mockId for all candidates

  for (let i = 1; i <= 10; i++) {
    for (const question of questions) {
      const { userAns, feedback, rating } = generateRandomAnswer();
      await db.insert(UserAnswer).values({
        mockIdRef: mockId,
        question: question,
        correctAns: "This is a placeholder for the correct answer.",
        userAns: userAns,
        feedback: feedback,
        rating: rating.toString(),
        userEmail: `candidate${i}@example.com`,
        createdAt: new Date().toISOString(),
      });
    }
  }
  console.log("Mock data inserted successfully.");
};

insertMockData().catch(console.error);
