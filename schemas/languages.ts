/**
 * The languages supported for the challenges and the necessary
 * information to run the containers (image and command to run 
 * the code)
 */

export const languages = {
  js: {
    name: "javascript",
    image: "docker.io/library/node:14-alpine",
    runner: "node"
  },
  py: {
    name: "python",
    image: "docker.io/library/python:3.9-alpine",
    runner: "python3"
  }
} as const
