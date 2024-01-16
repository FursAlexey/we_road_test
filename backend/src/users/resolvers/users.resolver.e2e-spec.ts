import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(loginInput: {
              email: "Editor@weroad.com",
              password: "Editor"
            })
          }
        `,
      });

    // .expect(200)
    // .expect(response.body).toEqu

    console.log(response.body);
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query listUsers {
            users {
              id
              email
            }
          }
        `,
      })
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWM5NzE3Yi1hOGJmLTQ0YTUtODJjZC1jNWE1OTBjMzY5ZjkiLCJlbWFpbCI6ImVkaXRvckB3ZXJvYWQuY29tIiwiaWF0IjoxNzA1MzEyNjAzLCJleHAiOjE3MDYwMDM4MDN9.mhcxddKiU60265qFr5xtax-Lu56BfiYh2U82hlO_p1M`,
      );

    // .expect(200)
    // .expect(response.body).toEqu

    console.log(response.body);
  });
});
