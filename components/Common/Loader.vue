<template>
  <div class="w-full flex justify-center items-center py-5">
    <i class="m-spinner--signal"></i>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#ff9600'
    }
  },
  data() {
    return {
      currentColor: this.color
    }
  },
  computed: {
    cssVars () {
      return{
        /* variables you want to pass to css */
        '--color': this.currentColor,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-spinner--signal {
  --spinner-color: var(--color);
  --spinner-color-secondary: var(--color-secondary , currentColor);
  --spinner-duration: 1.25s;
  --spinner-size: 64px;
  --spinner-stroke-width: 0.075;

  display: inline-flex;
  color: var(--spinner-color);
  font-size: var(--spinner-size);
  width: 1em;
  height: 1em;
  max-width: 1em;
  max-height: 1em;
  position: relative;

  &::before {
    @extend %pseudo-signal;
    border: calc(var(--spinner-size) * var(--spinner-stroke-width)) solid currentColor;
  }

  &::after {
    @extend %pseudo-signal;
    border: calc(var(--spinner-size) * var(--spinner-stroke-width)) solid currentColor;
    animation-delay: calc((var(--spinner-duration) / -2));
  }
}

%pseudo-signal {
  content: '';
  border-radius: 50%;
  height: 100%;
  width: 100%;
  position: absolute;
  animation-name: m-spinner-signal;
  animation-iteration-count: infinite;
  animation-duration: var(--spinner-duration);
  animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
}

@keyframes m-spinner-signal {
  from {
    opacity: 1;
    transform: scale(0);
  }

  to {
    opacity: 0;
    transform: scale(100%);
    border-color: var(--spinner-color-secondary);
  }
}
</style>