import { UserInterface } from '../../interface/interfaces';
import User_Model from '../../models/user_models';

const User_Query = {
  Query: {
    Users: async (
      src: any,
      args: any,
      context: any
    ): Promise<Array<UserInterface>> => {
      let users: Array<UserInterface> = [];

      try {
        users = await User_Model.find();
      } catch (err: any) {
        throw err;
      }

      return users;
    },
    User: async (src: any, args: any, context: any): Promise<UserInterface> => {
      let user: UserInterface;

      try {
        user = (await User_Model.findById(args._id)) || ({} as any);
      } catch (err: any) {
        throw err;
      }

      return user;
    },
  },
};

export default User_Query;
