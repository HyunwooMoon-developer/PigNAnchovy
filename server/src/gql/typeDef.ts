import { gql } from 'graphql-tag';
import User_Type from './User/user_types';

const misc_Schema = gql`
  scalar Date

  scalar DateTime

  type SuccessResult {
    success: Boolean
  }
`;

const typeDefs = [misc_Schema, User_Type];

export default typeDefs;
