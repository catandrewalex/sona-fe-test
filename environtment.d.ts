declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PROTOCOL: string;
      API_HOST: string;
      ENVIRONMENT: "local" | "staging" | "production";
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
