# Lessons Learned

## Session: Book Manager from scratch (2026-03-08)
- Node.js was not installed on this Windows machine — npx/npm commands fail silently under bash PATH
- Solution: Build all files manually; user can npm install once Node.js is set up
- Always check `which node` early when building a new project on a user machine
