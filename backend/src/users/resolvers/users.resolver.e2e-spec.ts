import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../app/app.module';
import { UtilsModule } from '../../utils/utils.module';
import { AuthService } from '../../auth/services';
import { UsersModule } from '../users.module';

describe('Users resolver', () => {
  let app: INestApplication;
  let authService: AuthService;
  let token: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UtilsModule, UsersModule],
      providers: [AuthService],
    }).compile();

    app = module.createNestApplication();
    authService = module.get<AuthService>(AuthService);
    token = await authService.login({
      email: 'admin@weroad.com',
      password: 'Admin',
    });
    await app.init();
  });

  it('should return users', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            users {
              id
            }
          }
        `,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.users).toHaveLength(3);
  });

  it('should fail if not authorized', async () => {
    request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            users {
              id
            }
          }
        `,
      })
      .expect(401);
  });
});
