import { VERSION } from "../constants"
import type { CommandType } from "../data/templates"
import type { Snippet } from "../classes/Snippets/SnippetTypes/Snippet"

export function export_snippets(snippets: Array<Snippet>, command: string, type: CommandType): string {
  const data = {
    "jformat": VERSION,
    "jobject": snippets,
    "command": command,
    "jtemplate": type
  }

  return JSON.stringify(data)
}