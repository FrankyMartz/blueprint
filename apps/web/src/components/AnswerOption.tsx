import type { Answer, Question } from "@/types";
import {memo} from 'react';
import { Button } from '@/components/ui/button';

export interface AnswerOptionProps {
	onPress: (questionId: Question['id'], value: number) => void;
	questionId: Question['id'];
	title: string;
	value: Answer['value'];
}

function _AnswerOption({
	onPress,
	questionId,
	title,
	value,
}: AnswerOptionProps) {
	function handlePress() {
		onPress(questionId, value);
	}
	return (
		<Button
			key={value}
			variant="outline"
			className="w-full justify-start text-left py-3 active:bg-stone-600/30 hover:bg-stone-600/10 cursor-pointer"
			onClick={handlePress}
		>
			{title}
		</Button>
	)
}

export const AnswerOption = memo(_AnswerOption);
