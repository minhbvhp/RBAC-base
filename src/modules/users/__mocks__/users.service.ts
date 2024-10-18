import {
  afterUpdateUserStub,
  allUserStub,
  createUserStub,
} from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  getUserByEmail: jest.fn().mockResolvedValue(createUserStub()),
  createUser: jest.fn().mockResolvedValue({ userId: createUserStub().id }),
  getAllUsers: jest.fn().mockResolvedValue(allUserStub().slice(20, 30)),
  updateUser: jest.fn().mockResolvedValue(afterUpdateUserStub()),
  deleteUserPermanently: jest.fn().mockResolvedValue(createUserStub()),
  setCurrentRefreshToken: jest.fn(),
  getUserById: jest.fn().mockResolvedValue(createUserStub()),
});
