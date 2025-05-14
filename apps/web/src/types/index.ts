export interface Answer {
	title: string;
	value: number;
}

export interface Question {
	id: number;
	title: string;
}

export interface Section {
	id: number;
	type: string;
	title: string;
	questions: Question[];
	answers: Answer[];
}

export interface AssessmentContent {
	sections: Section[];
	displayName: string;
}

export interface Assessment {
	id: number;
	name: string;
	disorder: string;
	content: AssessmentContent;
	fullName: string;
}

// Define types for the user's answers
export interface UserAnswer {
	value: number;
	questionId: number;
}

// Define types for the API response after submission
export interface SubmissionResponse {
	results: string[];
}
