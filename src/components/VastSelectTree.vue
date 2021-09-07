<template>
  <div class="el-tree-select" :class="selectClass">
    <el-select
      :id="treeId"
      ref="el-select"
      v-model="labels"
      class="el-tree-select-input"
      v-popover:popover
      v-bind="selectParams"
      :disabled="disabled"
      :multiple="selectParams.multiple"
      :placeholder="selectParams.placeholder"
      :filterable="false"
      :clearable="selectParams.clearable"
      :collapse-tags="selectParams.collapseTags"
      :multiple-limit="selectParams.multipleLimit"
      :popper-append-to-body="false"
      popper-class="vast-select-popper"
      :styles="styles"
      :title="labels"
      @remove-tag="handleselectRemoveTag"
      @clear="handleSelectClear"
      @focus="handleSelectFocus"
    >
      <el-popover
        ref="popover"
        :placement="placement"
        :transition="transition"
        :popper-class="popperClass"
        :width="width"
        v-model="visible"
        trigger="click"
      >
        <el-scrollbar
          tag="div"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          class="is-empty"
        >
          <el-tree
            ref="tree"
            :data="data"
            :node-key="propsValue"
            :empty-text="treeParams.treeEmptyText"
            :draggable="false"
            :highlight-current="false"
            :current-node-key="ids.length > 0 ? ids[0] : ''"
            :show-checkbox="selectParams.multiple"
            :default-expand-all="true"
            @node-click="handleNodeClick"
            @check="handleTreeCheck"
          ></el-tree>
        </el-scrollbar>
      </el-popover>
    </el-select>
  </div>
</template>

