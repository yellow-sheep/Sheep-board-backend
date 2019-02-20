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

const updateBoard = gql`
  mutation($id: ID!, $data: UpdateBoardInput!) {
    updateBoard(id: $id, data: $data) {
      title
      author {
        name
      }
    }
  }
`;

const deleteBoard = gql`
  mutation($id: ID!) {
    deleteBoard(id: $id) {
      title
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

const getOneBoard = gql`
  query($id: ID!) {
    board(id: $id) {
      title
      author {
        id
      }
    }
  }
`;

//lists
const getLists = gql`
  query {
    lists {
      title
      author {
        id
      }
    }
  }
`;

const getOneList = gql`
  query($id: ID!) {
    list(id: $id) {
      title
      author {
        id
      }
    }
  }
`;

export {
  createUser,
  login,
  getUsers,
  getProfile,
  createBoard,
  myBoards,
  updateBoard,
  deleteBoard,
  getOneBoard,
  getLists,
  getOneList
};
