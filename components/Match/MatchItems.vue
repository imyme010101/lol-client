<template>
  <div
    :class="{'grid-cols-6': oneRow, 'grid-cols-3': !oneRow}"
    class="grid items-center gap-1"
  >
    <div v-for="(item, index) in items" :key="index">
      <Tooltip>
        <template #trigger>
          <div class="relative">
            <div
              :class="[
                isMainitem(item) ? 'border-c-1' : 'border-c-0',
                { 'cursor-pointer': item !== null },
                { 'w-8 h-8': oneRow, 'w-6 h-6': !oneRow }
              ]"
              class="relative z-10 bg-c-0 border-4 rounded-md"
            >
              <div
                v-if="isMainitem(item)"
                class="absolute w-full h-full rounded-md"
              ></div>
              
              <nuxt-img v-if="itemLink(item) !== null" :src="`${itemLink(item)}`" format="webp" width="32" height="32" class="rounded-md" />
            </div>
          </div>
        </template>
        <template v-if="item !== null" #default>
          <div class="flex p-2 text-xs text-left text-white select-none">
            <div
              :class="[
                isMainitem(item) ? 'border-c-1' : 'border-c-0'
              ]"
              class="flex-shrink-0 w-12 h-12 ml-1 border-4 rounded-md bg-c-0"
            >
              <nuxt-img :src="`${itemLink(item)}`" format="webp" width="32" height="32" class="w-full h-full rounded-md" />
            </div>
            <div class="ml-2 leading-none">
              <div class="text-base">{{ itemName(item.name) }}</div>
              <div class="mt-1">
                <span class="text-teal-200">Price:</span>
                <span class="ml-1 text-sm font-semibold text-yellow-500">{{
                  item.price
                }}</span>
              </div>
              <div
                v-html="`${item.description.replaceAll('\n','').replaceAll('li>', 'p>').replaceAll('<li', '<p').replaceAll('<br></mainText><br>', '</p></mainText>')}`"
                class="mt-1 font-light text-teal-200 item-description"
              ></div>
            </div>
          </div>
        </template>
      </Tooltip>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip
  },

  props: {
    oneRow: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    }
  },

  methods: {
    isMainitem(item) {
      return item && item.image.includes('t4')
    },
    itemLink(item) {
      if (!item) {
        return null
      }

      // Fix to still make work the old items links (before season 11)
      const originalUrl = item.image
      const newUrl = originalUrl.includes('/global/default/assets/items/') ? originalUrl : originalUrl.replace('latest', '10.22')
      return `${newUrl}`
    },
    itemName(name) {
      // Remove placeholders in item names (e.g.: for Ornn items)
      return name.replace(/%[^%]*%/, '')
    }
  }
}
</script>

<style scoped>
.item-description:deep(stats) {
  @apply text-white leading-tight;
}

.item-description:deep(br + br) {
  @apply hidden;
}

.item-description:deep(stats br) {
  @apply block;
}

.item-description:deep(li) {
  @apply block mt-2;
}

.item-description:deep(passive) {
  @apply text-white font-normal;
}

.item-description:deep(active) {
  @apply inline-block text-white font-bold mt-2;
}

.item-description:deep(unique),
.item-description:deep(li > passive:first-child),
.item-description:deep(raritymainitem) {
  @apply text-white font-bold block mt-2;
}

.item-description:deep(font) {
  @apply text-teal-400;
}

.item-description:deep(rules) {
  @apply inline-block mt-2 text-teal-400 italic;
}

.item-description:deep(rules active) {
  @apply inline text-white font-normal;
}
</style>
