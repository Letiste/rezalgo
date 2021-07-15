/**
 * The languages supported for the challenges and the necessary
 * information to run the containers (image and command to run 
 * the code)
 */

export const languages = {
  js: {
    name: "javascript",
    image: "node:16-alpine",
    runner: "node"
  },
  py: {
    name: "python",
    image: "python:3.9-alpine",
    runner: "python3"
  }
} as const
