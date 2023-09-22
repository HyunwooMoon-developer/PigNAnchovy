import { startSession } from 'mongoose';
import { UserInterface } from '../../interface/interfaces';
import User_Model from '../../models/user_models';

const User_Mutation = {
  Mutation: {
    createUser: async (
      src: any,
      args: any,
      context: any
    ): Promise<UserInterface> => {
      let user: UserInterface = {} as any;

      const session = await startSession();

      try {
        await session.startTransaction();

        user = new User_Model({ ...args.input });

        await user.save();

        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        throw err;
      }

      await session.endSession();

      return user;
    },
  },
};

export default User_Mutation;
