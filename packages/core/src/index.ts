import { create as generate, login, verify } from './auth';
import { create, mine, is_chain_valid } from './blockchain';
import { start } from './runtime';

export const auth = {
  create: generate,
  login,
  verify
}

export const document = {
  create,
  load: start,
  commit: mine,
  verify: is_chain_valid
};
