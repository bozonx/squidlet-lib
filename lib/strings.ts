export function trimCharStart(src: string, char: string = ' '): string {
  if (typeof src !== 'string') return src;

  let countToCut = 0;

  for (let i = 0; i < src.length; i++) {
    if (src[i] === char) {
      countToCut++;
    }
    else {
      break;
    }
  }

  return src.slice(countToCut);
}

export function trimCharEnd(src: string, char: string = ' '): string {
  if (typeof src !== 'string') return src;

  let countToCut = 0;

  for (let i = src.length - 1; i >= 0; i--) {
    if (src[i] === char) {
      countToCut--;
    }
    else {
      break;
    }
  }

  if (!countToCut) return src;

  return src.slice(0, countToCut);
}

export function trimChar(src: string, char: string = ' '): string {
  return trimCharEnd( trimCharStart(src, char), char);
}

/**
 * Turn only the first letter to upper case
 */
export function firstLetterToUpperCase(value: string): string {
  if (!value) return value;

  const split: string[] = value.split('');

  split[0] = split[0].toUpperCase();

  return split.join('');
}

/**
 * Split first element of path using separator. 'path/to/dest' => [ 'path', 'to/dest' ]
 */
export function splitFirstElement(
  fullPath: string,
  separator: string
): [ string, string | undefined ] {
  if (!fullPath) throw new Error(`fullPath param is required`);
  if (!separator) throw new Error(`separator is required`);

  const split: string[] = fullPath.split(separator);
  const first: string = split[0];

  if (split.length === 1) {
    return [ fullPath, undefined ];
  }

  return [ first, split.slice(1).join(separator) ];
}

/**
 * Split last part of path. 'path/to/dest' => [ 'dest', 'path/to' ]
 */
export function splitLastElement(
  fullPath: string,
  separator: string
): [ string, string | undefined ] {
  if (!fullPath) throw new Error(`fullPath param is required`);
  if (!separator) throw new Error(`separator is required`);

  const split = fullPath.split(separator);
  const last: string = split[split.length - 1];

  if (split.length === 1) {
    return [ fullPath, undefined ];
  }

  // remove last element from path
  split.pop();

  return [ last, split.join(separator) ];
}

export function padStart(srcString: string, length: number = 0, chars: string = ' '): string {
  let result = '';
  const repeats = length - srcString.length;

  if (repeats <= 0) return srcString;

  for (let i = 0; i < repeats; i ++) result += chars;

  return `${result}${srcString}`;

  // const filled: string[] = new Array(repeats);
  //
  // return `${filled.fill(chars).join('')}${srcString}`;
}

// TODO: test
export function simpleTemplate(tmpl: string, data: Record<string, any> = {}): string {
  if (!tmpl) return ''

  let res = tmpl

  for (const key of Object.keys(data)) {
    res = res.replace(
      new RegExp(`\\$\\{${key}\\}`, 'g'),
      String(data[key])
    )
  }

  return res
}

// TODO: test
export function replaceLineBreak(str: string): string {
  if (!str) return ''

  return str.replace(/\\n/g, '\n')
}

// TODO: test
export function toCamelCase(text?: string): string {
  if (!text) return ''
  
  return text
    .split(/[\s-_]+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
};

// TODO: test
export function toPascalCase(text?: string): string {
  if (!text) return ''
  
  return text
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

// TODO: test
export function toSnakeCase(text?: string): string {
  if (!text) return ''
  
  return text
    .split(/[\s-_]+/)
    .map((word) => word.toLowerCase())
    .join("_");
};

// TODO: test
export function toKebabCase(text?: string): string {
  if (!text) return ''

  return text
    .split(/[\s-_]+/)
    .map((word) => word.toLowerCase())
    .join("-");
};

// TODO: test
export function normalizeText(text?: string): string {
  if (!text) return "";

  // Определяем формат текста и восстанавливаем в читаемый вид
  let words: string[] = [];

  // Проверяем на текст, уже разделенный пробелами
  if (text.includes(" ")) {
    words = text.split(" ");
  }
  // Проверяем на SnakeCase (слова разделены подчеркиванием)
  else if (text.includes("_")) {
    words = text.split("_");
  }
  // Проверяем на KebabCase (слова разделены дефисами)
  else if (text.includes("-")) {
    words = text.split("-");
  }
  // Проверяем на CamelCase/PascalCase (слова разделены заглавными буквами)
  else if (/[\p{Lu}]/u.test(text)) {
    // Разделяем по заглавным буквам, сохраняя их
    // Используем Unicode свойства для поддержки любых языков
    words = text.split(/(?=[\p{Lu}])/u);
  }
  // Если нет специальных разделителей, считаем что это одно слово
  else {
    words = [text];
  }

  // Обрабатываем каждое слово: первая буква заглавная, остальные строчные
  const normalizedWords = words
    .filter((word) => word.length > 0) // Убираем пустые строки
    .map((word, index) => {
      if (index === 0) {
        // Первое слово: первая буква заглавная, остальные строчные
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      } else {
        // Остальные слова: все буквы строчные
        return word.toLowerCase();
      }
    });

  // Объединяем слова пробелами
  return normalizedWords.join(" ");
}
