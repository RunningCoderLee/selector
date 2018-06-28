import $ from 'jquery';
import { TypeOf, isSelectTag } from './utils';

import './style.scss';

function createContainer() {
  return $(`<div class="selector-container"></div>`);
}

function createTrigger(className) {
  const $trigger = $(`
    <button type="button" class="selector-trigger">
      <span class="selector-trigger-title">Nothing selected</span>
      <span class="selector-trigger-arrow"></span>
    </button>
  `);
  $trigger.addClass(className);
  
  return $trigger;
}

function createListWrapper() {
  return $(`
    <div class="selector-list-wrapper">
      <ul class="selector-list">
      </ul>
    </div>
  `);
}

function createListItem(data, keywords) {
  let title;

  if (keywords) {
    const start = data.title.indexOf(keywords);
    title = `<font class="highlight">${data.title.substring(0, keywords.length)}</font>${data.title.substring(keywords.length)}`
  } else {
    title = data.title;
  }
  
  return $(`
    <li class="selector-list-item ${data.disabled ? 'disabled': undefined}" data-value=${data.value}>
      ${title}
    </li>
  `);
}

function createSearchBox() {
  return $('<div class="selector-search-box"><input type="text"></div>');
}

function createOption(data) {
  const $option = $(`<option value=${data.value}>${data.title}</option>`);
  $option.prop('disabled', data.disabled);

  return $option;
}

const Selector = (($) => {
  class Selector {
    constructor(element, options) {
      // 私有变量
      var _data = [];
      var _originalData = [];
      var _value = undefined;

      /**
       * 设置当前所用的数据源
       *
       * @param {Array} data 数据源
       * @memberof Selector
       */
      this.setData = function setData(data) {
        _data = data;
        this.$listContent = this.createListContent(data, this.$searchInput.val().trim());

        const $options = data.map((item) => createOption(item));

        this.$view.find('ul').html(this.$listContent);

        // 更新源 select 元素下的所有 options
        if (isSelectTag(this.$target[0])) {
          this.$target.html($options);
        }
      }
      /**
       * 获取当前所用数据源
       *
       * @return {Array} 当前所用数据源
       * @memberof Selector
       */
      this.getData = function getData() {
        return _data;
      }
      /**
       * 设置原始数据源，主要用于删除搜索关键字后还原列表内容
       *
       * @param {Array} data 数据源
       * @memberof Selector
       */
      this.setOriginalData = function setOriginalData(data) {
        this.setData(data);
        _originalData = data;
      }
       /**
       * 获取原始数据源
       *
       * @return {Array} 原始数据源
       * @memberof Selector
       */
      this.getOriginalData = function getOriginalData() {
        return _originalData;
      }
      /**
       * 设置当前选中的值
       *
       * @param {String | Number} val 当前选中值
       * @memberof Selector
       */
      this.setValue = function setValue(val) {
        let title;

        _value = val;

        const selectItem = this.getData().find((item) => {
          return item.value === val
        });

        if (selectItem && selectItem.title) {
          title = selectItem.title
        } else {
          title = 'Nothing selected'
        }

        this.$trigger.find('.selector-trigger-title').text(title);

        // 更新源节点的值
        this.$target.val(val);
        
      }
      /**
       * 获取当前选中的值
       *
       * @return {String | Number} 当前选中值
       * @memberof Selector
       */
      this.getValue = function getValue() {
        return _value;
      }
      
      const baseOption = {
        data: [],
        initialValue: undefined,
        width: 100,
        height: 'auto',
      };

      this.options = $.extend({}, baseOption, options);
      this.$target = $(element);
    }

    /**
     * 挂载插件
     *
     * @static
     * @param {Object} config 设置
     * @returns {Selector} 实例化后的selector
     * @memberof Selector
     */
    static jQueryInterface(config) {
      const _config = TypeOf(config) === 'object' ? config : {};
      const self = this.map(function() {
        const selector = new Selector(this, _config);

        selector.init();

        return selector;
      });

      return self;
    }
    
    /**
     * 初始化插件
     *
     * @memberof Selector
     */
    init() {      
      this.$view = this.createView();

      const data = this.formatData();
      this.setOriginalData(data);
      // this.setData(data);

      this.bindEvents();

      if (isSelectTag(this.$target[0])) {
        const firstOption = this.$target.children('option')[0];
        firstOption && this.setValue(firstOption.value);
      } else {
        this.setValue(this.$target.val());
      }

      // 改变 dom 结构
      this.$target.after(this.$view).appendTo(this.$view);

      this.$target.hide();
    }


    /**
     * 创建列表内容
     *
     * @param {Array} data 数据源
     * @param {String} keywords 搜索关键字 
     * @returns {jQuery} 列表项集合
     * @memberof Selector
     */
    createListContent(data, keywords) {
      return data.map(function(item) { return createListItem(item, keywords)});
    }


    /**
     * 获取原始数据源，用于清除关键字后还原所有列表项
     *
     * @returns {Array} 原始数据源
     * @memberof Selector
     */
    formatData() {
      const { data } = this.options;
      
      // 判断 data 赋值是否有效
      if (Array.isArray(data) && data.length > 0) {
        return data;
      } 
      
      if (isSelectTag(this.$target[0])) { // 源节点是否为 select
        const options = this.$target.children('option');
        const result = [];

        options.each(function() {
          const obj = {
            title: $(this).text(),
            value: $(this).attr('value'),
            disabled: $(this).prop('disabled'),
          }

          result.push(obj);
        })
        
        return result;
      } 

      return [];
    }


    /**
     * 创建组件dom
     *
     * @returns {jQuery} 组件DOM
     * @memberof Selector
     */
    createView() {
      const $container = createContainer();
      $container.css({
        width: this.options.width,
      });

      const $listWrapper = createListWrapper();

      const $hr = $('<hr />');

      
      const $searchBox = createSearchBox();
      this.$searchInput = $searchBox.find('input');
      this.$trigger = createTrigger(this.$target.attr('class'));
      
      $listWrapper.find('ul').css({
        height: this.options.height
      })

      $listWrapper.find('ul').before($searchBox, $hr);
      $listWrapper.find('ul').append(this.$listContent);

      $container.append(this.$trigger, $listWrapper)

      return $container;
    }
    
    /**
     * 绑定事件
     *
     * @memberof Selector
     */
    bindEvents() {
      const self = this;

      // 收缩/展开 按钮
      this.$trigger.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        self.$view.toggleClass('open');

        if (self.$view.hasClass('open')) {
          self.$searchInput.focus();
        } else {
          self.$searchInput.val('');
          self.data = self.originalData;
        }
      });

      // 空白处点击收缩列表
      $('body').on('click', function(e) {
        if (self.$view.hasClass('open')) {
          self.$view.removeClass('open');
          self.$searchInput.val('');
          self.setData(self.getOriginalData());
        }
      })

      // 选择项点击
      this.$view.on('click', 'li', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('disabled')) {
          return;
        }

        self.setValue($(this).data('value'));
        self.$view.toggleClass('open');
      })

      // 输入搜索关键字
      this.$searchInput.on('keyup', function(e) {
        const value = $(this).val().trim();

        if (!value) {
          self.setData(self.getOriginalData());
          return;
        }

        const newData = self.getOriginalData().filter((item) => {
          return item.title.startsWith(value);
        });

        self.setData(newData);
      })

      this.$searchInput.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
    }
   
  }

  $.fn.selector = Selector.jQueryInterface
  return Selector;
})($);

export default Selector;
