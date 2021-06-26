export const podmanOutputSchema = {
  description: "The output of the code runned in a container for the challenge.",
  type: "object",
  required: ["stdout", "stderr", "success", "time", "memory"],
  example: {
    stdout: "Stdout from my code",
    stderr: "",
    success: true,
    time: 125,
    memory: 14592
  },
  properties: {
    stdout: {
      type: "string",
      description: "The stdout of the code runned."
    },
    success: {
      type: "boolean",
      description: "Boolean indicating the success of the challenge. When true, stderr is empty."
    },
    stderr: {
      type: "string",
      description: "The stderr of the code runned. It can be syntax error or failed conditions."
    },
    time: {
      type: "number",
      description: "The time needed to run the challenge."
    },
    memory: {
      type: "number",
      description: "The memory used to run the challenge."
    },
  }
} as const