import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import {
  assessments,
  assessmentSections,
  assessmentQuestions,
  assessmentAnswers,
  DatabaseService,
} from '../database';
import { eq, inArray } from 'drizzle-orm';

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
    sections: [
      {
        id: 1,
        type: 'standard',
        title:
          'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
        sortOrder: 1,
        questions: [
          {
            id: 1,
            title: 'Little interest or pleasure in doing things?',
            sortOrder: 1,
          },
          {
            id: 2,
            title: 'Feeling down, depressed, or hopeless?',
            sortOrder: 2,
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
  };

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

  beforeEach(async () => {
    mockDbClient = {
      query: {
        assessments: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
        assessmentQuestions: {
          findMany: jest.fn(),
        },
      },
      $count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentsService,
        {
          provide: DatabaseService,
          useValue: {
            client: mockDbClient,
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
      // Mock the database query
      mockDbClient.query.assessments.findFirst.mockResolvedValue(
        mockAssessment,
      );

      const result = await service.findOne(1);

      // Check that the database query was called with the correct parameters
      expect(mockDbClient.query.assessments.findFirst).toHaveBeenCalledWith({
        where: eq(assessments.id, 1),
        with: {
          sections: {
            orderBy: assessmentSections.sortOrder,
            columns: {
              id: true,
              type: true,
              title: true,
            },
            with: {
              questions: {
                columns: {
                  id: true,
                  title: true,
                },
                orderBy: assessmentQuestions.sortOrder,
              },
              answers: {
                columns: {
                  title: true,
                  value: true,
                },
                orderBy: assessmentAnswers.value,
              },
            },
          },
        },
      });

      // Check that the result has the expected format
      expect(result).toEqual({
        id: 1,
        name: 'BPDS',
        disorder: 'Cross-Cutting',
        content: {
          sections: mockAssessment.sections,
          displayName: 'BDS',
        },
        fullName: 'Blueprint Diagnostic Screener',
      });
    });

    it('should throw NotFoundException when assessment is not found', async () => {
      // Mock the database query to return null
      mockDbClient.query.assessments.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of assessments', async () => {
      const mockAssessments = [mockAssessment];
      const mockCount = 1;
      const offset = 0;
      const limit = 10;

      mockDbClient.query.assessments.findMany.mockResolvedValue(
        mockAssessments,
      );
      mockDbClient.$count.mockResolvedValue(mockCount);

      const result = await service.findAll(offset, limit);

      expect(mockDbClient.query.assessments.findMany).toHaveBeenCalledWith({
        offset,
        limit,
      });
      expect(mockDbClient.$count).toHaveBeenCalled();

      expect(result).toEqual({
        data: mockAssessments,
        meta: {
          total: mockCount,
          offset,
          limit,
        },
      });
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

      mockDbClient.query.assessmentQuestions.findMany.mockResolvedValue(
        mockQuestions,
      );

      const result = await service.check(payload);

      expect(
        mockDbClient.query.assessmentQuestions.findMany,
      ).toHaveBeenCalledWith({
        where: inArray(assessmentQuestions.id, [1, 2]),
        columns: {
          id: true,
          domain: true,
        },
      });

      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });
  });
});
