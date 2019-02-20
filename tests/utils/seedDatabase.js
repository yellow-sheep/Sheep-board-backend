import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('Red098!@#$ABC')
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: 'Jeff',
    email: 'jeff@example.com',
    password: bcrypt.hashSync('PassForJeffXCDS')
  },
  user: undefined,
  jwt: undefined
};

const boardOne = {
  input: {
    title: 'trello-clone'
  },
  board: undefined
};

const boardTwo = {
  input: {
    title: 'coffee-chats'
  },
  board: undefined
};

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyBoards();
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // Create user two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  //Create board one
  boardOne.board = await prisma.mutation.createBoard({
    data: {
      ...boardOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
  //Create board two
  boardTwo.board = await prisma.mutation.createBoard({
    data: {
      ...boardTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
};

export { seedDatabase as default, userOne, userTwo, boardOne, boardTwo };
