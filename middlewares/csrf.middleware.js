const { doubleCsrf } = require("csrf-csrf");
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret:()=> process.env.CSRFSECRET,
  getSessionIdentifier: (req) => req.session.id,
  cookieName: "lost_and_found",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
  },
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
});
module.exports = { generateCsrfToken, doubleCsrfProtection };
