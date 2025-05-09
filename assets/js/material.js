// Vanilla JS Tooltip Plugin
if(!isMobileTooltip){!function(){function t(t,i){Object.assign(t.style,i)}function i(t,i,e,o){let s=t.getBoundingClientRect(),l=i.getBoundingClientRect(),h=e.getBoundingClientRect();return function t(i,e,o,s){let l=window.innerWidth,h=window.innerHeight,n=0,r=0,a="0px",p="0px",d={};switch(s){case"top":r=i.top-e.height,n=i.left+i.width/2-e.width/2,p="-10px",d={bottom:"0",left:"0",borderRadius:"14px 14px 0 0",transformOrigin:"50% 100%",marginTop:`${e.height}px`,marginLeft:`${e.width/2-o.width/2}px`};break;case"left":r=i.top+i.height/2-e.height/2,n=i.left-e.width,a="-10px",d={top:"-7px",right:"0",width:"14px",height:"14px",borderRadius:"14px 0 0 14px",transformOrigin:"95% 50%",marginTop:`${e.height/2}px`,marginLeft:`${e.width}px`};break;case"right":r=i.top+i.height/2-e.height/2,n=i.left+i.width,a="+10px",d={top:"-7px",left:"0",width:"14px",height:"14px",borderRadius:"0 14px 14px 0",transformOrigin:"5% 50%",marginTop:`${e.height/2}px`,marginLeft:"0px"};break;default:r=i.top+i.height,n=i.left+i.width/2-e.width/2,p="+10px",d={top:"0",left:"0",marginLeft:`${e.width/2-o.width/2}px`}}return n=Math.max(4,Math.min(n,l-e.width-4)),r=Math.max(4,Math.min(r,h-e.height-4)),{left:n,top:r,translateX:a,translateY:p,backdropStyles:d}}(s,l,h,o)}class e{constructor(t={}){this.options=Object.assign({delay:350,tooltip:"",position:"bottom",html:!1},t),this.isVisible=!1,this.isHovering=!1,this.targetEl=null,this.tooltipEl=null,this.backdropEl=null,this.hoverTimeout=null,this.currentBackdropStyles={},this.scrolling=!1,this.ticking=!1,this.animationFrame=null,this.handleScroll=this.handleScroll.bind(this),this.handleResize=this.handleResize.bind(this),this.showTooltip=this.showTooltip.bind(this),this.hideTooltip=this.hideTooltip.bind(this),this.onPointerEnter=this.onPointerEnter.bind(this),this.onPointerLeave=this.onPointerLeave.bind(this),this.repositionTooltip=this.repositionTooltip.bind(this)}init(t){if(this.targetEl=t,t.getAttribute("data-tooltip-id")){let i=document.getElementById(t.getAttribute("data-tooltip-id"));i&&i.remove()}let e="flaspeedtooltip-"+Math.random().toString(16).slice(2,14);t.setAttribute("data-tooltip-id",e),this.tooltipEl=document.createElement("div"),this.tooltipEl.className="material-tooltip",this.tooltipEl.id=e,this.tooltipEl.style.margin="0",this.tooltipEl.style.position="fixed",this.tooltipEl.style.visibility="hidden",this.tooltipEl.style.opacity="0";let o=document.createElement("span"),s=this.getTooltipText();return this.isTooltipHtml()?o.innerHTML=s:o.textContent=s,this.backdropEl=document.createElement("div"),this.backdropEl.className="backdrop",this.backdropEl.style.margin="0",this.backdropEl.style.visibility="hidden",this.backdropEl.style.opacity="0",this.tooltipEl.appendChild(o),this.tooltipEl.appendChild(this.backdropEl),document.body.appendChild(this.tooltipEl),this.attachEvents(),this.tooltipEl}getTooltipText(){return this.targetEl.getAttribute("data-tooltip")||this.options.tooltip||this.targetEl.getAttribute("title")||""}isTooltipHtml(){return"true"===this.targetEl.getAttribute("data-html")||this.options.html}getPosition(){return this.targetEl.getAttribute("data-position")||this.options.position}getDelay(){let t=this.targetEl.getAttribute("data-delay");return null!==t&&""!==t?parseInt(t):this.options.delay}attachEvents(){this.targetEl.addEventListener("pointerenter",this.onPointerEnter),this.targetEl.addEventListener("pointerleave",this.onPointerLeave),window.addEventListener("scroll",this.handleScroll,{passive:!0}),window.addEventListener("resize",this.handleResize,{passive:!0})}detachEvents(){this.targetEl.removeEventListener("pointerenter",this.onPointerEnter),this.targetEl.removeEventListener("pointerleave",this.onPointerLeave),window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.handleResize),this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null)}onPointerEnter(t){this.isHovering=!0,this.hoverTimeout&&clearTimeout(this.hoverTimeout),this.hoverTimeout=setTimeout(()=>{this.showTooltip()},this.getDelay())}onPointerLeave(){this.isHovering=!1,this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.hideTooltip()}showTooltip(){let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h,backdropStyles:n}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.currentBackdropStyles=n,this.tooltipEl.style.visibility="visible",this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.backdropEl.style.visibility="visible",t(this.backdropEl,n);let r=this.tooltipEl.offsetWidth,a=this.tooltipEl.offsetHeight,p=this.backdropEl.offsetWidth,d=this.backdropEl.offsetHeight,E=Math.max(Math.SQRT2*r/p,Math.SQRT2*a/d);this.tooltipEl.style.transition="transform 0.3s, opacity 0.3s",this.backdropEl.style.transition="transform 0.3s, opacity 0.3s",this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,this.tooltipEl.style.opacity="1",this.backdropEl.style.transform=`scale(${E})`,this.backdropEl.style.opacity="1",this.isVisible=!0})}hideTooltip(){this.animationFrame&&cancelAnimationFrame(this.animationFrame),this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform="translateY(0) translateX(0)",this.tooltipEl.style.opacity="0",this.backdropEl.style.transform="scale(1)",this.backdropEl.style.opacity="0",setTimeout(()=>{this.isVisible&&(this.tooltipEl.style.visibility="hidden",this.backdropEl.style.visibility="hidden",this.isVisible=!1)},225)}),this.isVisible=!1}repositionTooltip(){if(!this.isVisible)return;let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,t(this.backdropEl,this.currentBackdropStyles)}handleScroll(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}handleResize(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}remove(){this.detachEvents(),this.tooltipEl&&this.tooltipEl.parentNode&&this.tooltipEl.parentNode.removeChild(this.tooltipEl),this.targetEl&&this.targetEl.removeAttribute("data-tooltip-id"),this.targetEl=null,this.tooltipEl=null,this.backdropEl=null}}window.VanillaTooltip=function(t,i){if(!t)return null;if("remove"===i){let o=t.getAttribute("data-tooltip-id");if(o){let s=document.getElementById(o);s&&s._tooltip?s._tooltip.remove():s&&s.remove(),t.removeAttribute("data-tooltip-id")}return}let l=new e(i),h=l.init(t);return h._tooltip=l,t}}()};
/*DropMenu*/
// دالة تأثير الدخول (Opening) بأسلوب Material Design 3
function materialEnter(element, duration, callback) {
  // إعداد الحالة الابتدائية
  element.style.display = 'block';
  element.style.opacity = '0';
  element.style.transform = 'scale(0.8)';
  element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;

  // إجبار المتصفح على حساب الأنماط الحالية (reflow)
  element.offsetWidth;

  // بدء الانتقال بعد إطار واحد
  requestAnimationFrame(() => {
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  });

  setTimeout(() => {
    element.style.transition = '';
    if (typeof callback === 'function') callback();
  }, duration + 20);
}

