import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', () => {
  const filterTree = ref<any[]>([]);
  const selectedFilterItems = ref<any[]>([]);

  watch(filterTree, () => {
    calcSelectedFilterItems();
  }, {deep: true})

  function setFilterTree(data: any[]) {
    filterTree.value = data;
  }

  function calcSelectedFilterItems() {
    let res: any[] = [];
    for (let i = 0; i < filterTree.value.length; i++) {
      const item = filterTree.value[i];
      const activeItems = item.children.filter((child: any) => {
        return child.active;
      });

      res = res.concat(activeItems);
    }
    selectedFilterItems.value = res;
    // console.log('ddd', selectedFilterItems.value);
  }

  return { filterTree, setFilterTree, selectedFilterItems }
})
