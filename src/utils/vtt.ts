import type { TranscriptSegment } from "./openai";

/**
 * Formats seconds to VTT time format: HH:MM:SS.mmm
 */
function formatVttTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

/**
 * Converts timed transcript segments to a WebVTT file string.
 * Merges consecutive segments whose combined text is short for better readability.
 */
export function segmentsToVtt(segments: TranscriptSegment[]): string {
  const lines = ["WEBVTT", ""];
  const MAX_CUE_CHARS = 45;

  let cueStart: number | null = null;
  let cueEnd: number | null = null;
  let cueTexts: string[] = [];

  function flushCue(): void {
    if (cueStart !== null && cueEnd !== null && cueTexts.length > 0) {
      lines.push(
        `${formatVttTime(cueStart)} --> ${formatVttTime(cueEnd)}`
      );
      lines.push(cueTexts.join(" "));
      lines.push("");
    }
    cueStart = null;
    cueEnd = null;
    cueTexts = [];
  }

  for (const seg of segments) {
    if (cueStart === null) {
      cueStart = seg.start;
      cueEnd = seg.end;
      cueTexts = [seg.text];
    } else {
      const combinedLength = cueTexts.join(" ").length + seg.text.length + 1;
      if (combinedLength <= MAX_CUE_CHARS) {
        cueEnd = seg.end;
        cueTexts.push(seg.text);
      } else {
        flushCue();
        cueStart = seg.start;
        cueEnd = seg.end;
        cueTexts = [seg.text];
      }
    }
  }

  flushCue();
  return lines.join("\n");
}