// دالة تأثير الخروج (Closing) بأسلوب Material Design 3
function materialExit(element, duration, callback) {
  element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
  element.style.opacity = '0';
  element.style.transform = 'scale(0.8)';

  setTimeout(() => {
    element.style.display = 'none';
    element.style.transition = '';
    if (typeof callback === 'function') callback();
  }, duration);
}

// الدالة الرئيسية للعناصر المنسدلة (dropdown)
function initDropdown(elements, options = {}) {
  // إذا تم تمرير "open" كخيار، قم بفتح جميع العناصر المنسدلة المحددة
  if (options === "open") {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const event = new CustomEvent('open');
      element.dispatchEvent(event);
    }
    return false;
  }

  // إذا تم تمرير "close" كخيار، قم بإغلاق جميع العناصر المنسدلة المحددة
  if (options === "close") {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const event = new CustomEvent('close');
      element.dispatchEvent(event);
    }
    return false;
  }

  // الخيارات الافتراضية
  const defaults = {
    inDuration: 100,
    outDuration: 100,
    constrainWidth: false,
    hover: false,
    gutter: 0,
    belowOrigin: true,
    alignment: BlogDirection === 'rtl' ? 'right' : 'left',
    stopPropagation: false
  };

  // تنفيذ الوظيفة لكل عنصر من العناصر المحددة
  for (let i = 0; i < elements.length; i++) {
    const origin = elements[i];
    // دمج الخيارات المخصصة مع الخيارات الافتراضية
    let curr_options = Object.assign({}, defaults, options);
    let isFocused = false;
    
    // متغير لتتبع حالة القائمة - تم نقله إلى هنا ليكون في نطاق أوسع
    let isDropdownOpen = false;

    // تعريف معالج النقر في النطاق الصحيح (خارج الشرط) ليكون متاحًا للجميع
    const clickHandler = function(e) {
      if (!isFocused) {
        if (origin === e.currentTarget &&
            !origin.classList.contains("active") &&
            !e.target.closest(".dropdown-content")) {
          e.preventDefault();
          if (curr_options.stopPropagation) {
            e.stopPropagation();
          }
          placeDropdown("click");
          // تعديل هنا: تحديث حالة القائمة عند النقر
          isDropdownOpen = true;
        } else if (origin.classList.contains("active")) {
          // إذا كان النقر على زر أو عنصر يحمل الكلاس sp-btn لا نفعل شيئًا
          if (e.target.closest('button.sp-btn') || e.target.closest('.sp-btn')) {
            return;
          }
          hideDropdown();
          document.removeEventListener('click', documentClickHandler);
          // تعديل هنا: تحديث حالة القائمة عند الإغلاق
          isDropdownOpen = false;
        }
      }
    };

    // الحصول على عنصر dropdown المرتبط
    let activatesId = origin.getAttribute("data-target");
    let activates = document.getElementById(activatesId);

    // تأكد أن العنصر المنسدل مخفي في البداية
    if (activates) {
      activates.style.display = 'none';
      activates.style.opacity = '0';
    }

    // تحديث الخيارات من سمات العنصر
    function updateOptions() {
      if (origin.dataset.induration !== undefined) curr_options.inDuration = parseInt(origin.dataset.induration);
      if (origin.dataset.outduration !== undefined) curr_options.outDuration = parseInt(origin.dataset.outduration);
      if (origin.dataset.constrainwidth !== undefined) curr_options.constrainWidth = origin.dataset.constrainwidth === 'true';
      if (origin.dataset.hover !== undefined) curr_options.hover = origin.dataset.hover === 'true';
      if (origin.dataset.gutter !== undefined) curr_options.gutter = parseInt(origin.dataset.gutter);
      if (origin.dataset.beloworigin !== undefined) curr_options.belowOrigin = origin.dataset.beloworigin === 'true';
      if (origin.dataset.alignment !== undefined) curr_options.alignment = origin.dataset.alignment;
      if (origin.dataset.stoppropagation !== undefined) curr_options.stopPropagation = origin.dataset.stoppropagation === 'true';
    }

    updateOptions();

    // إدراج عنصر dropdown بعد العنصر الأصلي إذا لم يكن بالفعل
    if (activates && origin.nextElementSibling !== activates) {
      origin.parentNode.insertBefore(activates, origin.nextElementSibling);
    }

    // دالة وضع dropdown في مكانه الصحيح
    function placeDropdown(eventType) {
      if (eventType === "focus") {
        isFocused = true;
      }

      updateOptions();

      activates.classList.add("active");
      origin.classList.add("active");

      const originWidth = origin.getBoundingClientRect().width;

      if (curr_options.constrainWidth === true) {
        activates.style.width = originWidth + 'px';
      }

      // تعيين العنصر بشكل مؤقت لحساب أبعاده (مع visibility:hidden حتى لا يظهر)
      activates.style.display = 'block';
      activates.style.visibility = 'hidden';
      activates.style.opacity = '0';
      activates.style.transform = 'scale(0.8)';

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const originHeight = origin.clientHeight;
      const originRect = origin.getBoundingClientRect();
      const activatesWidth = activates.offsetWidth;
      const activatesHeight = activates.offsetHeight;

      // إعادة ضبط مكان القائمة أفقياً بناءً على الاتجاه
      let currAlignment = curr_options.alignment;

      // التحقق من خروج القائمة عن الشاشة وتعديل الاتجاه إذا لزم الأمر
      if (currAlignment === "left") {
        if (originRect.left + activatesWidth > windowWidth) {
          currAlignment = "right";
        }
      } else if (currAlignment === "right") {
        if (originRect.right - activatesWidth < 0) {
          currAlignment = "left";
        }
      }

      let verticalOffset = 0;

      if (curr_options.belowOrigin === true) {
        verticalOffset = originHeight;
      }

      let scrollYOffset = 0;
      const wrapper = origin.parentElement;

      if (wrapper && wrapper !== document.body) {
        if (wrapper.scrollHeight > wrapper.clientHeight) {
          scrollYOffset = wrapper.scrollTop;
        }
      }

      // التحقق من تجاوز الحد السفلي للنافذة
      if (originRect.top + verticalOffset + activatesHeight > windowHeight) {
        if (originRect.top + originHeight - activatesHeight < 0) {
          const adjustedHeight = windowHeight - originRect.top - verticalOffset;
          activates.style.maxHeight = adjustedHeight + 'px';
        } else {
          if (!verticalOffset) {
            verticalOffset += originHeight;
          }
          verticalOffset -= activatesHeight;
        }
      }

      // تطبيق الأنماط النهائية للموضع
      activates.style.position = 'absolute';
      activates.style.top = (origin.offsetTop + verticalOffset + scrollYOffset) + 'px';

      // تعديل موضع القائمة أفقيًا بناءً على currAlignment
      if (currAlignment === "left") {
        activates.style.left = '0px';
        activates.style.right = 'auto';
        activates.style.transformOrigin = "top left";
      } else if (currAlignment === "right") {
        activates.style.right = '0px';
        activates.style.left = 'auto';
        activates.style.transformOrigin = "top right";
      } else {
        activates.style.transformOrigin = "top";
      }

      // إعادة ضبط العرض المرئي للقائمة قبل تطبيق التأثير
      activates.style.display = 'none';
      activates.style.visibility = 'visible';

      // بدء تأثير الدخول
      materialEnter(activates, curr_options.inDuration, () => {
        activates.style.height = '';
      });

      setTimeout(() => {
        document.addEventListener('click', documentClickHandler);
      }, 0);
    }

    // معالج النقر على المستند لإخفاء dropdown
    const documentClickHandler = function(e) {
      // إذا تم النقر على زر أو عنصر يحمل الكلاس sp-btn، فقط نخرج من الدالة بدون إيقاف انتشار الحدث
      if (e.target.closest('button.sp-btn') || e.target.closest('.sp-btn')) {
        return;
      }
      
      // إذا كان النقر على العنصر الأصلي أو داخل القائمة المنسدلة، نخرج دون إغلاق
      if (e.target === origin || (activates && activates.contains(e.target))) {
        return;
      }

      hideDropdown();
      document.removeEventListener('click', documentClickHandler);
    };

    // دالة إخفاء dropdown باستخدام تأثير الخروج
    function hideDropdown() {
      isFocused = false;
      // تحديث حالة القائمة عند الإغلاق
      isDropdownOpen = false;

      materialExit(activates, curr_options.outDuration, () => {
        activates.classList.remove("active");
        origin.classList.remove("active");
        document.removeEventListener('click', documentClickHandler);
        activates.style.maxHeight = '';
      });
    }

    // إزالة مستمع النقر من العنصر أولاً قبل إضافة أي مستمعات جديدة
    origin.removeEventListener('click', clickHandler);

    // إضافة مستمع النقر دائماً بغض النظر عن وضع hover
    origin.addEventListener('click', function(e) {
      if (origin === e.currentTarget && 
          !e.target.closest(".dropdown-content")) {
        e.preventDefault();
        if (curr_options.stopPropagation) {
          e.stopPropagation();
        }
        
        // تبديل حالة القائمة عند النقر
        if (origin.classList.contains("active")) {
          hideDropdown();
        } else {
          placeDropdown("click");
          // تعديل هنا: تحديث حالة القائمة
          isDropdownOpen = true;
        }
      }
    });
    
    // إذا كان وضع hover مفعل، نضيف مستمعات الحدث الخاصة بالتحويم
    if (curr_options.hover) {
      origin.addEventListener('mouseenter', (e) => {
        // تعديل هنا: دائماً نقوم بفتح القائمة عند تحويم الماوس بغض النظر عن الحالة السابقة
        if (!origin.classList.contains("active")) {
          placeDropdown();
          // تحديث المتغير الذي يتتبع حالة القائمة
          isDropdownOpen = true;
        }
      });

      origin.addEventListener('mouseleave', (e) => {
        const toEl = e.relatedTarget;
        if (!toEl || !activates.contains(toEl)) {
          // تعديل هنا: نخفي القائمة إذا كانت مفتوحة بواسطة التحويم فقط
          if (curr_options.hover && isDropdownOpen && !toEl?.closest(".dropdown-content")) {
            hideDropdown();
          }
        }
      });

      if (activates) {
        activates.addEventListener('mouseleave', (e) => {
          const toEl = e.relatedTarget;
          if (!toEl || !origin.contains(toEl)) {
            // تعديل هنا: نخفي القائمة إذا كانت مفتوحة بواسطة التحويم فقط
            if (curr_options.hover && isDropdownOpen) {
              hideDropdown();
            }
          }
        });

        // تعديل هنا: إضافة معالج mouseenter للقائمة المنسدلة نفسها
        activates.addEventListener('mouseenter', (e) => {
          // لا نعمل شيئاً هنا سوى تأكيد أننا داخل القائمة
        });
      }
    }

    // إضافة أحداث النقر للعناصر داخل القائمة لمنع إغلاق القائمة عند النقر على زر sp-btn
    if (activates) {
      const buttons = activates.querySelectorAll('button.sp-btn, .sp-btn');
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', (e) => {
          // لا نقوم بإيقاف انتشار الحدث هنا حتى يتمكن سكريبت آخر من التقاطه
        });
      }
    }

    // إضافة مستمعي أحداث للفتح والإغلاق المبرمج
    origin.addEventListener('open', (e) => {
      placeDropdown(e.detail);
      isDropdownOpen = true;
    });

    origin.addEventListener('close', () => {
      hideDropdown();
      isDropdownOpen = false;
    });
  }
}

