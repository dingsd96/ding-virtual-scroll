<template>
  <div id="app">
    <div style="width: 400px; height: 300px; margin: 0 auto;">
      <VirtualTree
        :treeData="treeData"
        :load-data="loadData"
      />
    </div>
  </div>
</template>

<script>
import VirtualTree from './components/VirtualTree.vue'

export default {
  name: 'App',
  components: {
    VirtualTree
  },
  data() {
    return {
      treeData: [],
    }
  },
  created() {
    this.treeData = this.getTreeData()
  },
  methods: {
    getTreeData() {
      function getList(length, parentId = '', deep) {
        return Array.from({length}).map((i, index) => {
          const id = parentId ? parentId + '-' + index : '' + index
          let children = []
          if (deep > 1) {
            children = getList(length, id, deep - 1)
          }
          return {
            id: id,
            name: '节点:' + id,
            parentId: parentId,
            children
          }
        })
      }

      // return getList(12, '', 5)
      return getList(12, '', 2)
    },
    async loadData(item){
      return new Promise(resolve => {
        if(item.id === '0-0-0-0'){
          resolve()
        }
        setTimeout(() => {
          const children = [
            { name: `${item.name}-0`, id: `${item.id}-0` },
            { name: `${item.name}-1`, id: `${item.id}-1` },
          ];
          resolve(children);
        }, 300);
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
