// temp.js
const fs = require('fs');

let c = fs.readFileSync('src/components/AppSidebar.tsx', 'utf8');

// Replace standard spans
c = c.replace(/className="group-data-\[collapsible=icon\]:hidden"/g, 'className={isCollapsed ? "hidden" : ""}');
c = c.replace(/className="group-data-\[collapsible=icon\]:mb-0 mb-2"/g, 'className={isCollapsed ? "mb-0 mb-2" : "mb-2"}');

// Replace grouped template literal classes
c = c.replace(/group-data-\[collapsible=icon\]:hidden/g, '${isCollapsed ? "hidden" : ""}');
c = c.replace(/group-data-\[collapsible=icon\]:mb-0/g, '${isCollapsed ? "mb-0" : ""}');


fs.writeFileSync('src/components/AppSidebar.tsx', c);
