module.exports = {
  "env": {"browser": true, "node": true},
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "windows"],
    "no-console": ["error", {"allow": ["log", "warn", "error"]}],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
};
