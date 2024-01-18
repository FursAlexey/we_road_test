import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '../../users/entities';
import { UserRole } from '../../roles/constants';

export const IsAdminDecorator = createParamDecorator((_, context: ExecutionContext) => {
  const request = GqlExecutionContext.create(context).getContext().req;
  const user = request.user as User;

  return user.roles.some(({ name }) => name === UserRole.Admin);
});