// تطبيق الدالة كطريقة على NodeList لتسهيل الاستخدام
NodeList.prototype.dropdown = function(options) {
  return initDropdown(this, options);
};

// تطبيق الدالة كطريقة على HTMLElement لتسهيل الاستخدام
HTMLElement.prototype.dropdown = function(options) {
  return initDropdown([this], options);
};
/*Drawer*/
!function(){function t(t,e,i,s,n){for(let o in t.style.transition=`all ${i}ms ${s}`,e)t.style[o]=e[o];setTimeout(function(){t.style.transition="",n&&"function"==typeof n&&n()},i)}let e={menuWidth:300,edge:"rtl"===BlogDirection?"right":"left",closeOnClick:!1,inDuration:250,outDuration:200,onOpenStart:null,onOpenEnd:null,onCloseStart:null,onCloseEnd:null,preventScrolling:!0};function i(t,i){this.elem=t,this.options=Object.assign({},e,i),this.isDragged=!1,this.isOpen=!1,this._startingXpos=0,this._xPos=0,this._time=0,this._width=0,this.percentOpen=0,this._verticallyScrolling=!1,this.lastWindowWidth=window.innerWidth,this.lastWindowHeight=window.innerHeight,this.init()}i.prototype.init=function(){let t=this,e=this.elem,i=e.getAttribute("data-activates"),s=document.getElementById(i);if(!s)return;300!=this.options.menuWidth&&(s.style.width=this.options.menuWidth+"px"),this._width=s.getBoundingClientRect().width;let n=document.querySelector(`.drag-target[data-sidenav="${i}"]`);n&&n.parentNode.removeChild(n),(n=document.createElement("div")).className="drag-target",n.setAttribute("data-sidenav",i),document.body.appendChild(n),this.dragTarget=n,this._createOverlay(i),"left"===this.options.edge?(s.classList.add("left-aligned"),s.style.transform="translateX(-100%)",this.dragTarget.style.left="0"):(s.classList.add("right-aligned"),s.style.transform="translateX(100%)",this.dragTarget.style.right="0"),this.isFixed=s.classList.contains("fixed"),this.isFixed&&this._setupFixed(),this._setupEventHandlers(s,i),!0===this.options.closeOnClick&&this._setupCloseOnClick(s),e.addEventListener("click",function(e){e.preventDefault(),t.isOpen?t.close():t.open()})},i.prototype._createOverlay=function(t){let e=document.getElementById("sidenav-overlay");e&&e.parentNode.removeChild(e),(e=document.createElement("div")).id="sidenav-overlay",e.style.opacity="0",e.style.display="none";let i=this;e.addEventListener("click",function(){i.close()}),document.body.appendChild(e),this._overlay=e},i.prototype._setupEventHandlers=function(t,e){this._handleDragTargetDragBound=this._handleDragTargetDrag.bind(this),this._handleDragTargetReleaseBound=this._handleDragTargetRelease.bind(this),this._handleCloseDragBound=this._handleCloseDrag.bind(this),this._handleCloseReleaseBound=this._handleCloseRelease.bind(this),this.dragTarget.addEventListener("touchmove",this._handleDragTargetDragBound),this.dragTarget.addEventListener("touchend",this._handleDragTargetReleaseBound),this._overlay.addEventListener("touchmove",this._handleCloseDragBound),this._overlay.addEventListener("touchend",this._handleCloseReleaseBound),this.isFixed&&(this._handleWindowResizeBound=this._handleWindowResize.bind(this),window.addEventListener("resize",this._handleWindowResizeBound))},i.prototype._setupCloseOnClick=function(t){let e=this;t.addEventListener("click",function(t){let i=t.target;"a"!==i.tagName.toLowerCase()||i.classList.contains("collapsible-header")||window.innerWidth>992&&e.isFixed||e.close()})},i.prototype._setupFixed=function(){this._isCurrentlyFixed()&&this.open()},i.prototype._isCurrentlyFixed=function(){return this.isFixed&&window.innerWidth>992},i.prototype._startDrag=function(t){let e=t.targetTouches[0].clientX;this.isDragged=!0,this._startingXpos=e,this._xPos=this._startingXpos,this._time=Date.now(),this._verticallyScrolling=!1,this._overlay.style.display="block",this._initialScrollTop=this.isOpen?document.getElementById(this.elem.getAttribute("data-activates")).scrollTop:document.documentElement.scrollTop},i.prototype._dragMoveUpdate=function(t){let e=t.targetTouches[0].clientX,i=this.isOpen?document.getElementById(this.elem.getAttribute("data-activates")).scrollTop:document.documentElement.scrollTop;this.deltaX=Math.abs(this._xPos-e),this._xPos=e,this.velocityX=this.deltaX/(Date.now()-this._time),this._time=Date.now(),this._initialScrollTop!==i&&(this._verticallyScrolling=!0)},i.prototype._handleDragTargetDrag=function(t){if(this._isCurrentlyFixed()||this._verticallyScrolling)return;this.isDragged||this._startDrag(t),this._dragMoveUpdate(t);let e=this._xPos-this._startingXpos,i=e>0?"right":"left";e=Math.min(this._width,Math.abs(e)),this.options.edge===i&&(e=0);let s=e,n=document.getElementById(this.elem.getAttribute("data-activates"));"left"===this.options.edge?(s=e-this._width,n.style.transform=`translateX(${s}px)`):(s=this._width-e,n.style.transform=`translateX(${-s}px)`),this.percentOpen=Math.min(1,e/this._width),this._overlay.style.opacity=this.percentOpen,this.options.preventScrolling&&(document.body.style.overflow="hidden")},i.prototype._handleDragTargetRelease=function(){if(this.isDragged){let e=document.getElementById(this.elem.getAttribute("data-activates"));this.percentOpen>.2?this.open():("left"===this.options.edge?t(e,{transform:"translateX(-100%)"},this.options.outDuration,"cubic-bezier(0.25, 0.46, 0.45, 0.94)"):t(e,{transform:"translateX(100%)"},this.options.outDuration,"cubic-bezier(0.25, 0.46, 0.45, 0.94)"),t(this._overlay,{opacity:"0"},this.options.outDuration,"ease-out",()=>{this._overlay.style.display="none"}),this.options.preventScrolling&&(document.body.style.overflow="")),this.isDragged=!1,this._verticallyScrolling=!1}},i.prototype._handleCloseDrag=function(t){if(this.isOpen){if(this._isCurrentlyFixed()||this._verticallyScrolling)return;this.isDragged||this._startDrag(t),this._dragMoveUpdate(t);let e=this._xPos-this._startingXpos,i=e>0?"right":"left";e=Math.min(this._width,Math.abs(e)),this.options.edge!==i&&(e=0);let s=document.getElementById(this.elem.getAttribute("data-activates")),n=-e;"left"===this.options.edge?s.style.transform=`translateX(${n}px)`:s.style.transform=`translateX(${-n}px)`,this.percentOpen=Math.min(1,1-e/this._width),this._overlay.style.opacity=this.percentOpen}},i.prototype._handleCloseRelease=function(){if(this.isOpen&&this.isDragged){let e=document.getElementById(this.elem.getAttribute("data-activates"));this.percentOpen>.8?(t(e,{transform:"translateX(0)"},this.options.inDuration,"ease-out"),t(this._overlay,{opacity:"1"},this.options.inDuration,"ease-out")):this.close(),this.isDragged=!1,this._verticallyScrolling=!1}},i.prototype._handleWindowResize=function(){if(this.lastWindowWidth!==window.innerWidth){if(window.innerWidth>992){if(this.isOpen)this.open();else{let t=document.getElementById(this.elem.getAttribute("data-activates"));t.style.transform="translateX(0)"}}else if(!this.isOpen){let e=document.getElementById(this.elem.getAttribute("data-activates"));"left"===this.options.edge?e.style.transform="translateX(-100%)":e.style.transform="translateX(100%)"}}this.lastWindowWidth=window.innerWidth,this.lastWindowHeight=window.innerHeight},i.prototype.open=function(){if(!0===this.isOpen)return;let e=document.getElementById(this.elem.getAttribute("data-activates"));if("function"==typeof this.options.onOpenStart&&this.options.onOpenStart.call(this,e),this._isCurrentlyFixed())t(e,{transform:"translateX(0)"},0,"easeOutQuad"),this.options.preventScrolling&&(document.body.style.overflow=""),this._overlay.style.display="none";else if(this.options.preventScrolling&&(document.body.style.overflow="hidden"),!this.isDragged||1!=this.percentOpen){let i="left"===this.options.edge?-1:1,s=100*i;this.isDragged&&(s="left"===this.options.edge?s+100*this.percentOpen:s-100*this.percentOpen),t(e,{transform:"translateX(0)"},this.options.inDuration,"ease-out",()=>{"function"==typeof this.options.onOpenEnd&&this.options.onOpenEnd.call(this,e)}),this._overlay.style.display="block";let n=0;this.isDragged&&(n=this.percentOpen),t(this._overlay,{opacity:"1"},this.options.inDuration,"ease-out")}this.isOpen=!0},i.prototype.close=function(){if(!1===this.isOpen)return;let e=document.getElementById(this.elem.getAttribute("data-activates"));if("function"==typeof this.options.onCloseStart&&this.options.onCloseStart.call(this,e),this._isCurrentlyFixed()){let i="left"===this.options.edge?"-105%":"105%";e.style.transform=`translateX(${i})`}else if(this.options.preventScrolling&&(document.body.style.overflow=""),this.isDragged&&0==this.percentOpen)this._overlay.style.display="none";else{let s="left"===this.options.edge?-1:1,n=0;this.isDragged&&(n="left"===this.options.edge?s+this.percentOpen:s-this.percentOpen);t(e,{transform:`translateX(${105*s}%)`},this.options.outDuration,"ease-out",()=>{"function"==typeof this.options.onCloseEnd&&this.options.onCloseEnd.call(this,e)}),t(this._overlay,{opacity:"0"},this.options.outDuration,"ease-out",()=>{this._overlay.style.display="none"})}this.isOpen=!1},i.prototype.destroy=function(){this.dragTarget.removeEventListener("touchmove",this._handleDragTargetDragBound),this.dragTarget.removeEventListener("touchend",this._handleDragTargetReleaseBound),this._overlay.removeEventListener("touchmove",this._handleCloseDragBound),this._overlay.removeEventListener("touchend",this._handleCloseReleaseBound),this.isFixed&&window.removeEventListener("resize",this._handleWindowResizeBound),this.elem.getAttribute("data-activates"),this.dragTarget&&this.dragTarget.parentNode&&this.dragTarget.parentNode.removeChild(this.dragTarget),this._overlay&&this._overlay.parentNode&&this._overlay.parentNode.removeChild(this._overlay),this.elem.M_SideNav=void 0},i.prototype.show=function(){this.open()},i.prototype.hide=function(){this.close()},window.SideNav=i}();
/*Waves*/
if(WavesAllow)!function(t){let e={},n=document.querySelectorAll.bind(document);function i(t){let e="";for(let n in t)t.hasOwnProperty(n)&&(e+=n+":"+t[n]+";");return e}let a={duration:750,show:function(t,e){if(2===t.button)return!1;let n=e||this,o=document.createElement("div");o.className="waves-ripple",n.appendChild(o);let r={top:0,left:0},s=n&&n.ownerDocument,u=s.documentElement;void 0!==n.getBoundingClientRect&&(r=n.getBoundingClientRect());let l=s===s.window?s:9===s.nodeType&&s.defaultView,c={top:r.top+l.pageYOffset-u.clientTop,left:r.left+l.pageXOffset-u.clientLeft},d=t.pageY-c.top,f=t.pageX-c.left,m="scale("+n.clientWidth/100*10+")";"touches"in t&&(d=t.touches[0].pageY-c.top,f=t.touches[0].pageX-c.left),o.setAttribute("data-hold",Date.now()),o.setAttribute("data-scale",m),o.setAttribute("data-x",f),o.setAttribute("data-y",d);let p={top:d+"px",left:f+"px"};o.className+=" waves-notransition",o.setAttribute("style",i(p)),o.className=o.className.replace("waves-notransition",""),p["-webkit-transform"]=m,p["-moz-transform"]=m,p["-ms-transform"]=m,p["-o-transform"]=m,p.transform=m,p.opacity="1",p["-webkit-transition-duration"]=a.duration+"ms",p["-moz-transition-duration"]=a.duration+"ms",p["-o-transition-duration"]=a.duration+"ms",p["transition-duration"]=a.duration+"ms",p["-webkit-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",p["-moz-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",p["-o-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",p["transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",o.setAttribute("style",i(p))},hide:function(t){o.touchup(t);let e=this,n=e.getElementsByClassName("waves-ripple");if(0===n.length)return!1;let r=n[n.length-1],s=r.getAttribute("data-x"),u=r.getAttribute("data-y"),l=r.getAttribute("data-scale"),c=Date.now()-Number(r.getAttribute("data-hold")),d=350-c;d<0&&(d=0),setTimeout(function(){let t={top:u+"px",left:s+"px",opacity:"0","-webkit-transition-duration":a.duration+"ms","-moz-transition-duration":a.duration+"ms","-o-transition-duration":a.duration+"ms","transition-duration":a.duration+"ms","-webkit-transform":l,"-moz-transform":l,"-ms-transform":l,"-o-transform":l,transform:l};r.setAttribute("style",i(t)),setTimeout(function(){try{e.removeChild(r)}catch(t){return!1}},a.duration)},d)},wrapInput:function(t){for(let e=0;e<t.length;e++){let n=t[e];if("input"===n.tagName.toLowerCase()){let i=n.parentNode;if("i"===i.tagName.toLowerCase()&&-1!==i.className.indexOf("waves-effect"))continue;let a=document.createElement("i");a.className=n.className+" waves-input-wrapper";let o=n.getAttribute("style");o=o||"",a.setAttribute("style",o),n.className="waves-button-input",n.removeAttribute("style"),i.replaceChild(a,n),a.appendChild(n)}}}},o={touches:0,allowEvent:function(t){let e=!0;return"touchstart"===t.type?o.touches+=1:"touchend"===t.type||"touchcancel"===t.type?setTimeout(function(){o.touches>0&&(o.touches-=1)},500):"mousedown"===t.type&&o.touches>0&&(e=!1),e},touchup:function(t){o.allowEvent(t)}};function r(e){let n=function t(e){if(!1===o.allowEvent(e))return null;let n=null,i=e.target||e.srcElement;for(;null!==i.parentNode;){if(!(i instanceof SVGElement)&&-1!==i.className.indexOf("waves-effect")){n=i;break}i=i.parentNode}return n}(e);null!==n&&(a.show(e,n),"ontouchstart"in t&&(n.addEventListener("touchend",a.hide,!1),n.addEventListener("touchcancel",a.hide,!1)),n.addEventListener("mouseup",a.hide,!1),n.addEventListener("mouseleave",a.hide,!1),n.addEventListener("dragend",a.hide,!1))}e.displayEffect=function(e){"duration"in(e=e||{})&&(a.duration=e.duration),a.wrapInput(n(".waves-effect")),"ontouchstart"in t&&document.body.addEventListener("touchstart",r,!1),document.body.addEventListener("mousedown",r,!1)},e.attach=function(e){"input"===e.tagName.toLowerCase()&&(a.wrapInput([e]),e=e.parentNode),"ontouchstart"in t&&e.addEventListener("touchstart",r,!1),e.addEventListener("mousedown",r,!1)},t.Waves=e,e.displayEffect()}(window);else{let t=document.querySelectorAll("body *");for(let e=0;e<t.length;e++){let n=t[e];hasClass(n,"waves-effect")&&n.classList.remove("waves-effect"),hasClass(n,"waves-light")&&n.classList.remove("waves-light")}}
/*============================================================
-->> Tooltips()
==============================================================*/
if(Tooltips){tooltip()};
function tooltip(){
if(isMobileTooltip){
const elements = document.querySelectorAll('.tooltipped');
if (elements.length) {
for (let i = 0; i < elements.length; i++) {
const el = elements[i];
if (!el) continue;
if (!el.hasAttribute('title') && el.dataset.tooltip) {
el.setAttribute('title', el.dataset.tooltip);
}
for (let i = 0; i < ['data-tooltip', 'data-delay', 'data-position'].length; i++) {
  const attr = ['data-tooltip', 'data-delay', 'data-position'][i];
if (el.hasAttribute(attr)) el.removeAttribute(attr);
}
el.classList.remove('tooltipped');
}
}
} else {
document.addEventListener("pointerenter", function (event) { 
if (!(event.target instanceof Element)) return;
const btn = event.target.closest(".tooltipped");
if (!btn) return;
if (!window._vanillaTooltips) {
window._vanillaTooltips = new Map();
}
const tooltipId = btn.dataset.tooltipId || btn.getAttribute("id") || Math.random().toString(36).slice(2, 11);
if (!window._vanillaTooltips.has(tooltipId)) {
window._vanillaTooltips.set(tooltipId, new VanillaTooltip(btn,{delay: 50,position:btn.closest('.nav-drawer') && btn.closest('.social') ? 'top' : 'bottom'}));
}
}, true);
}
}
/*============================================================
-->> DropMenu()
==============================================================*/
document.addEventListener("click", function (event) { 
if (!(event.target instanceof Element)) return;
const el = event.target.closest(".dropdown-button");
if (!el) return;
if(!el.hasAttribute("data-initialized")){
const spAlignment = el.dataset.target === 'vBookmarks' ? {alignment:BlogDirection === 'rtl' ? 'left' : 'right'} : '';
el.dropdown(spAlignment);
el.setAttribute("data-initialized", "true");
el.dropdown("open");
}
});
/*============================================================
-->> Drawer()
==============================================================*/
Drawer();
function Drawer() {
const sideNavs = document.querySelectorAll('.drawer-btn');
for (let i = 0; i < sideNavs.length; i++) {
const nav = sideNavs[i],
mySidenav = new SideNav(nav, {
menuWidth: 300,
isDragged: true
});
document.addEventListener("click", function (event) {
if (!(event.target instanceof Element)) return;
const el = event.target.closest(".drawer-close");
if (!el) return;
mySidenav.hide();
});
}
}
