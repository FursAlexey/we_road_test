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
import { defaultAdminUser } from '../../testing/default-users';

describe('Auth resolver', () => {
  let app: INestApplication;
  let resolver: AuthResolver;
  let testingService: TestingService;

  const getLoginMutation = (email: string, password: string) => `
    mutation {
      login(loginInput: {
        email: "${email}",
        password: "${password}"
      })
    }
  `;

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
    await testingService.createUsersFromRoles(
      await testingService.createDefaultRoles(),
    );
  });

  afterAll(async () => {
    await testingService.cleanUp();
    await app.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should pass authentication', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getLoginMutation(
          defaultAdminUser.email,
          defaultAdminUser.password,
        ),
      })
      .expect(200);

    expect(response.body.data.login).toBeTruthy();
  });

  it('should fail if email is incorrect', async () => {
    const incorrectEmail = 'notadmin@weroad.com';

    request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getLoginMutation(incorrectEmail, defaultAdminUser.password),
      })
      .expect(401);
  });

  it('should fail if password is incorrect', async () => {
    const incorrectPassword = 'NotAdmin';

    request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getLoginMutation(defaultAdminUser.email, incorrectPassword),
      })
      .expect(401);
  });
});
