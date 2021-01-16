import {
  create as generate,
  importSigningKey,
  importEncryptionKey,
  verifySignature,
  verifyEncryptionKey
} from './auth';
import { create, mine, is_chain_valid } from './blockchain';
import { start } from './runtime';

export const auth = {
  create: generate,
  importSigningKey,
  importEncryptionKey,
  verifySignature,
  verifyEncryptionKey,
}

export const document = {
  create,
  load: start,
  commit: mine,
  verify: is_chain_valid
};
