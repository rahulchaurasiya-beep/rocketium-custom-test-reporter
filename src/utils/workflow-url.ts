import type { CiInfo } from "../types.js";

export function resolveWorkflowRunUrl(ci: CiInfo, ciBuildId: string): string | null {
  if (ci.workflowRunUrl) return ci.workflowRunUrl;
  if (ci.repository && ci.workflowRunId) {
    return `https://github.com/${ci.repository}/actions/runs/${ci.workflowRunId}`;
  }
  if (ci.repository && /^\d+$/.test(ciBuildId)) {
    return `https://github.com/${ci.repository}/actions/runs/${ciBuildId}`;
  }
  return null;
}
