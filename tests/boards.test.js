import 'cross-fetch/polyfill';
import seedDataBase, {
  boardOne,
  boardTwo,
  userOne,
  userTwo
} from './utils/seedDatabase';
import {
  myBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  getOneBoard
} from './utils/operations';
import getClient from './utils/getClient';
import prisma from '../src/prisma';

const client = getClient();
beforeEach(seedDataBase);

test('Should get all boards of a user', async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: myBoards });

  expect(data.boards.length).toBe(2);
  expect(data.boards[0].author.id).toBe(userOne.user.id);
});

test('Should get a board of a user based on its id', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: boardOne.board.id
  };
  const { data } = await client.query({ query: getOneBoard, variables });

  expect(data.board.author.id).toBe(userOne.user.id);
});

test('Should create a board when a user is logged in', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: { title: 'test board' }
  };
  const { data } = await client.mutate({ mutation: createBoard, variables });
  const exists = await prisma.exists.Board({
    id: data.createBoard.id
  });

  expect(exists).toBe(true);
  expect(data.createBoard.title).toBe('test board');
});

test('Should update a board when a user is logged in', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: boardOne.board.id,
    data: { title: 'trello board' }
  };
  const { data } = await client.mutate({ mutation: updateBoard, variables });
  const exists = await prisma.exists.Board({
    id: boardOne.board.id
  });

  expect(exists).toBe(true);
  expect(data.updateBoard.title).toBe('trello board');
});

test('Should delete a board correctly', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: boardTwo.board.id
  };
  const { data } = await client.mutate({ mutation: deleteBoard, variables });
  const exists = await prisma.exists.Board({
    id: boardTwo.board.id
  });

  expect(exists).toBe(false);
});
