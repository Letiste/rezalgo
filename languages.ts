export const languages = {
  js: {
    name: "Javascript",
    image: "docker.io/library/node:14-alpine",
    runner: "node"
  },
  py: {
    name: "Python",
    image: "docker.io/library/python:3.9-alpine",
    runner: "python3"
  }
} as const
