import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill para Node (para React Router y otros)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;