export const responseSchema = {
  type: "object",
  required: ["stdout", "stderr", "success", "time", "memory"],
  properties: {
    stdout: {
      type: "string"
    },
    success: {
      type: "string"
    },
    stderr: {
      type: "string"
    },
    time: {
      type: ["string", "null"]
    },
    memory: {
      type: ["string", "null"]
    },
  }
} as const