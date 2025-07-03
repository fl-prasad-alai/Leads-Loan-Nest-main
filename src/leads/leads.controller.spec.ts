// leads.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

describe('LeadsController', () => {
  let controller: LeadsController;
  let service: LeadsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        {
          provide: LeadsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
    service = module.get<LeadsService>(LeadsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all leads', async () => {
    mockService.findAll.mockResolvedValue([{ lead_id: 1 }]);
    expect(await controller.findAll()).toEqual([{ lead_id: 1 }]);
  });

  it('should return one lead', async () => {
    mockService.findOne.mockResolvedValue({ lead_id: 2 });
    expect(await controller.findOne(2)).toEqual({ lead_id: 2 });
  });

  it('should create a lead', async () => {
    const dto = {
      first_name: 'Test',
      last_name: 'User',
      phone: '9876543210',
      email: 'test@example.com',
      type: 'applicant',
      dob: '1991-01-01',
      pan_card: 'ABCDE1234F',
    };

    mockService.create.mockResolvedValue({ lead_id: 3 });
    expect(await controller.create(dto as any)).toEqual({ lead_id: 3 });
  });

  it('should update a lead', async () => {
    mockService.update.mockResolvedValue({ lead_id: 1 });
    expect(await controller.update(1, {} as any)).toEqual({ lead_id: 1 });
  });

  it('should delete a lead', async () => {
    mockService.remove.mockResolvedValue({ message: 'Lead deleted' });
    expect(await controller.remove(1)).toEqual({ message: 'Lead deleted' });
  });
});
