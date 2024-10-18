import { RequestWithUser } from '../../../../utils/types/request.type';
import {
  adminUserStub,
  createUserStub,
} from '../../../users/test/stubs/user.stub';

export const mockRequestWithUser = {
  user: adminUserStub(),
} as RequestWithUser;
