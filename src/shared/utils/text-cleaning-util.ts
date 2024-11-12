import * as sanitizeHtml from 'sanitize-html';

export const cleanHTML = (data: string): string => {
  return sanitizeHtml(data, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
  });
};
