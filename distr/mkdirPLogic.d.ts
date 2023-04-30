export declare function mkdirPLogic(pathToDir: string, isDirExists: (dirName: string) => Promise<boolean>, mkdir: (dirName: string) => Promise<void>): Promise<boolean>;
