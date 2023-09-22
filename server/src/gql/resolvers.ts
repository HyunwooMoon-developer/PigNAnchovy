import GraphQLDate from 'graphql-iso-date';
import GraphQLDateTime from 'graphql-iso-date';
import User_Mutation from './User/user_mutation';
import User_Query from './User/user_query';

const misc_resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
};

const resolvers = [misc_resolvers, User_Mutation, User_Query];

export default resolvers;
