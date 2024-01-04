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
              @click="handleItemExpand(item)"
            >
              ﹥
            </i>
            <Checkbox :checked="item.checked" :indeterminate="item.indeterminate" @click="handleItemCheck(item)" />
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Checkbox from "./checkbox.vue";
import config from "./config";
export default {
  components: { Checkbox },
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
      showTreeList: [],
    };
  },
  computed: {
    // 计算当前视窗内实际要渲染的内容
    activeList() {
      const start = this.startNum;
      return this.showTreeList.slice(start, start + this.showNumber);
    },
  },
  watch:{
    treeData:{
      handler(nVal){
        if (!nVal || !nVal.length) return;
        this.treeListData = config.flattening(nVal);
        this.setShowTreeList();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    const boxHeight = this.$refs.scrollBox.offsetHeight;
    this.showNumber = Math.ceil(boxHeight / this.itemHeight);
    this.$refs.scrollBox.addEventListener("scroll", this.scrollEvent);
  },
  methods: {
    // 滚动条事件
    scrollEvent(event) {
      const { scrollTop } = event.target;
      this.startNum = Math.floor(scrollTop / this.itemHeight);
      this.positionTop = scrollTop;
    },
    // 展开事件
    handleItemExpand(item, expand) {
      let isExpand = item.isExpand;
      item.isExpand = expand || !isExpand;
      if (item.children && item.children.length) {
        config.setChildrenExpand(item.children, !isExpand);
      }
      if (item._parentIds) {
        config.setParentExpand(item, this.treeListData);
      }
      this.setShowTreeList();
    },
    // 选中事件
    handleItemCheck(item, check = false) {
      let isChecked = item.checked;
      const indeterminate = item.indeterminate;
      item.checked = indeterminate || check ? true : !isChecked;
      if (item.children && item.children.length) {
        config.setChildrenCheck(item.children, item.checked);
      }
      if (item._parentIds) {
        config.setParentCheck(item, item.checked, this.treeListData);
      }
      this.setShowTreeList();
    },
    // 重新筛选可见的列表
    setShowTreeList() {
      this.showTreeList = this.treeListData.filter((item) => item.visible);
    },
    // 获取勾选的值
    getCheckValue(){
      const checkedArr = []
      const halfCheckedArr = []
      this.treeListData.forEach(item=>{
        if(item.checked) checkedArr.push(item)
        if(item.indeterminate) halfCheckedArr.push(item)
      })
      return { checkedArr, halfCheckedArr }
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
