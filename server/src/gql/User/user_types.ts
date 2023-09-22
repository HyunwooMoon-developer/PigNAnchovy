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

    User(_id: ID!): User!
  }

  type Mutation {
    createUser(input: UserInput): User!
  }

  input UserInput {
    username: String!
    password: String!
    role: Int!
  }

  input UserFilter {
    role: Int!
  }
`;

export default User_Type;
