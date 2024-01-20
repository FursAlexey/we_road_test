import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthResolver } from './auth.resolver';
import { AuthService } from '../services';
import { AppModule } from '../../app/app.module';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { UtilsModule } from '../../utils/utils.module';
import { TestingService } from '../../testing/testing/testing.service';
import { SeedersModule } from '../../database/seeders/seeders.module';

describe('Auth resolver', () => {
  let app: INestApplication;
  let resolver: AuthResolver;
  let testingService: TestingService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UsersModule,
        UtilsModule,
        TestingModule,
        SeedersModule,
      ],
      providers: [AuthResolver, AuthService, TestingService],
    }).compile();

    app = module.createNestApplication();
    resolver = module.get<AuthResolver>(AuthResolver);
    testingService = module.get<TestingService>(TestingService);

    await app.init();
    await testingService.createDefaultRolesAndUsers();
  });

  afterAll(async () => {
    await testingService.cleanUp();
    await app.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should pass password verification', async () => {
    const email = 'admin@weroad.com';
    const correctPassword = 'Admin';
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(loginInput: {
              email: "${email}",
              password: "${correctPassword}"
            })
          }
        `,
      });

    expect(response.body.data.login).toBeTruthy();
  });

  it('should fail password verification', async () => {
    const email = 'admin@weroad.com';
    const inCorrectPassword = 'NotAdmin';

    request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(loginInput: {
              email: "${email}",
              password: "${inCorrectPassword}"
            })
          }
        `,
      })
      .expect(401);
  });
});
