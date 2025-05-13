import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { NotFoundException } from '@nestjs/common';

describe('AssessmentsController', () => {
  let controller: AssessmentsController;
  let service: AssessmentsService;

  const mockAssessment = {
    id: 1,
    name: 'BPDS',
    disorder: 'Cross-Cutting',
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
      displayName: 'BDS',
    },
    fullName: 'Blueprint Diagnostic Screener',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentsController],
      providers: [
        {
          provide: AssessmentsService,
          useValue: {
            findOne: jest.fn(),
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
      jest.spyOn(service, 'findOne').mockResolvedValue(mockAssessment);

      const result = await controller.findOne(1);

      expect(result).toBe(mockAssessment);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when assessment is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
