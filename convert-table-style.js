const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'SpedEditor.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Convert all p-2 border-r table cells to Dashboard style
const patterns = [
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 text-center"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm text-center"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 text-right"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm text-right"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-blue-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm text-right bg-blue-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-cyan-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm text-right bg-cyan-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-orange-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm text-right bg-orange-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-green-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm text-right bg-green-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-purple-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm text-right bg-purple-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 bg-blue-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm bg-blue-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 bg-cyan-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm bg-cyan-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 bg-orange-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm bg-orange-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 bg-green-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm bg-green-50/50"'
  },
  {
    from: /className="p-2 border-r border-gray-200 dark:border-gray-700 bg-purple-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm bg-purple-50/50"'
  },
  {
    from: /className="p-2 bg-purple-50\/50"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm bg-purple-50/50"'
  },
  {
    from: /className="p-2"/g,
    to: 'className="px-6 py-4 whitespace-nowrap text-sm"'
  }
];

patterns.forEach(pattern => {
  content = content.replace(pattern.from, pattern.to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Table styling conversion completed!');