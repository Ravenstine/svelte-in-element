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


## License

See [LICENSE.txt](LICENSE.txt).
