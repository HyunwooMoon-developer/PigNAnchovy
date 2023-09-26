import { startSession } from 'mongoose';
import { UserInterface } from '../../interface/interfaces';
import User_Model from '../../models/user_models';
import bcrypt from 'bcrypt';

const User_Mutation = {
  Mutation: {
    createUser: async (src: any, args: any) => {
      let user: UserInterface = {} as any;

      const session = await startSession();

      try {
        await session.startTransaction();

        const userExsists = await User_Model.findOne({
          username: args.input.username,
        });

        if (userExsists) {
          throw new Error('User already exists');
        }

        user = new User_Model({
          ...args.input,
          password: bcrypt.hashSync(
            args.input.password,
            bcrypt.genSaltSync(10)
          ),
        });

        await user.save();

        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        throw err;
      }

      await session.endSession();

      return user;
    },
    updateUser: async (src: any, args: any) => {
      let user: UserInterface = {} as any;
      const session = await startSession();
      try {
        await session.startTransaction();
        let existUser = await User_Model.findById(args.id);

        if (existUser) {
          let { password, ...input } = args.input;

          await User_Model.findByIdAndUpdate(args.id, input);
        } else {
          throw new Error('Unknwon User');
        }

        let updated = await User_Model.findById(args.id);
        if (updated) {
          user = updated;
        } else {
          throw new Error('Updated Failed');
        }
      } catch (err) {
        await session.abortTransaction();
        throw err;
      }

      await session.endSession();
      return user;
    },
    resetPassword: async (src: any, args: any) => {
      let user = await User_Model.findById(args.id);

      if (user) {
        let checkPassword =
          args.originalPassword &&
          bcrypt.compareSync(args.originalPassword, user.password);
        if (checkPassword) {
          let updated = await User_Model.findByIdAndUpdate(args.id, {
            password: bcrypt.hashSync(args.newPassword, bcrypt.genSaltSync(10)),
          });

          if (updated) {
            return { success: true };
          } else {
            return { succesS: false };
          }
        } else {
          throw new Error('Password is not correct');
        }
      } else {
        throw new Error('User is not exists');
      }
    },
  },
};

export default User_Mutation;
