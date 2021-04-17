const { TextEncoder } = require('util');

global.crypto = {
  subtle: {
    digest: async () => {},
    exportKey: async () => ({
      "x": "ztE--LL6yBgQOy7Yr6egGZYi4n3OLWX22GsBCYPx-efYNvePZQ6GEYT1SIvaIgZA",
      "y": "RuOLBSMJmD-BK5URkjwP32MoGLRzmyqNUIrdTpBOwnGP2BZepXzMNu9114YvMOoG"
    }),
    sign: () => 'VmkMteiNqM7eX6hpzby1lH3gQtmcmHyQ9DuWQ3s267WLjZHEkyJX7kaiyazfOHBI6qEuAe2VsxhGIW3bpSPMif2oeN1c0Iw/Ul7U5T/yG62RDgziDMjGR3kPZH2tyohc'
  },
};

global.TextEncoder = TextEncoder;