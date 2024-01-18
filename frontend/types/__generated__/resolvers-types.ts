import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type CreateTourInput = {
  endingDate: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  startingDate: Scalars['DateTime']['input'];
  travelId: Scalars['String']['input'];
};

export type CreateTravelInput = {
  description: Scalars['String']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  moods: MoodsInput;
  name: Scalars['String']['input'];
  numberOfDays: Scalars['Int']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Moods = {
  __typename?: 'Moods';
  culture: Scalars['Int']['output'];
  history: Scalars['Int']['output'];
  nature: Scalars['Int']['output'];
  party: Scalars['Int']['output'];
  relax: Scalars['Int']['output'];
};

export type MoodsInput = {
  culture: Scalars['Int']['input'];
  history: Scalars['Int']['input'];
  nature: Scalars['Int']['input'];
  party: Scalars['Int']['input'];
  relax: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTour: Tour;
  createTravel: Travel;
  createUser: User;
  login: Scalars['String']['output'];
  removeTour: Scalars['Boolean']['output'];
  removeTravel: Scalars['Boolean']['output'];
  removeUser: User;
  updateTour: Tour;
  updateTravel: Travel;
  updateUserRoles: User;
};


export type MutationCreateTourArgs = {
  createTourInput: CreateTourInput;
};


export type MutationCreateTravelArgs = {
  createTravelInput: CreateTravelInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRemoveTourArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveTravelArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateTourArgs = {
  updateTourInput: UpdateTourInput;
};


export type MutationUpdateTravelArgs = {
  updateTravelInput: UpdateTravelInput;
};


export type MutationUpdateUserRolesArgs = {
  updateUserRolesInput: UpdateUserRolesInput;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  roles: Array<Role>;
  travel: Travel;
  travels: TravelList;
  users: Array<User>;
};


export type QueryTravelArgs = {
  id: Scalars['String']['input'];
};


export type QueryTravelsArgs = {
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<SortArgs>>;
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: UserRole;
  updatedAt: Scalars['DateTime']['output'];
};

export type SortArgs = {
  direction?: InputMaybe<SortDirection>;
  field: Scalars['String']['input'];
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Tour = {
  __typename?: 'Tour';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  endingDate: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  startingDate: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ToursList = {
  __typename?: 'ToursList';
  data: Array<Tour>;
  hasMore: Scalars['Boolean']['output'];
};

export type Travel = {
  __typename?: 'Travel';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isPublic: Scalars['Boolean']['output'];
  moods: Moods;
  name: Scalars['String']['output'];
  numberOfDays: Scalars['Int']['output'];
  numberOfNights: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  tours: ToursList;
  updatedAt: Scalars['DateTime']['output'];
};


export type TravelToursArgs = {
  endingDate?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  priceFrom?: InputMaybe<Scalars['Float']['input']>;
  priceTo?: InputMaybe<Scalars['Float']['input']>;
  sort?: InputMaybe<Array<SortArgs>>;
  startingDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TravelList = {
  __typename?: 'TravelList';
  data: Array<Travel>;
  hasMore: Scalars['Boolean']['output'];
};

export type UpdateTourInput = {
  endingDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  startingDate?: InputMaybe<Scalars['DateTime']['input']>;
  tourId: Scalars['String']['input'];
};

export type UpdateTravelInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  moods?: InputMaybe<MoodsInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  numberOfDays?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserRolesInput = {
  id: Scalars['String']['input'];
  roleIds: Array<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  roles: Array<Role>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  User = 'User'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateTourInput: CreateTourInput;
  CreateTravelInput: CreateTravelInput;
  CreateUserInput: CreateUserInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginInput: LoginInput;
  Moods: ResolverTypeWrapper<Moods>;
  MoodsInput: MoodsInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Role: ResolverTypeWrapper<Role>;
  SortArgs: SortArgs;
  SortDirection: SortDirection;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tour: ResolverTypeWrapper<Tour>;
  ToursList: ResolverTypeWrapper<ToursList>;
  Travel: ResolverTypeWrapper<Travel>;
  TravelList: ResolverTypeWrapper<TravelList>;
  UpdateTourInput: UpdateTourInput;
  UpdateTravelInput: UpdateTravelInput;
  UpdateUserRolesInput: UpdateUserRolesInput;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateTourInput: CreateTourInput;
  CreateTravelInput: CreateTravelInput;
  CreateUserInput: CreateUserInput;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  LoginInput: LoginInput;
  Moods: Moods;
  MoodsInput: MoodsInput;
  Mutation: {};
  Query: {};
  Role: Role;
  SortArgs: SortArgs;
  String: Scalars['String']['output'];
  Tour: Tour;
  ToursList: ToursList;
  Travel: Travel;
  TravelList: TravelList;
  UpdateTourInput: UpdateTourInput;
  UpdateTravelInput: UpdateTravelInput;
  UpdateUserRolesInput: UpdateUserRolesInput;
  User: User;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MoodsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Moods'] = ResolversParentTypes['Moods']> = {
  culture?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  history?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nature?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  party?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  relax?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createTour?: Resolver<ResolversTypes['Tour'], ParentType, ContextType, RequireFields<MutationCreateTourArgs, 'createTourInput'>>;
  createTravel?: Resolver<ResolversTypes['Travel'], ParentType, ContextType, RequireFields<MutationCreateTravelArgs, 'createTravelInput'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'createUserInput'>>;
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'loginInput'>>;
  removeTour?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveTourArgs, 'id'>>;
  removeTravel?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveTravelArgs, 'id'>>;
  removeUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRemoveUserArgs, 'id'>>;
  updateTour?: Resolver<ResolversTypes['Tour'], ParentType, ContextType, RequireFields<MutationUpdateTourArgs, 'updateTourInput'>>;
  updateTravel?: Resolver<ResolversTypes['Travel'], ParentType, ContextType, RequireFields<MutationUpdateTravelArgs, 'updateTravelInput'>>;
  updateUserRoles?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserRolesArgs, 'updateUserRolesInput'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  travel?: Resolver<ResolversTypes['Travel'], ParentType, ContextType, RequireFields<QueryTravelArgs, 'id'>>;
  travels?: Resolver<ResolversTypes['TravelList'], ParentType, ContextType, RequireFields<QueryTravelsArgs, 'limit' | 'offset' | 'sort'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TourResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tour'] = ResolversParentTypes['Tour']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  endingDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  startingDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ToursListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ToursList'] = ResolversParentTypes['ToursList']> = {
  data?: Resolver<Array<ResolversTypes['Tour']>, ParentType, ContextType>;
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TravelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Travel'] = ResolversParentTypes['Travel']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  moods?: Resolver<ResolversTypes['Moods'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numberOfDays?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numberOfNights?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tours?: Resolver<ResolversTypes['ToursList'], ParentType, ContextType, RequireFields<TravelToursArgs, 'limit' | 'offset' | 'sort'>>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TravelListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TravelList'] = ResolversParentTypes['TravelList']> = {
  data?: Resolver<Array<ResolversTypes['Travel']>, ParentType, ContextType>;
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Moods?: MoodsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  Tour?: TourResolvers<ContextType>;
  ToursList?: ToursListResolvers<ContextType>;
  Travel?: TravelResolvers<ContextType>;
  TravelList?: TravelListResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

