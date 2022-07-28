import {
	SvelteComponent,
	create_slot,
	get_all_dirty_from_scope,
	get_slot_changes,
	init,
	safe_not_equal,
	transition_in,
	transition_out,
	update_slot_base,
	detach_dev,
	detach_before_dev,
	detach_after_dev,
	detach_between_dev,
	children
} from "svelte/internal";

function getParams(ctx) {
	let [,,target,insertBefore] = ctx[2].ctx;

	if (!target && insertBefore) target = insertBefore.parentElement;

	let insertAfter = (() => {
		if (insertBefore) return insertBefore.previousSibling;

		if (insertBefore === null && target) return target.lastChild;
	})();

	return { target, insertBefore, insertAfter };
}

function create_fragment(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const { target, insertBefore } = getParams(ctx);

	let insertAfter;

	function createSlot() {
		const slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

		return {
			...slot,
			m() {
				insertAfter = getParams(ctx).insertAfter;

				if (target && !insertBefore && insertBefore !== null) {
					const nodes = children(target);

					for (const node of nodes)
						detach_dev(node);
				}

				return slot.m(target, insertBefore);
			},
			d(detaching) {
				if (!detaching) return;

				if (insertBefore && insertAfter) {
					return detach_between_dev(insertAfter, insertBefore);
				} else if (insertBefore) {
					return detach_before_dev(insertBefore);
				} else if (insertAfter) {
					return detach_after_dev(insertAfter);
				} else if (target) {
					for (const child of children(target)) {
						detach_dev(child);
					}
				}
			},
		};
	}

	let default_slot = createSlot();

	return {
		c() {
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
						null
					);
				} else {
					default_slot.d(true);

					default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

					default_slot.c();

					const { target, insertBefore } = getParams(ctx);

					default_slot.m(target, insertBefore);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { element, insertBefore } = $$props;

	$$self.$$set = $$props => {
		if ('element' in $$props) $$invalidate(0, element = $$props.element);
		if ('insertBefore' in $$props) $$invalidate(1, insertBefore = $$props.insertBefore);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [element, insertBefore, $$scope, slots];
}

export default class InElement extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, { target: 0, insertBefore: 1 });
	}
}
