export const containerOutputSchema = {
  description: "The output of the code runned in a container for the challenge.",
  type: "object",
  required: ["stdout", "stderr", "success", "time", "memory"],
  example: {
    stdout: "Stdout from my code",
    stderr: "",
    success: "my-secret-flag",
    time: 125,
    memory: 14592
  },
  properties: {
    stdout: {
      type: "string",
      description: "The stdout of the code runned."
    },
    success: {
      type: "string",
      description: "String containing the ctf flag validating the challenge. When not empty, stderr is empty."
    },
    stderr: {
      type: "string",
      description: "The stderr of the code runned. It can be syntax error or failed conditions. When not empty, sucess is empty."
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
