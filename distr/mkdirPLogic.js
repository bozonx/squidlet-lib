import { pathDirname, pathBasename, pathIsAbsolute, PATH_SEP } from './paths.js';
import { trimCharEnd } from './strings.js';
export async function mkdirPLogic(pathToDir, isDirExists, mkdir) {
    if (!pathIsAbsolute(pathToDir)) {
        throw new Error(`path "${pathToDir}" has to be absolute`);
    }
    else if (pathToDir.indexOf('~') === 0) {
        throw new Error(`The ~ as root path doesn't supported`);
    }
    // if dir exists do nothing
    if (await isDirExists(pathToDir))
        return false;
    const preparedPath = trimCharEnd(pathToDir, PATH_SEP);
    // not existent dirs from closest to further
    const dirsToCreate = [];
    // dir which is already exists
    let existentBasePath = PATH_SEP;
    async function recursionFind(localPathToDir) {
        if (!localPathToDir || localPathToDir === PATH_SEP) {
            return;
        }
        else if (await isDirExists(localPathToDir)) {
            // save existent part of path
            existentBasePath = localPathToDir;
            // finish of finding
            return;
        }
        else {
            // Dir doesn't exist at the moment
            // split path
            const shorterPath = pathDirname(localPathToDir);
            const lastPart = pathBasename(localPathToDir);
            // store it to be further created
            dirsToCreate.push(lastPart);
            // go deeper
            await recursionFind(shorterPath);
        }
    }
    await recursionFind(preparedPath);
    if (!dirsToCreate.length)
        return false;
    // create paths
    for (let pathIndex in dirsToCreate.reverse()) {
        const pathPart = dirsToCreate.slice(0, parseInt(pathIndex) + 1).join(PATH_SEP);
        const fullPath = `${existentBasePath}${PATH_SEP}${pathPart}`;
        await mkdir(fullPath);
    }
    return true;
}
