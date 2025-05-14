import type {
	Answer,
	Question,
	Assessment,
	UserAnswer,
	SubmissionResponse,
} from "@/types";
import type {
	AnswerOptionProps,
} from '@/components'

import { useCallback, useEffect, useState, useRef } from 'react'
import { Route, Routes } from 'react-router';

import {
	Card,
	CardDescription,
	CardTitle,
	CardHeader,
	CardContent,
} from "@/components/ui/card"

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

import {
	AnswerOption,
} from '@/components'


function Home() {
	const [assessment, setAssessment] = useState<Assessment | null>(null);
	const refAssessment = useRef<Assessment | null>(assessment);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [results, setResults] = useState<string[] | null>(null);
	const refUserAnswers = useRef<Map<Question['id'], Answer['value']>>(new Map());

	useEffect(() => {
		const fetchAssessment = async () => {
			try {
				const response = await fetch('http://localhost:3000/api/assessments/1');
				if (!response.ok) {
					throw new Error('Failed to fetch assessment');
				}
				const data = await response.json();
				setAssessment(data);
				refAssessment.current = data;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		};

		fetchAssessment();
	}, []);

	const handleAnswerSelect: AnswerOptionProps['onPress'] = useCallback((questionId, value) => {
		refUserAnswers.current.set(questionId, value);
		setCurrentQuestionIndex(prevState => {
			const _assessment = refAssessment.current;
			const totalQuestions = _assessment?.content.sections[0].questions.length ?? 0;
			if (prevState >= totalQuestions - 1) {
				return prevState;
			}
			return prevState + 1;

		});
	}, []);

	const handleSubmit = useCallback(async () => {
		setSubmitting(true);
		try {
			const answers: UserAnswer[] = [];
			refUserAnswers.current.forEach((value, key) => {
				answers.push({ value, questionId: key });
			})
			const body = JSON.stringify({ answers });
			const response = await fetch('http://localhost:3000/api/assessments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});

			if (!response.ok) {
				throw new Error('Failed to submit answers');
			}

			const data: SubmissionResponse = await response.json();
			setResults(data.results);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred during submission');
		} finally {
			setSubmitting(false);
		}
	}, []);

	if (loading) {
		return <div className="flex justify-center items-center h-screen">Loading...</div>;
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
	}

	if (!assessment) {
		return <div className="flex justify-center items-center h-screen">No assessment found</div>;
	}


	const section = assessment.content.sections[0]; // Assuming there's only one section
	const question = section.questions[currentQuestionIndex];
	const totalQuestions = section.questions.length;
	const isFormComplete = currentQuestionIndex >= totalQuestions - 1;
	const progress = Math.ceil((currentQuestionIndex / (totalQuestions - 1)) * 100);

	return (
		<section className="flex flex-col items-center min-h-screen p-4 bg-transparent mt-12">
			<header>
				<h1 className="text-4xl mb-9">{assessment.fullName}</h1>
			</header>
			<Card className="w-full max-w-md bg-stone-200 text-black">
				{results == null ? (
					<>
						<CardHeader>
							<CardTitle>{assessment.content.displayName}</CardTitle>
							<CardDescription className="pb-4">{section.title}</CardDescription>
							<div className="w-full pb-3">
								<Progress value={progress} className="w-full"/>
							</div>
								<p className="text-sm text-gray-500">
									Completed Question {currentQuestionIndex + 1} of {totalQuestions}
								</p>
						</CardHeader>
						{isFormComplete ? (
							<CardContent className="flex justify-center">
								<Button
									onClick={handleSubmit}
									disabled={submitting}
									className="px-8 py-2  active:bg-stone-600/30 hover:bg-stone-600/10 cursor-pointer"
									variant="outline"
								>
									{submitting ? 'Submitting...' : 'Submit'}
								</Button>
							</CardContent>
						) : (
							<CardContent className="flex flex-col gap-3">
								<h2 className="text-lg font-medium mb-3">{question.title}</h2>
								{section.answers.map((answer) => (
									<AnswerOption
										key={answer.value}
										value={answer.value}
										title={answer.title}
										onPress={handleAnswerSelect}
										questionId={question.id}
									/>
								))}
							</CardContent>
						)}
					</>
				) : (
					<>
						<CardHeader>
							<CardTitle>{assessment.disorder} Results</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="list-disc pl-4 space-y-2">
								{results.map((result) => (
									<li key={result} className="text-lg">{result}</li>
								))}
							</ul>
						</CardContent>
					</>
				)}
			</Card>
		</section>
	)
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	)
}

export default App
