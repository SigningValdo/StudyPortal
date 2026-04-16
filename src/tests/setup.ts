/**
 * CONFIGURATION DES TESTS
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Nettoyage après chaque test
afterEach(() => {
  cleanup();
});

export { expect };
