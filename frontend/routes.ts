/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/auth/new-verification"
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/new-verification",
  "/auth/error",
  "/auth/reset",
  "/auth/two-factor",
  "/auth/reset-verification",
  "/auth/new-password"
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const rootRoute = "/";

export const DEFAULT_LOGIN_REDIRECT = "/home";
export const DEFAULT_LOGOUT_REDIRECT = "/auth/login";