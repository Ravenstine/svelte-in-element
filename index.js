import {
	SvelteComponent,
	create_slot,
	get_all_dirty_from_scope,
	get_slot_changes,
	init,
	safe_not_equal,
	transition_in,
	transition_out,
	update_slot_base
} from "svelte/internal";

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { target } = $$props;

	$$self.$$set = $$props => {
		if ('target' in $$props) $$invalidate(0, target = $$props.target);
		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	return [target, $$scope, slots];
}

function create_fragment(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

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
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[1],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
						null
					);
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

export default class InElement extends SvelteComponent {
	constructor({ props: { $$scope, $$slots, target } }) {
		super();

		const options = {
			target,
			props: {
				$$scope,
				$$slots: {
					default: [
						function (ctx) {
							const slot = $$slots.default[0](ctx);

							return {
								...slot,
								m(_target, anchor) {
									if (_target === target) return;

									return slot.m(target, anchor);
								},
							};
						}
					]
				},
			}
		};

		init(this, options, instance, create_fragment, safe_not_equal, { target: 0 });
	}
}
