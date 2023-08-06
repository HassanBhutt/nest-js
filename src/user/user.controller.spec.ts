import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  // let service: UserService;

  const mockUsersService = {
    create: jest.fn((dto) => {
      // a fake create method
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    // fake user with an updated name
    // jest.fn().mockImplementation((id,dto)=>({id,...dto}))
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),

    findOne: jest.fn((id) => ({
      id,
    })),

    remove: jest.fn((id) => ({
      id,
    })),

    findAll: jest.fn().mockResolvedValue([
      { id: 1, name: 'Hassan' },
      { id: 2, name: 'Hussain' },
    ]),
  };
  // this is a module minimum to run the test this is simulating the user module | a fake module
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UserController>(UserController); // reference to that user controller
    // service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('it should create a user', () => {
    expect(controller.create({ name: 'hassan' })).toEqual({
      // assertions- what next happens after creating
      id: expect.any(Number),
      name: 'hassan',
    });
    expect(mockUsersService.create).toHaveBeenCalledWith({ name: 'hassan' }); // assertions
  });

  it('should update a user', async () => {
    const dto = { name: 'Hassan' };
    expect(await controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });
  });

  it('should delete a user', async () => {
    expect(await controller.remove('1')).toEqual({
      id: 1,
    });
  });

  it('should return all the users', async () => {
    const users = [
      { id: 1, name: 'hassan' },
      { id: 2, name: 'hussain' },
    ];
    mockUsersService.findAll.mockResolvedValue(users);

    expect(await controller.findAll()).toEqual(users);
  });

  it('should return only one user', async () => {
    expect(await controller.findOne('1')).toEqual({
      id: 1,
    });
  });
});

// it is initialing failing because our mock does not do it
