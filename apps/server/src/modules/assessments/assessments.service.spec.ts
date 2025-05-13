import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { DatabaseService } from '../database';
import { eq } from 'drizzle-orm';

describe('AssessmentsService', () => {
  let service: AssessmentsService;
  let databaseService: DatabaseService;
  let mockDbClient: any;

  const mockAssessment = {
    id: 1,
    name: 'BPDS',
    fullName: 'Blueprint Diagnostic Screener',
    disorder: 'Cross-Cutting',
    displayName: 'BDS',
  };

  const mockSections = [
    {
      id: 1,
      assessmentId: 1,
      type: 'standard',
      title:
        'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
      sortOrder: 1,
    },
  ];

  const mockQuestions = [
    {
      id: 1,
      title: 'Little interest or pleasure in doing things?',
      domain: 'depression',
      assessmentId: 1,
      sectionId: 1,
      sortOrder: 1,
    },
    {
      id: 2,
      title: 'Feeling down, depressed, or hopeless?',
      domain: 'depression',
      assessmentId: 1,
      sectionId: 1,
      sortOrder: 2,
    },
  ];

  const mockAnswers = [
    { title: 'Not at all', value: 0, sectionId: 1 },
    { title: 'Rare, less than a day or two', value: 1, sectionId: 1 },
    { title: 'Several days', value: 2, sectionId: 1 },
    { title: 'More than half the days', value: 3, sectionId: 1 },
    { title: 'Nearly every day', value: 4, sectionId: 1 },
  ];

  beforeEach(async () => {
    mockDbClient = {
      query: {
        assessments: {
          findFirst: jest.fn(),
        },
        assessmentSections: {
          findMany: jest.fn(),
        },
        assessmentQuestions: {
          findMany: jest.fn(),
        },
        assessmentAnswers: {
          findMany: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentsService,
        {
          provide: DatabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockDbClient),
          },
        },
      ],
    }).compile();

    service = module.get<AssessmentsService>(AssessmentsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an assessment by id with its sections, questions, and answers', async () => {
      // Mock the database queries
      mockDbClient.query.assessments.findFirst.mockResolvedValue(
        mockAssessment,
      );
      mockDbClient.query.assessmentSections.findMany.mockResolvedValue(
        mockSections,
      );
      mockDbClient.query.assessmentQuestions.findMany.mockResolvedValue(
        mockQuestions,
      );
      mockDbClient.query.assessmentAnswers.findMany.mockResolvedValue(
        mockAnswers,
      );

      const result = await service.findOne(1);

      // Check that the database queries were called with the correct parameters
      expect(mockDbClient.query.assessments.findFirst).toHaveBeenCalled();
      expect(mockDbClient.query.assessmentSections.findMany).toHaveBeenCalled();
      expect(
        mockDbClient.query.assessmentQuestions.findMany,
      ).toHaveBeenCalled();
      expect(mockDbClient.query.assessmentAnswers.findMany).toHaveBeenCalled();

      // Check that the result has the expected format
      expect(result).toEqual({
        id: '1',
        name: 'BPDS',
        disorder: 'Cross-Cutting',
        content: {
          sections: [
            {
              type: 'standard',
              title:
                'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
              questions: [
                {
                  question_id: 'question_a',
                  title: 'Little interest or pleasure in doing things?',
                },
                {
                  question_id: 'question_b',
                  title: 'Feeling down, depressed, or hopeless?',
                },
              ],
              answers: [
                { title: 'Not at all', value: 0 },
                { title: 'Rare, less than a day or two', value: 1 },
                { title: 'Several days', value: 2 },
                { title: 'More than half the days', value: 3 },
                { title: 'Nearly every day', value: 4 },
              ],
            },
          ],
          display_name: 'BDS',
        },
        full_name: 'Blueprint Diagnostic Screener',
      });
    });

    it('should throw NotFoundException when assessment is not found', async () => {
      // Mock the database query to return null
      mockDbClient.query.assessments.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
