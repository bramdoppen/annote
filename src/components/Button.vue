<template>
	<button :class="classList" :type="buttonType" class="button">
    <slot></slot>
  </button>
</template>

<script>
	export default {
		props: {
      buttonType: {
        type: String,
        default: "button",
      },
      classList: {
        type: Array,
      }
    }
	};
</script>

<style scoped>
	.button {
    --border: rgb(0 0 0 / 8%);
    background: var(--c-one);
    color: var(--c-five);
    font-weight: 600;
    font-family: inherit;
    font-size: 20px;
    padding: 15px 20px;
    border-radius: 10px;
    border: 2px solid var(--border);
    outline: 0;
    transition: filter 0.1s ease, border 0.2s ease;
    appearance: none;
    cursor: pointer;
  }

  .button.nobutton {
    background: transparent;
    border: 0;
    text-decoration: underline;
    padding: 0;
  }

  .button.nobutton:hover {
    filter: brightness(1.5);
  }

  .button.small {
    padding: 6px 12px;
    font-size: 16px;
  }

  .button:hover {
    filter: brightness(1.05);
  }

  .button:focus {
    --border: rgb(0 0 0 / 20%);
  }

</style>
