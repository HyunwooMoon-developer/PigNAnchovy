import { gql } from 'graphql-tag';

const User_Type = gql`
  type User {
    _id: ID!
    username: String!
    password: String!
    role: Int!
  }

  type Query {
    Users(
      filter: UserFilter
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
    ): [User!]!

    User(id: ID!): User!
  }

  type Mutation {
    createUser(input: UserInput): User!

    updateUser(id: ID!, input: UserInput): User!

    resetPassword(
      id: ID!
      originalPassword: String!
      newPassword: String!
    ): SuccessResult!
  }

  input UserInput {
    username: String!
    password: String
    role: Int!
  }

  input UserFilter {
    role: Int!
  }
`;

export default User_Type;
