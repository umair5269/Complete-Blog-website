const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Create a window for DOMPurify
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

module.exports = (dirty) => {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }); 
};
