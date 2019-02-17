import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import seedDataBase, {
  boardOne,
  boardTwo,
  userOne
} from './utils/seedDatabase';
import { myBoards, createBoard } from './utils/operations';
import getClient from './utils/getClient';
import prisma from '../src/prisma';

const client = getClient();
beforeEach(seedDataBase);

test('Should get the boards of a user', async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: myBoards });
  expect(data.boards.length).toBe(2);
  expect(data.boards[0].author.id).toBe(userOne.user.id);
});
