Svelte In-Element
=================

Need to render content from a Svelte component within an arbitrary element?  We've got you covered.

This package is inspired by the [in-element](https://github.com/emberjs/ember.js/blob/48112f90e6d5e21ac5da9a1d539148fbd91a16ff/packages/%40ember/-internals/glimmer/lib/syntax/in-element.ts) helper from [Ember.js](https://emberjs.com).


## Installation

```sh
npm install --save svelte-in-element
```


## Usage

```svelte
<script>
  import InElement from 'svelte-in-element';

  const myElement = document.querySelector('#myElement');
</script>

<InElement target={myElement}>
  <h2>Hello World</h2>
</InElement>
```

An optional `insertBefore` parameter allows you to insert the content at a specific position in the target.


## Expected Behavior

- If the `target` is undefined, null, false, 0, "", etc., nothing is rendered and there is no error.
- If `insertBefore` is provided, the block will be rendered before the given element.
- If `target` or `insertBefore` changes, content will be removed from the original position in the DOM and added to the new destination.
- By default, the content of the target element is removed *unless* the value of `insertBefore` is a DOM node or `null`.  When `null` is passed, the last child of the target element is treated as a boundary.

At present, this component will do nothing under server-side rendering.


## Example

The `test/` directory includes a simple e2e test that demonstrates this component in action.  Simply run `npm start` and visit `localhost:1337`.


## License

See [LICENSE.txt](LICENSE.txt).
