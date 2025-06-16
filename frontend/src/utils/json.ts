import { ParsedJsonValue } from '../types';

export const parseJsonValues = (jsonString: string): ParsedJsonValue[] => {
  try {
    const parsed = JSON.parse(jsonString);
    const values: ParsedJsonValue[] = [];
    
    const traverse = (obj: any, path: string = '') => {
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.keys(obj).forEach(key => {
          const currentPath = path ? `${path}.${key}` : key;
          const value = obj[key];
          
          if (value === null || value === undefined) {
            values.push({
              key,
              value,
              isNull: true,
              path: currentPath,
            });
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            traverse(value, currentPath);
          } else {
            values.push({
              key,
              value,
              isNull: false,
              path: currentPath,
            });
          }
        });
      }
    };
    
    traverse(parsed);
    return values;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
};

export const formatJsonValue = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};