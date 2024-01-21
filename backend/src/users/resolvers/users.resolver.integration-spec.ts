import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../app/app.module';
import { UtilsModule } from '../../utils/utils.module';
import { AuthService } from '../../auth/services';
import { SeedersModule } from '../../database/seeders/seeders.module';
import { UsersModule } from '../users.module';
import { TestingService } from '../../testing/testing/testing.service';
import { defaultAdminUser } from '../../testing/default-users';
import { User } from '../entities';
import { UserRole } from '../../roles/constants';
import { CreateUserInput } from '../dto';
import { Role } from '../../roles/entities';
import { UserError } from '../errors';

describe('Users resolver', () => {
  let app: INestApplication;
  let authService: AuthService;
  let testingService: TestingService;
  let adminToken: string;
  let users: User[];

  const nameToRoleMap: Record<UserRole, Role> = {} as Record<UserRole, Role>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UtilsModule,
        SeedersModule,
        UsersModule,
        TestingModule,
      ],
      providers: [AuthService, TestingService],
    }).compile();

    app = module.createNestApplication();
    authService = module.get<AuthService>(AuthService);
    testingService = module.get<TestingService>(TestingService);

    const roles = await testingService.createDefaultRoles();
    users = await testingService.createUsersFromRoles(roles);

    roles.forEach((role) => {
      nameToRoleMap[role.name] = role;
    });

    adminToken = await authService.login({
      email: defaultAdminUser.email,
      password: defaultAdminUser.password,
    });

    await app.init();
  });

  afterAll(async () => {
    await testingService.cleanUp();
    await app.close();
  });

  describe('users query', () => {
    const usersQuery = `
      query {
        users {
          id
          email
        }
      }
    `;

    it('should return all users if user has admin role', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: usersQuery,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.users.map((t: { id: string }) => t.id)).toEqual(
        expect.arrayContaining(users.map(({ id }) => id)),
      );
    });
  });

  describe('me query', () => {
    it('should return active user', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          query {
            me {
              id
            }
          }
        `,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const adminUser = users.find((user) => {
        return user.roles.find((role) => role.name === UserRole.Admin);
      });

      expect(response.body.data.me.id).toEqual(adminUser?.id);
    });
  });

  describe('create user mutation', () => {
    const getCreateUserMutation = (createUserInput: CreateUserInput) => `
      mutation {
        createUser (createUserInput: {
          email: "${createUserInput.email}",
          password: "${createUserInput.password}",
          roleIds: [${createUserInput.roleIds?.map((id) => `"${id}"`).join(',')}],
        }) {
          email
          roles {
            name
          }
        }
      }
    `;

    it('should create user with admin role', async () => {
      const newAdminUserPayload: CreateUserInput = {
        email: 'newadminuser@weroad.com',
        password: 'Admin',
        roleIds: [nameToRoleMap.Admin.id],
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getCreateUserMutation(newAdminUserPayload),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.createUser).toEqual(
        expect.objectContaining({
          email: newAdminUserPayload.email,
          roles: [
            {
              name: nameToRoleMap.Admin.name,
            },
          ],
        }),
      );
    });

    it('should create user with all roles', async () => {
      const newAllRolesUserPayload: CreateUserInput = {
        email: 'newuser@weroad.com',
        password: 'Test',
        roleIds: [
          nameToRoleMap.Admin.id,
          nameToRoleMap.Editor.id,
          nameToRoleMap.User.id,
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getCreateUserMutation(newAllRolesUserPayload),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const createdUser = response.body.data.createUser;

      expect(createdUser.email).toEqual(newAllRolesUserPayload.email);
      expect(
        createdUser.roles.map(({ name }: { name: string }) => name).sort(),
      ).toEqual(
        [
          nameToRoleMap.Admin.name,
          nameToRoleMap.Editor.name,
          nameToRoleMap.User.name,
        ].sort(),
      );
    });
  });

  describe('update user roles mutation', () => {
    it("should replace user's role", async () => {
      const userWithoutAdminRole = users.find((user) => {
        return !user.roles.find(({ name }) => name === UserRole.Admin);
      });

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              updateUserRoles (updateUserRolesInput: {
                id: "${userWithoutAdminRole?.id}",
                roleIds: ["${nameToRoleMap.Admin.id}"],
              }) {
                email
                roles {
                  name
                }
              }
            }
          `,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const updatedUser = response.body.data.updateUserRoles;

      expect(updatedUser).toEqual({
        email: userWithoutAdminRole?.email,
        roles: [
          {
            name: nameToRoleMap.Admin.name,
          },
        ],
      });
    });
  });

  describe('remove user mutation', () => {
    const getRemoveUserMutation = (id: string) => `
      mutation {
        removeUser (id: "${id}") {
          id
        }
      }
    `;

    it('should remove user by id', async () => {
      const userToRemove = users.find((user) => {
        return !user.roles.find((role) => role.name === UserRole.Admin);
      }) as User;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getRemoveUserMutation(userToRemove.id),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.removeUser).toEqual({
        id: userToRemove.id,
      });
    });

    it('should fail if user does not exist', async () => {
      const notExistingUserId = '09c690b3-1047-4d00-842c-6981c0c392f9';

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getRemoveUserMutation(notExistingUserId),
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.errors[0].message).toEqual(UserError.NotFound);
    });
  });
});
