import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ReqUser = createParamDecorator((_, context: ExecutionContext) => {
  const request = GqlExecutionContext.create(context).getContext().req;
  return request.user;
});
