import { StringBuilder } from './stringBuilder.mjs'
class Elaboration {
	constructor() {

	}
	getShort() {
		return null
	}
	getLong() {
		return null
	}
}

class ConstantElaboration extends Elaboration {
	constructor(o) {
		super()
		this.m_object = o
	}
	getShort() {
		return this
	}

	getLong() {
		return this
	}

	toString() {
		return this.m_object.toString()
	}
}

class ComposedElaboration extends Elaboration {
	/**
	 * The elements of the elaboration.
	 */
	m_parts = [];

	static create(short_e, [...parts]) {
		if (parts.length == 0) {
			return short_e;
		}
		return new ComposedElaboration(short_e, parts);
	}

	constructor(short_e, [...parts]) {
		super();
		m_short = short_e;
		for (var part of parts) {
			if (part instanceof Elaboration) {
				m_parts.push(part);
			}
			else {
				m_parts.push(new ConstantElaboration(part));
			}
		}
	}

	add(e) {
		m_parts.push(e);
	}

	getShort() {
		return m_short;
	}

	getLong() {
		if (m_parts == []) {
			return this;
		}
		return m_short;
	}

	toString() {
		if (m_parts == []) {
			return m_short.toString();
		}
		var out = new StringBuilder();
		for (let i = 0; i < m_parts.size(); i++) {
			if (i > 0) {
				out.append(", ");
			}
			out.append(m_parts.get(i).getShort());
		}
		return out.toString();
	}
}

class AndElaboration extends ComposedElaboration {
	constructor(short_e, [...parts]) {
		super(short_e, parts);
	}

	toString() {
		if (m_parts == []) {
			return m_short.toString();
		}
		var out = new StringBuilder();
		for (let i = 0; i < m_parts.size(); i++) {
			if (i > 0) {
				out.append(" and ");
			}
			out.append(m_parts.get(i).getShort());
		}
		return out.toString();
	}
}

class OrElaboration extends ComposedElaboration {
	constructor(short_e, [...parts]) {
		super(short_e, parts);
	}

	toString() {
		if (m_parts == []) {
			return m_short.toString();
		}
		var out = new StringBuilder();
		for (let i = 0; i < m_parts.size(); i++) {
			if (i > 0) {
				out.append(" or ");
			}
			out.append(m_parts.get(i).getShort());
		}
		return out.toString();
	}
}

/**
 * Package exports
 */
export { AndElaboration, Elaboration, ConstantElaboration, ComposedElaboration, OrElaboration }