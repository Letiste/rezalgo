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
