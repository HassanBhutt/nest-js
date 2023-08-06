import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';
import { UserModule } from '../src/user/user.module';
import assert from 'assert';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUsers = [{ id: 1, name: 'Hassan' }];

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .expect('Content-Type', /json/)

      .expect(mockUsers);
  });

  it('/user (POST)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 'hassan' })
      .expect(201) // this is the default status that is get with post in nest js
      .expect('Content-Type', /json/)
      .then((response) => {
        // promise resolve value of that response
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: 'hassan',
        }); // jest assertion of that request
      });
  });
});
