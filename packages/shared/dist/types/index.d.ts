export interface DomainMapping {
    question_id: string;
    domain: string;
}
export interface Answer {
    value: number;
    question_id: string;
}
export interface AnswerOption {
    title: string;
    value: number;
}
export interface Question {
    question_id: string;
    title: string;
}
export interface Section {
    type: string;
    title: string;
    answers: AnswerOption[];
    questions: Question[];
}
export interface ScreenerContent {
    sections: Section[];
    display_name: string;
}
export interface Screener {
    id: string;
    name: string;
    disorder: string;
    content: ScreenerContent;
    full_name: string;
}
export interface ScoreRequest {
    answers: Answer[];
}
export interface ScoreResponse {
    results: string[];
}
export interface AssessmentCriteria {
    domain: string;
    minScore: number;
    assessment: string;
}
