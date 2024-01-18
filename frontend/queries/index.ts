const userFields = `
  id
  email
  roles {
    id
    name
  }
`;

const travelFields = `
  id
  name
  description
  isPublic
  numberOfDays
  numberOfNights
  moods {
    culture
    history
    nature
    party
    relax
  }
`;

const tourFields = `
  id
  name
  startingDate
  endingDate
  price
`;

export const loginQuery = gql`
  mutation login($loginInput: LoginInput!) {
    login(loginInput: $loginInput)
  }
`;

export const activeUserQuery = gql`
  query me {
    me {
      ${userFields}
    }
  }
`;

export const usersQuery = gql`
  query users {
    users {
      ${userFields}
    }
  }
`;

export const createUserMutation = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      ${userFields}
    }
  }
`;

export const updateUserRolesMutation = gql`
  mutation updateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      ${userFields}
    }
  }
`;

export const removeUserMutation = gql`
  mutation removeUser($id: String!) {
    removeUser(id: $id) {
      id
    }
  }
`;

export const travelsQuery = gql`
  query travels($slug: String, $limit: Int, $offset: Int) {
    travels(slug: $slug, limit: $limit, offset: $offset) {
      ${travelFields}
    }
  }
`;

export const travelWithToursQuery = gql`
  query travel(
    $id: String!
    $limit: Int
    $offset: Int
    $priceFrom: Float
    $priceTo: Float
    $startingDate: DateTime
    $endingDate: DateTime
  ) {
    travel(id: $id) {
      ${travelFields}
      tours(
        limit: $limit
        offset: $offset
        priceFrom: $priceFrom
        priceTo: $priceTo
        startingDate: $startingDate
        endingDate: $endingDate
      ) {
        ${tourFields}
      }
    }
  }
`;

export const createTravelMutation = gql`
  mutation createTravel($createTravelInput: CreateTravelInput!) {
    createTravel(createTravelInput: $createTravelInput) {
      ${travelFields}
    }
  }
`;

export const updateTravelMutation = gql`
  mutation updateTravel($updateTravelInput: UpdateTravelInput!) {
    updateTravel(updateTravelInput: $updateTravelInput) {
      ${travelFields}
    }
  }
`;

export const removeTravelMutation = gql`
  mutation removeTravel($id: String!) {
    removeTravel(id: $id)
  }
`;

export const createTourMutation = gql`
  mutation createTour($createTourInput: CreateTourInput!) {
    createTour(createTourInput: $createTourInput) {
      ${tourFields}
    }
  }
`;

export const updateTourMutation = gql`
  mutation updateTour($updateTourInput: UpdateTourInput!) {
    updateTour(updateTourInput: $updateTourInput) {
      ${tourFields}
    }
  }
`;

export const removeTourMutation = gql`
  mutation removeTour($id: String!) {
    removeTour(id: $id)
  }
`;

export const rolesQuery = gql`
  query roles {
    roles {
      id
      name
    }
  }
`;