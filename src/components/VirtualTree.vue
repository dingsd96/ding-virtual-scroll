<template>
  <div class="virtual-tree-com-wrapper">
    <div ref="scrollBox" class="scroll-box">
      <div :style="`height: ${showTreeList.length * itemHeight}px;`"></div>
      <div class="scroll-data" :style="`top: ${positionTop}px;`">
        <div
          class="scroll-item"
          v-for="(item, index) in activeList"
          :key="item.id || index"
          :style="{ height: itemHeight + 'px' }"
        >
          <span :style="`padding-left: ${item.level * 15}px;`">
            <i
              class="arrow"
              :class="{
                'is-show': item.children.length,
                'not-open': !item.isExpand,
              }"
              @click="toggleExpand(item)"
            >
              ﹥
            </i>
            <input
              type="checkbox"
              :checked="item.checked && !item.indeterminate"
              :indeterminate="item.indeterminate"
              @click="handleItemClick(item)"
            />
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "./config";
export default {
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    itemHeight: {
      // 每一条内容的高度
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      config,
      showNumber: 10,
      startNum: 0,
      positionTop: 0,

      treeListData: [],
    };
  },
  computed: {
    showTreeList() {
      return this.treeListData.filter((item) => item.visible);
    },
    // 计算当前视窗内实际要渲染的内容
    activeList() {
      let showList = this.showTreeList;
      const start = this.startNum;
      return showList.slice(start, start + this.showNumber);
    },
  },
  mounted() {
    const boxHeight = this.$refs.scrollBox.offsetHeight;
    this.showNumber = Math.ceil(boxHeight / this.itemHeight);
    this.$refs.scrollBox.addEventListener("scroll", this.scrollEvent);

    if (!this.treeData || !this.treeData.length) return;
    this.treeListData = config.flattening(this.treeData);
  },
  methods: {
    scrollEvent(event) {
      const { scrollTop } = event.target
      this.startNum = parseInt(scrollTop / this.itemHeight)
      this.positionTop = scrollTop
    },
    toggleExpand(item, expand) {
      let isExpand = item.isExpand;
      item.isExpand = expand || !isExpand;
      if (item.children && item.children.length) {
        config.setTreeStatus(item.children, !isExpand);
      }
      if (item._parentIds) {
        this.setParentTreeExpand(item, item.isExpand);
      }
    },
    handleItemClick() {},
    setParentTreeExpand(item, checked) {
      const parentIdArr = item._parentIds.split(',').reverse()
      parentIdArr.forEach(parentId=>{
        const parentItem = this.treeListData.find(i=>i.id === parentId )
        parentItem.isExpand = true
        parentItem.children.forEach(i=>i.visible = true)
      })
    }
  },
  beforeDestroy() {
    if (!this.$refs.scrollBox) return;
    this.$refs.scrollBox.removeEventListener("scroll", this.scrollEvent);
  },
};
</script>
<style>
.virtual-tree-com-wrapper {
  width: 100%;
  height: 100%;
  text-align: left;
}
.virtual-tree-com-wrapper .scroll-box {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  border: 1px solid rgb(0, 0, 0);
}
.scroll-box .scroll-data {
  position: absolute;
  width: 100%;
}

.scroll-box .scroll-item {
  cursor: pointer;
}

.scroll-box .scroll-item:hover {
  background: #e6f7ff;
}

.scroll-item .arrow {
  display: inline-block;
  width: 25px;
  text-align: center;
  opacity: 0;
  cursor: pointer;
  transform: rotate(90deg);
}

.scroll-item .is-show {
  opacity: 1;
}

.scroll-item .not-open {
  transform: rotate(0deg);
}
</style>
