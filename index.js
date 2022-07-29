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
	insert,
	detach_dev,
	detach_between_dev,
	children,
	append,
	create_ssr_component,
	is_client
} from "svelte/internal";

function createBound() {
	return document.createComment('');
}

function getParams(ctx) {
	let [target, insertBefore] = Array.isArray(ctx) ? ctx : ctx[2].ctx;

	if (typeof target === 'string') target = document.querySelector(target);

	if (typeof insertBefore === 'string') insertBefore = document.querySelector(insertBefore);

	if (!target && insertBefore) target = insertBefore.parentElement;

	return { target, insertBefore };
}

function createSlot(template, ctx, scope) {
	const { target, insertBefore } = getParams(ctx);
	const slot = create_slot(template, ctx, scope, null);
	const startBound = createBound();
	const endBound = createBound();

	return {
		...slot,
		m: function mountSlot() {
			if (!target) return;

			if (target && !insertBefore && insertBefore !== null) {
				const nodes = children(target);

				for (const node of nodes)
					detach_dev(node);
			}

			if (insertBefore) {
				insert(target, startBound, insertBefore);
				insert(target, endBound, insertBefore);
			} else {
				append(target, startBound);
				append(target, endBound);
			}

			if (is_client) this.c();

			return slot.m(target, endBound);
		},
		d: function detachSlot(detaching) {
			if (!detaching || !target) return;

			detach_between_dev(startBound, endBound);
			detach_dev(startBound);
			detach_dev(endBound);
		},
	};
}

function createFragment(ctx) {
	const default_slot_template = /*#slots*/ ctx[3].default;

	let current;

	let default_slot = createSlot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	return {
		c: function createFragment() {
			if (default_slot) default_slot.c();
		},
		m: function mountFragment(target, anchor) {
			if (default_slot)
				default_slot.m(target, anchor);

			current = true;
		},
		l() {},
		p: function updateFragment(ctx, [dirty]) {
			if (!default_slot) return;

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

				default_slot = createSlot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

				default_slot.c();

				const { target, insertBefore } = getParams(ctx);

				default_slot.m(target, insertBefore);
			}
		},
		i: function transitionInFragment(local) {
			if (current) return;

			transition_in(default_slot, local);

			current = true;
		},
		o: function transitionOutFragment(local) {
			transition_out(default_slot, local);

			current = false;
		},
		d: function detachFragment(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { target, insertBefore } = $$props;

	$$self.$$set = $$props => {
		if ('target' in $$props) $$invalidate(0, target = $$props.target);
		if ('insertBefore' in $$props) $$invalidate(1, insertBefore = $$props.insertBefore);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [target, insertBefore, $$scope, slots];
}

const { render, $$render } = create_ssr_component(() => '');

export default class InElement extends SvelteComponent {
	static render = render;
	static $$render = $$render;

	constructor(options) {
		super();

		const opts = { ...options, hydrate: false };

		init(this, opts, instance, createFragment, safe_not_equal, { target: 0, insertBefore: 1 });
	}
}
