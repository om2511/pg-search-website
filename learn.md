# Learnings

## 2026-04-08
- In this workspace, `react-scripts build` and direct ESLint processes can finish without streaming final stdout back through the shell session. Verification should rely on concrete outputs such as generated `client/build/static/*` assets or captured log files, not on waiting for a “Compiled successfully” line that may never flush.
- When Vercel runs Create React App with `CI=true`, warnings are treated as build-breaking errors. The correct fix is source cleanup, not suppressing CI, because hook dependency warnings and accessibility warnings can hide real behavioral problems.
