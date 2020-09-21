import { Color } from "../../Color";
import { ClickEventType } from "../ClickEvent";
import { HoverEventType } from "../HoverEvent";
import uuid = require("uuid");

export type FieldType = "string" | "string[]"

export interface FieldSpecifier {
    field: string,
    placeholder: string | null,
    datalistID: string | null
    fieldType: FieldType
}

export abstract class Snippet {
    id: string

    bold: boolean = false
    italic: boolean = false
    underlined: boolean = false
    strikethrough: boolean = false
    obfuscated: boolean = false
  
    font: string = null

    color: Color = "none"
  
    insertion: string = ""

    click_event_type: ClickEventType = ClickEventType.none
    click_event_value: string = ""

    hover_event_type: HoverEventType = HoverEventType.none
    hover_event_value: string = ""
    hover_event_object: object = {}
    hover_event_children: Array<Snippet> = []

    constructor(id: string = null) {
        if (id !== null) {
            this.id = id
        } else {
            this.id = uuid()
        }
    }

    editor_fields(): Array<FieldSpecifier> {
        return []
    }
}