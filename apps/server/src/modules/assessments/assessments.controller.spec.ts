import type {
  PaginatedResponse,
  AssessmentResponse,
  AssessmentDetailResponse,
} from './types';

import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { NotFoundException } from '@nestjs/common';
import { ASSESSMENT_LEVEL_TWO } from '@blueprint/shared';

describe('AssessmentsController', () => {
	let controller: AssessmentsController;
	let service: AssessmentsService;

	const mockAssessmentBase: Pick<AssessmentResponse, 'id' | 'name' | 'disorder' | 'fullName'> = {
		id: 1,
		name: 'BPDS',
		disorder: 'Cross-Cutting',
		fullName: 'Blueprint Diagnostic Screener',
	};

	const mockAssessment: AssessmentResponse = {
		...mockAssessmentBase,
		displayName: 'BDS',
	};

	const mockAssessmentDetail: AssessmentDetailResponse = {
		...mockAssessmentBase,
		content: {
			sections: [
				{
					id: 1,
					type: 'standard',
					title:
						'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
					answers: [
						{ title: 'Not at all', value: 0 },
						{ title: 'Rare, less than a day or two', value: 1 },
						{ title: 'Several days', value: 2 },
						{ title: 'More than half the days', value: 3 },
						{ title: 'Nearly every day', value: 4 },
					],
					questions: [
						{
							id: 1,
							title: 'Little interest or pleasure in doing things?',
						},
						{
							id: 2,
							title: 'Feeling down, depressed, or hopeless?',
						},
					],
				},
			],
			displayName: mockAssessment.displayName,
		},
	};

	const mockPaginatedResponse: PaginatedResponse<AssessmentResponse> = {
		data: [mockAssessment],
		meta: {
			total: 1,
			offset: 0,
			limit: 10,
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AssessmentsController],
			providers: [
				{
					provide: AssessmentsService,
					useValue: {
						findOne: jest.fn(),
						findAll: jest.fn(),
						check: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<AssessmentsController>(AssessmentsController);
		service = module.get<AssessmentsService>(AssessmentsService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findOne', () => {
		it('should return an assessment by id', async () => {
			jest.spyOn(service, 'findOne').mockResolvedValue(mockAssessmentDetail);

			const result = await controller.findOne(1);

			expect(result).toBe(mockAssessmentDetail);
			expect(service.findOne).toHaveBeenCalledWith(1);
		});

		it('should throw NotFoundException when assessment is not found', async () => {
			jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

			await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
		});
	});

	describe('findAll', () => {
		it('should return a paginated list of assessments', async () => {
			const query = { offset: 0, limit: 10 };

			jest.spyOn(service, 'findAll').mockResolvedValue(mockPaginatedResponse);

			const result = await controller.findAll(query);

			expect(result).toBe(mockPaginatedResponse);
			expect(service.findAll).toHaveBeenCalledWith(query.offset, query.limit);
		});
	});

	describe('check', () => {
		it('should calculate assessment scores based on answers', async () => {
			const payload = {
				answers: [
					{ questionId: 1, value: 3 },
					{ questionId: 2, value: 2 },
				],
			};

			const expectedResponse = {
				results: [ASSESSMENT_LEVEL_TWO.phq9],
			};

			jest.spyOn(service, 'check').mockResolvedValue(expectedResponse);

			const result = await controller.check(payload);

			expect(result).toEqual(expectedResponse);
			expect(service.check).toHaveBeenCalledWith(payload);
		});
	});
});
