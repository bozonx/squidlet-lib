# squidlet-lib

Common lib for squidlet projects. The aim of this lib is the most simple way to do things.

## Installation

```bash
npm install squidlet-lib
```

## Usage

### ES Modules (recommended)

```javascript
import { 
  isEmptyArray, 
  lastItem, 
  compactUndefined,
  cloneDeepObject,
  firstLetterToUpperCase,
  makeUniqId 
} from 'squidlet-lib';

// Array utilities
console.log(isEmptyArray([])); // true
console.log(lastItem([1, 2, 3, 4, 5])); // 5
console.log(compactUndefined([1, undefined, 2, null, 3])); // [1, 2, null, 3]

// String utilities
console.log(firstLetterToUpperCase('hello world')); // "Hello world"

// ID generation
console.log(makeUniqId()); // "4b2d3030"
```

### CommonJS

```javascript
const { 
  isEmptyArray, 
  lastItem, 
  makeUniqId 
} = require('squidlet-lib');

console.log(isEmptyArray([])); // true
console.log(makeUniqId()); // "4b2d3030"
```

## Available Modules

- **arrays** - Array manipulation utilities
- **objects** - Object manipulation utilities  
- **strings** - String manipulation utilities
- **uniqId** - Unique ID generation
- **deepObjects** - Deep object operations
- **deepManipulate** - Deep object manipulation
- **http** - HTTP utilities
- **paths** - Path manipulation utilities
- **url** - URL utilities
- **cookies** - Cookie utilities
- **hashSum** - Hash generation
- **Promised** - Promise utilities
- **IndexedEventEmitter** - Event emitter with indexed events
- **ConsoleLogger** - Console logging utilities
- **MemStorage** - In-memory storage
- **debounceCall** - Debounce and throttle utilities

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Publish

```bash
npm run build
npm publish
```

## TypeScript Support

This library includes full TypeScript support with type definitions. All exports are properly typed and will provide IntelliSense in TypeScript projects.
