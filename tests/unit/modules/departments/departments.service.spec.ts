import { Test, TestingModule } from '@nestjs/testing';

import { DepartmentsRepository } from '@/modules/departments/departments.repository';
import { DepartmentsService } from '@/modules/departments/departments.service';
import { DepartmentEntity } from '@/modules/departments/types';
import { UpdateDepartmentDto } from '@/modules/departments/dtos';
describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: DepartmentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: DepartmentsRepository,
          useValue: {
            findByName: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            updated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repository = module.get<DepartmentsRepository>(DepartmentsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error when creating a department name already in use', async () => {
    // Arrange
    jest.spyOn(repository, 'findByName').mockResolvedValueOnce(null);

    // Act
    const data = {
      parent_department_id: null,
      name: 'Department 1',
      description: 'Department 1',
    };

    try {
      // Act
      await service.create(data);
    } catch (error) {
      // Assert
      expect(repository.findByName).toHaveBeenCalled();
      expect(repository.findByName).toThrow();
      expect(error.status).toBe(400);
    }
  });

  it('should be able to succesfully create a new department', async () => {
    // Arrange
    const data = {
      parent_department_id: null,
      name: 'Department 1',
      description: 'Department 1',
    };

    const newDepartment: DepartmentEntity = {
      id: '123',
      name: 'Department 1',
      parent_department_id: null,
      description: 'Department 1',
      updated_at: new Date(),
      created_at: new Date(),
    };

    jest.spyOn(repository, 'findByName').mockResolvedValueOnce(null);
    jest.spyOn(repository, 'create').mockResolvedValueOnce(newDepartment);

    // Act
    const result = await service.create(data);

    expect(repository.create).toHaveBeenCalled();
    expect(result.id).toBeDefined();
  });

  it('should be able to delete an existing department', async () => {
    // Arrange
    const department: DepartmentEntity = {
      id: '123',
      name: 'Department 1',
      parent_department_id: null,
      description: 'Department 1',
      updated_at: new Date(),
      created_at: new Date(),
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(department);

    // Act
    await service.delete(department.id);

    expect(repository.delete).toHaveBeenCalled();
  });

  it('should throw an error when trying to delete a non existing department', async () => {
    // Arrange
    const department: DepartmentEntity = {
      id: '123',
      name: 'Department 1',
      parent_department_id: null,
      description: 'Department 1',
      updated_at: new Date(),
      created_at: new Date(),
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

    try {
      // Act
      await service.delete(department.id);
    } catch (error) {
      // Assert
      expect(error.status).toBe(404);
    }
  });

  it('should be able to update an existing department', async () => {
    // Arrange
    const departmentDto: UpdateDepartmentDto = {
      name: 'Eletronics',
      description: 'Eletronics department',
    };

    const existingDepartment: DepartmentEntity = {
      id: '123',
      name: 'Department 1',
      parent_department_id: null,
      description: 'Department 1',
      updated_at: new Date(),
      created_at: new Date(),
    };

    jest
      .spyOn(repository, 'findById')
      .mockResolvedValueOnce(existingDepartment);

    // Act
    await service.update('123', departmentDto);

    // Assert
    expect(service.update).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });

  it('should throw and error when trying to update a non existing department', async () => {
    // Arrange
    const departmentDto: UpdateDepartmentDto = {
      name: 'Eletronics',
      description: 'Eletronics department',
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

    try {
      // Act
      await service.update('123', departmentDto);
    } catch (error) {
      // Assert
      expect(error.status).toBe(400);
    }
  });
});
