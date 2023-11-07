import {parseValue} from './common.js'


/**
 * Work with program arguments
 */


/**
 * Parse arguments.
 * It supports formats:
 *   - -a value
 *   - --name value
 *   - -a=value
 *   - --name=value
 *   - -a - means {a: true}
 *   - -name - means {name: true}
 *
 * To obviously resolve boolean args put it to the list of "booleanArgs"
 * use:
 *    parseArgs(process.argv.slice(2))
 * @param rawArgs
 * @param booleanParams
 */
export function parseArgs(
  rawArgs: string | string [],
  booleanParams: string[]
): {params: Record<string, any>, args: string[]} {
  const params: Record<string, any> = {}
  const args: string[] = []
  let normalized: string[] = []

  if (!rawArgs) return {params, args}
  // TODO: навеное не правильно - тогда потеряются файлы с пробелами
  else if (typeof rawArgs === 'string') normalized = normalizeArgs(rawArgs.split(' '), booleanParams)
  else if (Array.isArray(rawArgs)) normalized = normalizeArgs(rawArgs, booleanParams)
  else throw new Error(`Wrong args`)

  for (const item of normalized) {
    const match = item.match(/^--?([\w\d\-_:$@!]+)(=|[\s]+)?(.*)$/)

    if (match) {
      // parameter
      const paramName = match[1]
      const paramValue = parseValue(match[3])

      params[paramName] = (!paramValue)
        // it is a boolean
        ? ((booleanParams.includes(paramName)) ? true : paramValue)
        : paramValue
    }
    else {
      // numeric argument
      args.push(item)
    }
  }

  return {params, args}
}


/**
 * It join wrongly slit of arguments.
 * The problem with filenames which contain spaces.
 * It make separate elements which start only from "-".
 * Which are start from any other symbol - it join to the last string.
 * It puts numeric arguments to the end of line
 * @param rawArgs
 * @param booleanParams
 */
export function normalizeArgs(
  rawArgs: string[],
  booleanParams: string[] = []
): string[] {
  let args: string[] = []
  const params: string[] = []

  for (let i = 0; i < rawArgs.length; i++) {
    const trimmed = rawArgs[i].trim()

    if (trimmed === '--') {
      args = [
        ...args,
        ...rawArgs
          .slice(i + 1)
          .map((el: string) => el.trim())
      ]

      break
    }
    else if (trimmed.match(/^-/)) {
      const equalStyleMatch = trimmed.match(/^(--?[\w\d\-_:$@!]+=)(.+)$/)

      if (equalStyleMatch) {
        params.push(equalStyleMatch[1] + equalStyleMatch[2].trim())

        continue
      }

      const spaceStyleMatch = trimmed.match(/^(--?[\w\d\-_:$@!]+)\s+(.+)$/)

      if (spaceStyleMatch) {
        params.push(spaceStyleMatch[1] + ' ' + spaceStyleMatch[2].trim())

        continue
      }

      // no value part - try to compare with boolean
      const paramNameMatch = trimmed.match(/^--?(.+)/)

      if (paramNameMatch) {
        const paramName = paramNameMatch[1].trim()

        if (booleanParams.includes(paramName)) {
          params.push(trimmed)

          continue
        }
      }

      // no value part - means the value is on the next items
      if (i >= rawArgs.length - 1) {
        // the last argument - just add a param like it is a boolean
        params.push(trimmed)
      }
      else {
        const nextValue = rawArgs[i + 1]
        const trimmedNextValue = nextValue.trim()

        if (trimmedNextValue.match(/^-/)) {
          // nothing to do - it is a boolean
          params.push(trimmed)
        }
        else {
          // get the next value as my value
          params.push(trimmed + ' ' + trimmedNextValue)

          i++
        }
      }
    }
    else {
      // argument
      args.push(trimmed)
    }
  }

  return [
    ...params,
    ...args,
  ]
}

/**
 * in case file names have spaces.
 * it means all the items after --name to other '-' means one value with spaces.
 * The problem is there no way to recognize how many spaces in file names
 * because process.argv splat all the spaces.
 * @param rawArgs
 */
export function tryResolveValuesWithSpaces(rawArgs: string[]): string[] {
  // TODO: make it
  // TODO: get a lot of next params ? пробелы должны сохраниться. ковычкм

  return rawArgs
}