<script>
import { guid, on, off, each } from '../utils'
export default {
  name: 'VastSelectTree',
  props: {
    /** el-select------------------------start */
    value: {
      type: [String, Array, Number],
      // `''`
      default() {
        return ''
      },
    },
    selectClass: {
      type: String,
      default() {
        return ''
      },
    },
    // el-select的样式
    styles: {
      type: Object,
      default() {
        return {}
      },
    },
    // el-select 是否禁用 默认不禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    selectParams: {
      type: Object,
      default() {
        return {
          clearable: true, //  是否可以清空选项
          disabled: false, // 是否禁用
          placeholder: '请选择', // place
          collapseTags: false,
          multipleLimit: 0,
          multiple: true,
        }
      },
    },
    /** el-select---------------------------end */

    /** popover ------------------------start*/
    // 弹出框位置
    placement: {
      type: String,
      //  bottom
      default() {
        return 'bottom'
      },
    },
    // 弹出框过渡动画
    transition: {
      type: String,
      //  el-zoom-in-top
      default() {
        return 'el-zoom-in-top'
      },
    },
    // 弹出框自定义类名
    popoverClass: {
      type: String,
      default() {
        return ''
      },
    },
    /** popover ------------------------end*/
    /** tree ------------------------start*/

    treeParams: {
      type: Object,
      default() {
        return {
          clickParent: false,
          filterable: false,
          leafOnly: false,
          includeHalfChecked: false,
          data: [],
          props: {
            children: 'children',
            label: 'label',
            code: 'code',
            value: 'id',
            disabled: 'disabled',
          },
          treeEmptyText: '空',
          treeNodeKey: 'id',
        }
      },
    },
  },
  data() {
    return {
      labels: '', // 单选：绑定值 | 多选：此时v-model的值为当前选中值所组成的数组。默认情况下选中值会以 Tag 的形式展现
      width: 150, // 最小宽度 150px
      visible: false,
      data: [], // tree 数据
      propsValue: 'id',
      propsLabel: 'label',
      ids: [], // 当前选中的节点
      propsDisabled: 'disabled',
      propsChildren: 'children',
      leafOnly: false,
      includeHalfChecked: false,
      valueArr: [], //
      checkedNodes: [], // 选中的节点
      optionVal: [],
      newValueArr: [],
      list: [],
    }
  },

  computed: {
    // 选择树的id
    treeId() {
      return `el-tree-select-${guid()}`
    },
    // 弹出框的类名
    popperClass() {
      let _c = 'el-tree-select-popper ' + this.popoverClass
      return this.disabled ? _c + ' disabled ' : _c
    },
    isAll() {
      return this.checkedNodes.length === this.list.length
    },
  },
  watch: {
    // ids 变化的时候 选中相应节点
    ids: function (val) {
      if (val !== undefined) {
        this.$nextTick(() => {
          this.setSelectNodeFun(val)
        })
      }
    },
  },
  created() {
    const { props, data, leafOnly, includeHalfChecked } = this.treeParams
    // 设备单选还是多选 通过传的 value
    this.setMultipleFun()
    this.propsValue = props.value // tree node-key 的值
    this.propsLabel = props.label //
    this.propsCode = props.code || null // 可能为空
    this.propsDisabled = props.disabled
    this.propsChildren = props.children
    // tree
    this.data = data.length > 0 ? [...data] : []
    this.leafOnly = leafOnly
    this.includeHalfChecked = includeHalfChecked
    // 设置 labels
    if (this.selectParams.multiple) {
      this.labels = []
      this.ids = this.value
    } else {
      this.labels = ''
      this.ids = this.value instanceof Array ? this.value : [this.value]
    }

    // console.log('this.ids', this.ids)
  },
  mounted() {
    this.updateW()
    this.$nextTick(() => {
      on(document, 'mouseup', this.popoverHideFun)
    })
  },
  beforeDestroy() {
    off(document, 'mouseup', this.popoverHideFun)
  },
  methods: {
    setSelectNodeFun(ids) {
      // console.log('设置选中节点', ids)
      const el = this.$refs.tree
      if (!el) {
        console.error('Not found tree dom')
      }
      const { multiple } = this.selectParams
      if (ids.length === 0 || this.data.length === 0) {
        this.labels = multiple ? [] : ''
        if (multiple) {
          // 多选情况下
          el.setCheckedKeys([])
        } else {
          el.setCurrentKey(null)
        }
        return
      }
      if (multiple) {
        // element-ui bug. 如果是父子节点全选 el.setCheckedKeys([非全量id]);之后el.getCheckedNodes()还是全量
        // const checkedList = el.getCheckedNodes(this.leafOnly, this.includeHalfChecked)
        const nodes = el.getCheckedNodes(this.leafOnly, this.includeHalfChecked)
        // console.log('checkedList',checkedList)
        nodes.forEach((item) => {
          el.setChecked(item, false)
        })
        ids.forEach((id) => {
          el.setChecked(id, true)
        })
        if (this.propsCode) {
          // 如果有code   labels=code(name)
          this.labels =
            nodes.map((item) =>
              item[this.propsCode] ? item[this.propsLabel] + '(' + item[this.propsCode] + ')' : item[this.propsLabel]
            ) || []
        } else {
          this.labels = nodes.map((item) => item[this.propsLabel]) || []
        }
      } else {
        // el.setCurrentKey(ids[0])
        // const node = el.getCurrentNode()
        // if (node) {
        //   if (this.propsCode) {
        //     // 如果有code   labels=code(name)
        //     this.labels = node[this.propsCode]
        //       ? node[this.propsLabel] + '(' + node[this.propsCode] + ')'
        //       : node[this.propsLabel]
        //   } else {
        //     this.labels = node[this.propsLabel]
        //   }
        // } else {
        //   this.labels = ''
        // }
      }
    },
    emitFun() {
      const { multiple } = this.selectParams
      this.$emit('input', multiple ? this.ids : this.ids.length > 0 ? this.ids[0] : '')
      this.updatePopoverLocationFun()
    },
    updatePopoverLocationFun() {
      // dom高度还没有更新，做一个延迟
      setTimeout(() => {
        this.$refs.popover.updatePopper()
      }, 50)
    },
    // 判断单选还是多选
    setMultipleFun() {
      let multiple = false
      if (this.value instanceof Array) {
        multiple = true
      }
      this.$set(this.selectParams, 'multiple', multiple)
    },
    updateW() {
      this.$nextTick(() => {
        // console.log('width', this.$refs['el-select'].$el.getBoundingClientRect().width)
        this.width = this.$refs['el-select'].$el.getBoundingClientRect().width
      })
    },
    // 获取MouseEvent.path 针对浏览器兼容性兼容ie11,edge,chrome,firefox,safari
    getEventPath(evt) {
      const path = (evt.composedPath && evt.composedPath()) || evt.path
      const target = evt.target
      if (path != null) {
        return path.indexOf(window) < 0 ? path.concat(window) : path
      }
      if (target === window) {
        return [window]
      }
      function getParents(node, memo) {
        memo = memo || []
        const parentNode = node.parentNode
        if (!parentNode) {
          return memo
        } else {
          return getParents(parentNode, memo.concat(parentNode))
        }
      }
      return [target].concat(getParents(target), window)
    },
    popoverHideFun(e) {
      const path = this.getEventPath(e)
      let isInside = path.some((list) => {
        // 鼠标在弹出框内部，阻止隐藏弹出框
        return list.className && typeof list.className === 'string' && list.className.indexOf('el-tree-select') !== -1
      })
      // console.log('弹出框是否隐藏', isInside)
      if (!isInside) {
        this.visible = false
      }
    },
    tree2List(arr) {
      let res = []
      function formatTree(tree) {
        const tLen = tree.length
        for (let i = 0; i < tLen; i++) {
          res.push(tree[i])
          if (tree[i].children && tree[i].children.length > 0) {
            formatTree(tree[i]['children'])
          }
        }
      }
      formatTree(arr)
      return res
    },
    // 选中值发生变化
    handleSelectChange(val) {
      console.log('select-change', val)
      this.newValueArr.length = 0
      for (let i = 0; i < this.checkedNodes.length; i++) {
        for (let j = 0; j < val.length; j++) {
          if (this.checkedNodes[i].label === val[j]) {
            this.newValueArr.push(this.checkedNodes[i])
          }
        }
      }
      this.$refs.tree.setCheckedNodes(this.newValueArr)
    },
    handleselectRemoveTag(tag) {
      console.log('handleselectRemoveTag', tag)
      const { data, propsValue, propsLabel, propsChildren } = this
      each(
        data,
        (item) => {
          if (item[propsLabel] === tag) {
            const value = item[propsValue]
            this.ids = this.ids.filter((id) => id !== value)
          }
        },
        propsChildren
      )
      this.$refs.tree.setCheckedKeys(this.ids)
      this.$emit('removeTag', this.ids, tag)
      this.emitFun()
      this.updatePopoverLocationFun()
    },
    handleSelectClear() {
      this.ids = []
      const { multiple } = this.selectParams
      // 下拉框清空，对外抛出``this.$emit('input', multiple ? [] : '');`
      this.$emit('input', multiple ? [] : '')
      // 下拉框清空，对外抛出``this.$emit('select-clear');`
      this.$emit('select-clear')
      this.updatePopoverLocationFun()
    },
    handleSelectFocus() {
      this.updateW()
    },
    // 节点被点击时的回调
    handleNodeClick() {
      console.log('节点被点击')
    },
    /**
     * @description
     * @param {node} checkedNodes: Array(5), checkedKeys: Array(5), halfCheckedNodes: Array(0), halfCheckedKeys: Array(0)
     */
    handleTreeCheck(data, node) {
      // console.log(data)
      // console.log(node)
      this.ids = []
      const { propsValue } = this
      node.checkedNodes.forEach((item) => {
        this.ids.push(item[propsValue])
      })
      this.$emit('check', data, node)
      this.emitFun()
    },
    handleCheckChange() {
      this.checkedNodes.length = 0
      this.checkedNodes = this.$refs['tree'].getCheckedNodes(false, false)
      // console.log('选中的节点', this.checkedNodes)
      this.valueArr.length = 0
      let arr = []
      const checkedLen = this.checkedNodes.length
      for (let i = 0; i < checkedLen; i++) {
        const item = this.checkedNodes[i] // 当前项
        let flag = false
        if (item.children) {
          arr = arr.concat(this.tree2List(item.children))
        }
        console.log('arr', arr)
        arr.map((it) => {
          if (item.id === it.id) {
            flag = true
          }
        })
        if (!flag) {
          this.valueArr.push(item.label)
        }
      }
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

::v-deep .el-popover {
  padding: 0;
}
.el-tree-select .select-option {
  display: none !important;
}
.vast-select-popper {
  display: none !important;
}

.el-tree-select-popper {
  max-height: 400px;
  overflow: auto;
  padding: 0px !important;
}
.el-tree-select-popper.disabled {
  display: none !important;
}
.el-tree-select-popper .el-button--small {
  width: 25px !important;
  min-width: 25px !important;
}

.el-tree-select-popper[x-placement^='bottom'] {
  margin-top: 5px;
}
[aria-disabled='true'] > .el-tree-node__content {
  color: inherit !important;
  background: transparent !important;
  cursor: no-drop !important;
}
</style>
