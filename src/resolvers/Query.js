import getUserId from '../utils/getUserId';
const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };
    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      };
    }
    return prisma.query.users(opArgs, info);
  },

  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },

  boards(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        }
      ];
    }
    return prisma.query.boards(opArgs, info);
  },

  async board(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const boards = await prisma.query.boards(
      {
        where: {
          AND: [
            {
              id: args.id
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );
    if (!boards.length) {
      throw new Error('Board not found');
    }

    return boards[0];
  },

  lists(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        }
      ];
    }
    return prisma.query.lists(opArgs, info);
  },

  async list(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const lists = await prisma.query.lists(
      {
        where: {
          AND: [
            {
              id: args.id
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );
    if (!lists.length) {
      throw new Error('List not found');
    }

    return lists[0];
  },

  cards(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          tag_contains: args.query
        },
        {
          text_contains: args.query
        }
      ];
    }
    return prisma.query.cards(opArgs, info);
  }
};

export { Query as default };
