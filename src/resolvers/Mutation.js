import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generatedToken from '../utils/generatedToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error('Email taken');
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

    if (typeof args.data.password === 'string') {
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
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);
    if (!isMatch) {
      throw new Error('Wrong username or password');
    }

    return {
      user,
      token: generatedToken(user.id)
    };
  },

  createBoard(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createBoard(
      {
        data: {
          title: args.data.title,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },

  async updateBoard(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const boardExists = await prisma.exists.Board({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!boardExists) {
      throw new Error('Unable to update the board');
    }

    return prisma.mutation.updateBoard(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },

  async deleteBoard(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const boardExists = await prisma.exists.Board({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!boardExists) {
      throw new Error('Unable to delete the board');
    }

    return prisma.mutation.deleteBoard(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async createList(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const boardExists = await prisma.exists.Board({
      id: args.data.boardExists
    });
    if (!boardExists) {
      throw new Error("Can't find the board");
    }
    return prisma.mutation.createList(
      {
        data: {
          title: args.data.title,
          author: {
            connect: {
              id: userId
            }
          },
          board: {
            connect: {
              id: args.data.board
            }
          }
        }
      },
      info
    );
  },

  async updateList(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const ListExists = await prisma.exists.List({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!ListExists) {
      throw new Error('Unable to update the list');
    }
    return prisma.mutation.updateList(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  }
};

export { Mutation as default };
