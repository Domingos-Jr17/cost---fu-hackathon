declare module 'compression' {
  const compression: any;
  export = compression;
}

declare module 'cors' {
  const cors: any;
  export = cors;
}

declare module 'express' {
  export * from '@types/express';
}

// Helmet updated its types
import helmet from 'helmet';
export default helmet;