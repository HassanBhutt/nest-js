import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// First thing to have dependencies on place
describe('UserService', () => {
  let service: UserService;

  const mockUsersRepository = {
    create: jest.fn((dto) => ({
      ...dto,
    })),

    save: jest.fn((user) =>
      Promise.resolve({
        id: Date.now(),
        ...user,
      }),
    ),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user and return that', async () => {
    expect(await service.create({ name: 'Hassan' })).toEqual({
      id: expect.any(Number),
      name: 'Hassan',
    });
  });
});
