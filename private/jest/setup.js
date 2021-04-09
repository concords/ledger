const { TextEncoder } = require('util');

global.crypto = {
  subtle: {
    digest: async () => {},
  },
};

global.TextEncoder = TextEncoder;