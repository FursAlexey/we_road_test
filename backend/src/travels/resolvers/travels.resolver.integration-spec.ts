import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '../../app/app.module';
import { UtilsModule } from '../../utils/utils.module';
import { AuthService } from '../../auth/services';
import { TravelsModule } from '../travels.module';
import { TravelsService } from '../services';
import { Travel } from '../entities';
import { SeedersModule } from '../../database/seeders/seeders.module';
import { UsersModule } from '../../users/users.module';
import { CreateTravelInput, UpdateTravelInput } from '../dto';
import { TravelError } from '../errors';
import { TestingService } from '../../testing/testing/testing.service';

// TODO: move in mocks folder
const travelsMock: Partial<Travel>[] = [
  {
    name: '1',
    description: 'description',
    isPublic: true,
    numberOfDays: 12,
    moods: {
      culture: 1,
      history: 2,
      nature: 3,
      party: 4,
      relax: 5,
    },
  },
  {
    name: '2',
    description: 'another description',
    isPublic: false,
    numberOfDays: 3,
    moods: {
      culture: 1,
      history: 2,
      nature: 3,
      party: 4,
      relax: 5,
    },
  },
  {
    name: '3',
    description: 'description again',
    isPublic: true,
    numberOfDays: 14,
    moods: {
      culture: 1,
      history: 2,
      nature: 3,
      party: 4,
      relax: 5,
    },
  },
];

