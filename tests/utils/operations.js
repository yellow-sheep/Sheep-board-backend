import { gql } from 'apollo-boost';

//Users
const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const login = gql`
  mutation($data: LoginUserInput!) {
    login(data: $data) {
      token
    }
  }
`;

const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;
//Boards

const createBoard = gql`
  mutation($data: CreateBoardInput!) {
    createBoard(data: $data) {
      title
      author {
        name
      }
    }
  }
`;

const myBoards = gql`
  query {
    boards {
      title
      author {
        id
        name
      }
    }
  }
`;
export { createUser, login, getUsers, getProfile, createBoard, myBoards };
