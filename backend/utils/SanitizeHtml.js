const sanitizeHtml = require('sanitize-html');

const clean = (dirty) => sanitizeHtml(dirty, {
  allowedTags: [
    'p','br','b','i','em','strong','u','s','blockquote','code','pre',
    'ul','ol','li','a','h1','h2','h3','h4','h5','h6','img','span','div'
  ],
  allowedAttributes: {
    a: ['href','name','target','rel'],
    img: ['src','alt','title','width','height'],
    '*': ['style']
  },
  allowedSchemes: ['http','https','mailto','tel','data'],
});

module.exports = { clean };