describe('Travels resolver', () => {
  let app: INestApplication;
  let authService: AuthService;
  let travelsService: TravelsService;
  let testingService: TestingService;
  let adminToken: string;
  let userToken: string;
  let travels: Travel[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UtilsModule,
        TravelsModule,
        SeedersModule,
        UsersModule,
        TestingModule,
        TypeOrmModule.forFeature([Travel]),
      ],
      providers: [AuthService, TravelsService, TestingService],
    }).compile();

    app = module.createNestApplication();
    authService = module.get<AuthService>(AuthService);
    testingService = module.get<TestingService>(TestingService);
    travelsService = module.get<TravelsService>(TravelsService);

    await testingService.init();

    // todo: use variables
    [adminToken, userToken] = await Promise.all([
      authService.login({
        email: 'admin@weroad.com',
        password: 'Admin',
      }),
      authService.login({
        email: 'user@weroad.com',
        password: 'User',
      }),
    ]);

    travels = await Promise.all(
      travelsMock.map((travelMock) => travelsService.create(travelMock)),
    );

    await app.init();
  });

  afterAll(async () => {
    await testingService.cleanUp();
    await app.close();
  });

  describe('travels query', () => {
    it('should return all travels', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          query {
            travels {
              data {
                id
              }
              hasMore
            }
          }
        `,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(
        response.body.data.travels.data.map((t: { id: string }) => t.id),
      ).toEqual(expect.arrayContaining(travels.map(({ id }) => id)));
    });

    it('should return public travels only', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          query {
            travels {
              data {
                id
              }
              hasMore
            }
          }
        `,
        })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(
        response.body.data.travels.data.map((t: { id: string }) => t.id),
      ).toEqual(
        expect.arrayContaining(
          travels.filter(({ isPublic }) => isPublic).map(({ id }) => id),
        ),
      );
    });

    it('should return travels by slug', async () => {
      const slug = '1';

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          query {
            travels (slug: "${slug}") {
              data {
                id
                slug
              }
              hasMore
            }
          }
        `,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(
        response.body.data.travels.data.map((t: { id: string }) => t.id),
      ).toEqual(
        expect.arrayContaining(
          travels.filter((t) => t.slug.includes(slug)).map(({ id }) => id),
        ),
      );
    });

    it('should return travels with limit', async () => {
      const limit = 1;
      const hasMore = travels.length > limit;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          query {
            travels (limit: ${limit}) {
              data {
                id
              }
              hasMore
            }
          }
        `,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.travels.data).toHaveLength(limit);
      expect(response.body.data.travels.hasMore).toEqual(hasMore);
    });

    it('should return travels with offset', async () => {
      const offset = 1;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          query {
            travels (offset: ${offset}) {
              data {
                id
              }
              hasMore
            }
          }
        `,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(
        response.body.data.travels.data.map((t: { id: string }) => t.id),
      ).toEqual(
        expect.arrayContaining(travels.slice(offset).map(({ id }) => id)),
      );
    });
  });

  describe('travel', () => {
    it('should return travel by id', async () => {
      const travelId = travels[0].id;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          query {
            travel (id: "${travelId}") {
              id
            }
          }
        `,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.travel.id).toEqual(travelId);
    });
  });

  describe('create travel mutation', () => {
    const newTravelPayload: CreateTravelInput = {
      name: 'new travel',
      description: 'description',
      numberOfDays: 10,
      isPublic: true,
      moods: {
        culture: 5,
        history: 4,
        nature: 3,
        party: 2,
        relax: 1,
      },
    };

    let createdTravel: Travel;

    const createTravelMutation = `
      mutation {
        createTravel (createTravelInput: {
          name: "${newTravelPayload.name}",
          numberOfDays: ${newTravelPayload.numberOfDays},
          description: "${newTravelPayload.description}",
          isPublic: ${newTravelPayload.isPublic},
          moods: {
            culture: ${newTravelPayload.moods.culture},
            history: ${newTravelPayload.moods.history},
            nature: ${newTravelPayload.moods.nature},
            party: ${newTravelPayload.moods.party},
            relax: ${newTravelPayload.moods.relax},
          }
        }) {
          id
          name
          description
          isPublic
          numberOfDays
          moods {
            culture
            history
            nature
            party
            relax
          }
        }
      }
    `;

    afterEach(() => {
      travelsService.remove(createdTravel);
    });

    it('should return travel by id', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createTravelMutation,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      createdTravel = response.body.data.createTravel;

      expect(createdTravel).toEqual(expect.objectContaining(newTravelPayload));
    });
  });

  describe('update travel mutation', () => {
    const getUpdateTravelMutation = (payload: UpdateTravelInput) => `
      mutation {
        updateTravel (updateTravelInput: {
          id: "${payload.id}",
          name: "${payload.name}",
          numberOfDays: ${payload.numberOfDays},
          description: "${payload.description}",
          isPublic: ${payload.isPublic},
        }) {
          id
          name
          description
          isPublic
          numberOfDays
        }
      }
    `;

    it('should update travel by id', async () => {
      const travelToUpdate = travels[0];
      const updateTravelPayload: UpdateTravelInput = {
        id: travelToUpdate.id,
        name: 'updated name',
        description: 'updated description',
        numberOfDays: 12,
        isPublic: false,
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getUpdateTravelMutation(updateTravelPayload),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const updatedTravel = response.body.data.updateTravel;

      expect(updatedTravel).toEqual(
        expect.objectContaining(updateTravelPayload),
      );
    });

    it('show fail if travel does not exist', async () => {
      const notExistingTravelId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const updateTravelPayload: UpdateTravelInput = {
        id: notExistingTravelId,
        name: 'updated name',
        description: 'updated description',
        numberOfDays: 12,
        isPublic: false,
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getUpdateTravelMutation(updateTravelPayload),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.errors[0].message).toEqual(TravelError.NotFound);
    });
  });

  describe('remove travel mutation', () => {
    const getRemoveTravelMutation = (id: string) => `
      mutation {
        removeTravel (id: "${id}")
      }
    `;

    it('should remove travel by id', async () => {
      const travelToRemove = travels[0];

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getRemoveTravelMutation(travelToRemove.id),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.removeTravel).toBeTruthy();
    });

    it('should fail if travel does not exist', async () => {
      const notExistingTravelId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getRemoveTravelMutation(notExistingTravelId),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.errors[0].message).toEqual(TravelError.NotFound);
    });
  });
});
