import { ClickEventType } from '../ClickEvent';
import { HoverEventType } from '../HoverEvent';
import { v4 as uuidv4 } from 'uuid';
import type { Color } from '../../Color';

export type FieldType = 'string';

export interface FieldSpecifier {
	field: string;
	placeholder: string | null;
	datalistID: string | null;
	fieldType: FieldType;
}

export abstract class Snippet {
	id: string;

	bold = false;
	italic = false;
	underlined = false;
	strikethrough = false;
	obfuscated = false;

	font: string = null;

	color: Color = 'none';

	insertion = '';

	click_event_type: ClickEventType = ClickEventType.none;
	click_event_value = '';

	hover_event_type: HoverEventType = HoverEventType.none;
	hover_event_value = '';
	hover_event_object: object = {};
	hover_event_children: Array<Snippet> = [];

	constructor(id: string = null) {
		if (id !== null) {
			this.id = id;
		} else {
			this.id = uuidv4();
		}
	}

	editor_fields(): Array<FieldSpecifier> {
		return [];
	}

	value(field: FieldSpecifier): string {
		return this[field.field] as string;
	}
}
