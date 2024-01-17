export const loginQuery = gql`
  mutation login($loginInput: LoginInput!) {
    login(loginInput: $loginInput)
  }
`;

export const activeUserQuery = gql`
  query me {
    me {
      id
      email
      roles {
        name
      }
    }
  }
`;

export const usersQuery = gql`
  query users {
    users {
      id
      email
      roles {
        id
        name
      }
    }
  }
`;

export const createUserMutation = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      email
      roles {
        id
        name
      }
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
      id
      name
      description
      isPublic
      tours(
        limit: $limit
        offset: $offset
        priceFrom: $priceFrom
        priceTo: $priceTo
        startingDate: $startingDate
        endingDate: $endingDate
      ) {
        id
        name
        startingDate
        endingDate
        price
      }
    }
  }
`;

export const createTravelMutation = gql`
  mutation createTravel($createTravelInput: CreateTravelInput!) {
    createTravel(createTravelInput: $createTravelInput) {
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
    }
  }
`;

export const updateTravelMutation = gql`
  mutation updateTravel($updateTravelInput: UpdateTravelInput!) {
    updateTravel(updateTravelInput: $updateTravelInput) {
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
    }
  }
`;

export const removeTravelMutation = gql`
  mutation removeTravel($id: String!) {
    removeTravel(id: $id)
  }
`;

export const removeTourMutation = gql`
  mutation removeTour($id: String!) {
    removeTour(id: $id)
  }
`;
