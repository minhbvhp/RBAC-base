import { createUserStub } from '../../users/test/stubs/user.stub';
import {
  hashedToken,
  mockAccessToken,
  mockRefreshToken,
} from '../test/mocks/tokens.mock';

export const AuthService = jest.fn().mockReturnValue({
  getAuthenticatedUser: jest.fn().mockResolvedValue(createUserStub()),
  verifyPlainContentWithHashedContent: jest.fn(),
  generateAccessToken: jest.fn().mockReturnValue(mockAccessToken),
  generateRefreshToken: jest.fn().mockReturnValue(mockRefreshToken),
  signIn: jest.fn().mockResolvedValue({
    access_token: mockAccessToken,
    refresh_token: mockRefreshToken,
  }),
  getUserIfRefreshTokenMatched: jest.fn().mockResolvedValue(createUserStub()),
  storeRefreshToken: jest.fn(),
  hashToken: jest.fn().mockResolvedValue(hashedToken),
  verifyHashedToken: jest.fn().mockRejectedValue(true),
});
