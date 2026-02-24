export function toFilter(str: string): RegExp {
  return new RegExp(`^${str}$`);
}

/**
 * Given a deeply nested object, return a "flattened" object where all
 * properties are on a single top-level object delimited by dots.
 *
 * Arrays are flattened by joining their indices with the delimiter.
 *
 * @example
 *   flattenObject({ a: { b: "c" } }); // { "a.b": "c" }
 */
export function flattenObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  function recurse(current: Record<string, any>, path: string[]) {
    for (const [key, value] of Object.entries(current)) {
      const newPath = path.concat(key);

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          recurse(item, newPath.concat(index.toString()));
        });
      } else if (typeof value === "object" && value !== null) {
        recurse(value, newPath);
      } else {
        result[newPath.join(".")] = value;
      }
    }
  }

  recurse(obj, []);
  return result;
}
