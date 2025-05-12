/* ========================================================================== *
 * SHARED: Types
 * ========================================================================== */

// Domain mapping types
export interface DomainMapping {
	question_id: string;
	domain: string;
}

// Answer types
export interface Answer {
	value: number;
	question_id: string;
}

export interface AnswerOption {
	title: string;
	value: number;
}

// Question types
export interface Question {
	question_id: string;
	title: string;
}

// Section types
export interface Section {
	type: string;
	title: string;
	answers: AnswerOption[];
	questions: Question[];
}

// Screener content types
export interface ScreenerContent {
	sections: Section[];
	display_name: string;
}

// Screener types
export interface Screener {
	id: string;
	name: string;
	disorder: string;
	content: ScreenerContent;
	full_name: string;
}

// Request and response types
export interface ScoreRequest {
	answers: Answer[];
}

export interface ScoreResponse {
	results: string[];
}

// Assessment criteria
export interface AssessmentCriteria {
	domain: string;
	minScore: number;
	assessment: string;
}
