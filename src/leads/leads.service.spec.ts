// leads.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { getModelToken } from '@nestjs/sequelize';
import { Lead } from './leads.model';
import { NotFoundException } from '@nestjs/common';

const mockLeadModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: getModelToken(Lead),
          useValue: mockLeadModel,
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    const createdLead = { ...dto, lead_id: 1 };
    mockLeadModel.create.mockResolvedValue(createdLead);

    const result = await service.create(dto as any);
    expect(result).toEqual(createdLead);
    expect(mockLeadModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ first_name: 'Test' }),
      { returning: true },
    );
  });

  it('should find all leads', async () => {
    const leads = [{ lead_id: 1 }, { lead_id: 2 }];
    mockLeadModel.findAll.mockResolvedValue(leads);
    const result = await service.findAll();
    expect(result).toEqual(leads);
  });

  it('should find one lead', async () => {
    const lead = { lead_id: 1 };
    mockLeadModel.findByPk.mockResolvedValue(lead);
    const result = await service.findOne(1);
    expect(result).toEqual(lead);
  });

  it('should throw NotFoundException if lead not found', async () => {
    mockLeadModel.findByPk.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });
});
