import { v4 as uuid } from 'uuid';

export const createQueueSession = () => {
  return uuid();
};
