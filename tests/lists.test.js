import 'cross-fetch/polyfill';
import seedDataBase, {
  boardOne,
  boardTwo,
  userOne,
  userTwo
} from './utils/seedDatabase';
import { getLists, getOneList } from './utils/operations';
import getClient from './utils/getClient';
import prisma from '../src/prisma';
