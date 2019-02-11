import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generatedToken from "../utils/generatedToken";
import hashPassword from "../utils/hashPassword";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email taken");
    }

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: generatedToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }
    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });
    if (!user.id) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);
    if (!isMatch) {
      throw new Error("Wrong username or password");
    }

    return {
      user,
      token: generatedToken(user.id)
    };
  }
};

export { Mutation as default };
