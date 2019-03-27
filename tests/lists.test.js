import 'cross-fetch/polyfill';
import seedDatabase, {
  userOne,
  boardOne,
  boardTwo,
  listOne,
  listTwo
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  createAList,
  updateList,
  getLists,
  getOneList,
  deleteList
} from './utils/operations';
import prisma from '../src/prisma';

const client = getClient();
beforeEach(seedDatabase);

test('Should get all lists of a user', async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: getLists });

  expect(data.lists.length).toBe(2);
  expect(data.lists[0].author.id).toBe(userOne.user.id);
});

test('Should get one list of a user based on the id', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: listOne.list.id
  };
  const { data } = await client.query({ query: getOneList, variables });

  expect(data.list.author.id).toBe(userOne.user.id);
  expect(data.list.board.id).toBe(boardOne.board.id);
});

test('Should create a list when a user is logged in', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: 'test list',
      board: boardTwo.board.id
    }
  };

  const { data } = await client.mutate({ mutation: createAList, variables });
  const listExists = await prisma.exists.List({
    id: data.createList.id
  });

  expect(listExists).toBe(true);
  expect(data.createList.title).toBe('test list');
});

test('Should update a list when a user is logged in', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: listTwo.list.id,
    data: {
      title: 'Prepare for interviews'
    }
  };
  const { data } = await client.mutate({ mutation: updateList, variables });

  expect(data.updateList.title).toBe('Prepare for interviews');
});

test('Should delete a list when a user is logged in', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: listTwo.list.id
  };
  const { data } = await client.mutate({ mutation: deleteList, variables });
  const listExists = await prisma.exists.List({
    id: listTwo.list.id
  });

  expect(listExists).toBe(false);
});
