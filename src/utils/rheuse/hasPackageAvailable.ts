/**
 * detects whether a package can be imported in a universal, and safe, way
 *
 * note:
 * - carefully prevents react-native's metro bundler from throwing an error while proactively fetching all dependencies
 *   - it specifically requires the import to be within a try-catch to not throw its own error
 *   - ref: https://github.com/react-native-community/discussions-and-proposals/issues/120
 */
export const hasPackageAccessible = (packageName: string): boolean => {
  try {
    require(`${packageName}`); // note: we cast it into a string to avoid: https://stackoverflow.com/questions/42908116/webpack-critical-dependency-the-request-of-a-dependency-is-an-expression
    return true;
  } catch {
    return false;
  }
};
