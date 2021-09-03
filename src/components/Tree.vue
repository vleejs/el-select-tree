<template>
  <div class="tree-box">
    <el-select
      ref="el-select"
      v-model="elSelectArr"
      :multiple="multiple"
      :placeholder="placeholder"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      :multiple-limit="multipleLimit"
      popper-class="vast-select"
      @change="handleSelectChange"
      @remove-tag="removeTag"
      @clear="handleSelectClear"
    >
      <el-option :label="elOption.label" :value="elOption.val">
        <el-tree
          ref="tree"
          :data="treeData"
          :node-key="treeNodeKey"
          :props="treeProps"
          :empty-text="treeEmptyText"
          :show-checkbox="multiple"
          :highlight-current="true"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        >
        </el-tree>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { recursion } from '../utils/index.js'
export default {
  name: 'Tree',
  props: {
    multiple: {
      // 默认多选
      type: Boolean,
      default: true,
    },
    multipleLimit: {
      type: Number,
      default: 0,
    },
    placeholder: {
      // 默认请选择
      type: String,
      default: '请选择',
    },
    clearable: {
      // 默认可以清除
      type: Boolean,
      default: true,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    /** tree --------------- */
    treeData: {
      //
      type: Array,
    },
    treeEmptyText: {
      type: String,
      default: 'tree empt',
    },
    treeNodeKey: {
      type: String,
      default: 'id',
    },
    treeProps: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children',
        disabled: 'disabled',
      }),
    },
    /** tree --------------- */
  },
  data() {
    return {
      elSelectArr: [],
      elOption: {
        val: '', // 选项的值 string/number/object
        label: '', //
        disabled: false,
      },
      checkedNodes: [], // 选中的节点
      treeCheckedList: [],
    }
  },
  methods: {
    // 选中值发生变化
    handleSelectChange(val) {
      console.log('选中值发生变化', val)
    },
    // 移除tag触发
    removeTag(val) {
      console.log('移除tag触发', val)
      recursion()
    },
    handleSelectClear(val) {
      console.log('清除', val)
      // 设置当前节点未选中
      this.$refs['tree'].setChecked(val, false)
    },
    // 节点被点击时的回调
    handleNodeClick() {},
    handleCheckChange() {
      // console.log(data)
      // console.log(checked)
      // console.log(indeterminate)
      this.checkedNodes = this.$refs['tree'].getCheckedNodes(true, false)
      this.elSelectArr.length = 0
      this.checkedNodes &&
        this.checkedNodes.length &&
        this.checkedNodes.forEach((node) => {
          this.elSelectArr.push(node.label)
        })
    },
  },
}
</script>

<style lang="scss">
.el-select-dropdown.is-multiple .el-select-dropdown__item {
  height: auto;
  padding: 0;
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.hover,
.el-select-dropdown.is-multiple .el-select-dropdown__item:hover {
  background-color: inherit;
  padding: 0;
}
.el-select__tags {
  max-width: auto !important;
}
</style>
