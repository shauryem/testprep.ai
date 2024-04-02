export interface Question {
    question: string;
    options: string[]; // Since your options are strings like "A: Option 1"
    correctAnswer: string; // This will correspond to the correct option directly, e.g., "C: Option 3"
  }
  
export interface Test {
    questions: Question[];
}
  
export interface UserAnswers {
    [questionIndex: number]: string; // Maps a question index to the user's selected answer
}