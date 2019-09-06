/** */
  export default class DragDrop {
  /** Обработка перетаскивания элементов
    * @param {DOMElement} element узел
    * @param {boolean} draggable пометить элемент как draggable / dropzone
    */
    constructor(element, draggable = false) {
      this.element  = element;
      this.callback = {};

      if (draggable) {
        this.element.draggable = true;
        this.element.dropzone  = true;
      }

      DragDrop.event(this, 'dragstart', dragstart);
      DragDrop.event(this, 'dragenter', dragenter);
      DragDrop.event(this, 'dragover',  dragover);
      DragDrop.event(this, 'dragleave', dragleave);
      DragDrop.event(this, 'drop',      drop);
      DragDrop.event(this, 'dragend',   dragend);
    }

  /** */
    start(callback) {
      return this.action('dragstart', callback);
    }

  /** */
    enter(callback) {
      return this.action('dragenter', callback);
    }

  /** */
    over(callback) {
      return this.action('dragover', callback);
    }

  /** */
    leave(callback) {
      return this.action('dragleave', callback);
    }

  /** */
    drop(callback) {
      return this.action('drop', callback);
    }

  /** */
    end(callback) {
      return this.action('dragend', callback);
    }

  /** */
    action(name, callback) {
      this.callback[name] = callback;
      return this;
    }

  /** */
    static event(item, event, listener) {
      item.element.addEventListener(event, handler, false);

      /** */
      function handler(e) {
        const result = listener.call(item.element, e, item);
        const handler = item.callback[event];
        if (handler) handler.call(item, e, result);
      }
    }
  }

// #region [Private]
  /** */
    function dragstart(e) {
      const selector = getDomPath(this); // this === item.element
      e.dataTransfer.setData('selector', selector);
      e.dataTransfer.effectAllowed = 'move';
    }

  /** */
    function dragenter(e) {}

  /** */
    function dragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
      return false;
    }

  /** */
    function dragleave(e) {}

  /** */
    function drop(e) {
      e.stopPropagation(); // stops the browser from redirecting.
      e.preventDefault();
      const selector = e.dataTransfer.getData('selector');
      return selector
        ? deep$(selector)
        : null;
    }

  /** */
    function dragend() {}


  /** */
  function deep$(element, root = document) {
    if (typeof element === 'object') return element;
    const selectors = element.split('::shadow').map((e, i) => i > 0 ? e.slice(e.search(/[a-z.#[]/i)) : e);
    const last = selectors.length - 1;
    return selectors.reduce((node, selector, index) => {
      const temp = node.querySelector(selector);
      return index !== last
        ? temp.shadowRoot
        : temp;
    }, root);
  }

/** */
  function getDomPath(el) {
    if (!el) return;

    var stack = [];
    var isShadow = false;
    while (el.parentNode !== null) {
      // console.log(el.nodeName);
      var sibCount = 0;
      var sibIndex = 0;
      // get sibling indexes
      for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
        var sib = el.parentNode.childNodes[i];
        if ( sib.nodeName == el.nodeName ) {
          if ( sib === el ) {
            sibIndex = sibCount;
          }
          sibCount++;
        }
      }
      // if ( el.hasAttribute('id') && el.id != '' ) { no id shortcuts, ids are not unique in shadowDom
      //   stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
      // } else
      var nodeName = el.nodeName.toLowerCase();
      if (isShadow) {
        nodeName += "::shadow";
        isShadow = false;
      }
      if ( sibCount > 1 ) {
        stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
      } else {
        stack.unshift(nodeName);
      }
      el = el.parentNode;
      if (el.nodeType === 11) { // for shadow dom, we
        isShadow = true;
        el = el.host;
      }
    }
    stack.splice(0,1); // removes the html element
    return stack.join(' > ');
  }
// #endregion
