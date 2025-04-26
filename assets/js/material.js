// Vanilla JS Tooltip Plugin
if(!isMobileTooltip){!function(){function t(t,i){Object.assign(t.style,i)}function i(t,i,e,o){let s=t.getBoundingClientRect(),l=i.getBoundingClientRect(),h=e.getBoundingClientRect();return function t(i,e,o,s){let l=window.innerWidth,h=window.innerHeight,n=0,r=0,a="0px",p="0px",d={};switch(s){case"top":r=i.top-e.height,n=i.left+i.width/2-e.width/2,p="-10px",d={bottom:"0",left:"0",borderRadius:"14px 14px 0 0",transformOrigin:"50% 100%",marginTop:`${e.height}px`,marginLeft:`${e.width/2-o.width/2}px`};break;case"left":r=i.top+i.height/2-e.height/2,n=i.left-e.width,a="-10px",d={top:"-7px",right:"0",width:"14px",height:"14px",borderRadius:"14px 0 0 14px",transformOrigin:"95% 50%",marginTop:`${e.height/2}px`,marginLeft:`${e.width}px`};break;case"right":r=i.top+i.height/2-e.height/2,n=i.left+i.width,a="+10px",d={top:"-7px",left:"0",width:"14px",height:"14px",borderRadius:"0 14px 14px 0",transformOrigin:"5% 50%",marginTop:`${e.height/2}px`,marginLeft:"0px"};break;default:r=i.top+i.height,n=i.left+i.width/2-e.width/2,p="+10px",d={top:"0",left:"0",marginLeft:`${e.width/2-o.width/2}px`}}return{left:n=Math.max(4,Math.min(n,l-e.width-4)),top:r=Math.max(4,Math.min(r,h-e.height-4)),translateX:a,translateY:p,backdropStyles:d}}(s,l,h,o)}class e{constructor(t={}){this.options=Object.assign({delay:350,tooltip:"",position:"bottom",html:!1},t),this.isVisible=!1,this.isHovering=!1,this.targetEl=null,this.tooltipEl=null,this.backdropEl=null,this.hoverTimeout=null,this.currentBackdropStyles={},this.scrolling=!1,this.ticking=!1,this.animationFrame=null,this.handleScroll=this.handleScroll.bind(this),this.handleResize=this.handleResize.bind(this),this.showTooltip=this.showTooltip.bind(this),this.hideTooltip=this.hideTooltip.bind(this),this.onPointerEnter=this.onPointerEnter.bind(this),this.onPointerLeave=this.onPointerLeave.bind(this),this.repositionTooltip=this.repositionTooltip.bind(this)}init(t){if(this.targetEl=t,t.getAttribute("data-tooltip-id")){let i=document.getElementById(t.getAttribute("data-tooltip-id"));i&&i.remove()}let e="flaspeedtooltip-"+Math.random().toString(16).slice(2,14);t.setAttribute("data-tooltip-id",e),this.tooltipEl=document.createElement("div"),this.tooltipEl.className="material-tooltip",this.tooltipEl.id=e,this.tooltipEl.style.margin="0",this.tooltipEl.style.position="fixed",this.tooltipEl.style.visibility="hidden",this.tooltipEl.style.opacity="0";let o=document.createElement("span"),s=this.getTooltipText();return this.isTooltipHtml()?o.innerHTML=s:o.textContent=s,this.backdropEl=document.createElement("div"),this.backdropEl.className="backdrop",this.backdropEl.style.margin="0",this.backdropEl.style.visibility="hidden",this.backdropEl.style.opacity="0",this.tooltipEl.appendChild(o),this.tooltipEl.appendChild(this.backdropEl),document.body.appendChild(this.tooltipEl),this.attachEvents(),this.tooltipEl}getTooltipText(){return this.targetEl.getAttribute("data-tooltip")||this.options.tooltip||this.targetEl.getAttribute("title")||""}isTooltipHtml(){return"true"===this.targetEl.getAttribute("data-html")||this.options.html}getPosition(){return this.targetEl.getAttribute("data-position")||this.options.position}getDelay(){let t=this.targetEl.getAttribute("data-delay");return null!==t&&""!==t?parseInt(t):this.options.delay}attachEvents(){this.targetEl.addEventListener("pointerenter",this.onPointerEnter),this.targetEl.addEventListener("pointerleave",this.onPointerLeave),window.addEventListener("scroll",this.handleScroll,{passive:!0}),window.addEventListener("resize",this.handleResize,{passive:!0})}detachEvents(){this.targetEl.removeEventListener("pointerenter",this.onPointerEnter),this.targetEl.removeEventListener("pointerleave",this.onPointerLeave),window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.handleResize),this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null)}onPointerEnter(t){this.isHovering=!0,this.hoverTimeout&&clearTimeout(this.hoverTimeout),this.hoverTimeout=setTimeout(()=>{this.showTooltip()},this.getDelay())}onPointerLeave(){this.isHovering=!1,this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.hideTooltip()}showTooltip(){let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h,backdropStyles:n}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.currentBackdropStyles=n,this.tooltipEl.style.visibility="visible",this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.backdropEl.style.visibility="visible",t(this.backdropEl,n);let r=this.tooltipEl.offsetWidth,a=this.tooltipEl.offsetHeight,p=this.backdropEl.offsetWidth,d=this.backdropEl.offsetHeight,E=Math.max(Math.SQRT2*r/p,Math.SQRT2*a/d);this.tooltipEl.style.transition="transform 0.3s, opacity 0.3s",this.backdropEl.style.transition="transform 0.3s, opacity 0.3s",this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,this.tooltipEl.style.opacity="1",this.backdropEl.style.transform=`scale(${E})`,this.backdropEl.style.opacity="1",this.isVisible=!0})}hideTooltip(){this.animationFrame&&cancelAnimationFrame(this.animationFrame),this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform="translateY(0) translateX(0)",this.tooltipEl.style.opacity="0",this.backdropEl.style.transform="scale(1)",this.backdropEl.style.opacity="0",setTimeout(()=>{this.isVisible&&(this.tooltipEl.style.visibility="hidden",this.backdropEl.style.visibility="hidden",this.isVisible=!1)},225)}),this.isVisible=!1}repositionTooltip(){if(!this.isVisible)return;let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,t(this.backdropEl,this.currentBackdropStyles)}handleScroll(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}handleResize(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}remove(){this.detachEvents(),this.tooltipEl&&this.tooltipEl.parentNode&&this.tooltipEl.parentNode.removeChild(this.tooltipEl),this.targetEl&&this.targetEl.removeAttribute("data-tooltip-id"),this.targetEl=null,this.tooltipEl=null,this.backdropEl=null}}window.VanillaTooltip=function(t,i){if(!t)return null;if("remove"===i){let o=t.getAttribute("data-tooltip-id");if(o){let s=document.getElementById(o);s&&s._tooltip?s._tooltip.remove():s&&s.remove(),t.removeAttribute("data-tooltip-id")}return}let l=new e(i),h=l.init(t);return h._tooltip=l,t}}();};
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
      for (const element of elements) {
        const event = new CustomEvent('open');
        element.dispatchEvent(event);
      }
      return false;
    }
  
    // إذا تم تمرير "close" كخيار، قم بإغلاق جميع العناصر المنسدلة المحددة
    if (options === "close") {
      for (const element of elements) {
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
    for (const origin of elements) {
      // دمج الخيارات المخصصة مع الخيارات الافتراضية
      let curr_options = Object.assign({}, defaults, options);
      let isFocused = false;
  
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
  
        hideDropdown();
        document.removeEventListener('click', documentClickHandler);
      };
  
      // دالة إخفاء dropdown باستخدام تأثير الخروج
      function hideDropdown() {
        isFocused = false;
  
        materialExit(activates, curr_options.outDuration, () => {
          activates.classList.remove("active");
          origin.classList.remove("active");
          document.removeEventListener('click', documentClickHandler);
          activates.style.maxHeight = '';
        });
      }
  
      // إعداد الأحداث حسب الخيارات
      if (curr_options.hover) {
        let open = false;
  
        // إزالة أي مستمعي أحداث سابقة
        origin.removeEventListener('click', clickHandler);
  
        origin.addEventListener('mouseenter', (e) => {
          if (open === false) {
            placeDropdown();
            open = true;
          }
        });
  
        origin.addEventListener('mouseleave', (e) => {
          const toEl = e.relatedTarget;
          if (!toEl || !activates.contains(toEl)) {
            hideDropdown();
            open = false;
          }
        });
  
        activates.addEventListener('mouseleave', (e) => {
          const toEl = e.relatedTarget;
          if (!toEl || !origin.contains(toEl)) {
            hideDropdown();
            open = false;
          }
        });
      } else {
        // معالج النقر
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
            } else if (origin.classList.contains("active")) {
              // إذا كان النقر على زر أو عنصر يحمل الكلاس sp-btn لا نفعل شيئًا
              if (e.target.closest('button.sp-btn') || e.target.closest('.sp-btn')) {
                return;
              }
              hideDropdown();
              document.removeEventListener('click', documentClickHandler);
            }
          }
        };
  
        // إضافة أحداث النقر للعناصر داخل القائمة لمنع إغلاق القائمة عند النقر على زر sp-btn
        if (activates) {
          const buttons = activates.querySelectorAll('button.sp-btn, .sp-btn');
          for (const button of buttons) {
            button.addEventListener('click', (e) => {
              // لا نقوم بإيقاف انتشار الحدث هنا حتى يتمكن سكريبت آخر من التقاطه
            });
          }
        }
  
        // إزالة أي مستمعي أحداث سابقة وإضافة مستمع جديد
        origin.removeEventListener('click', clickHandler);
        origin.addEventListener('click', clickHandler);
      }
  
      // إضافة مستمعي أحداث للفتح والإغلاق المبرمج
      origin.addEventListener('open', (e) => {
        placeDropdown(e.detail);
      });
  
      origin.addEventListener('close', hideDropdown);
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
!function(){function t(t,e,n,o,i){for(let s in t.style.transition=`all ${n}ms ${o}`,e)t.style[s]=e[s];setTimeout(function(){t.style.transition="",i&&"function"==typeof i&&i()},n)}let e={menuWidth:300,edge:"rtl"===BlogDirection?"right":"left",closeOnClick:!1,draggable:!0,onOpen:null,onClose:null};function n(t,n){this.elem=t,this.options=Object.assign({},e,n),this.init()}n.prototype.init=function(){let e=this,n=this.elem,o=n.getAttribute("data-activates"),i=document.getElementById(o);if(!i)return;300!=this.options.menuWidth&&(i.style.width=this.options.menuWidth+"px");let s=document.querySelector(`.drag-target[data-sidenav="${o}"]`);this.options.draggable?(s&&s.parentNode.removeChild(s),(s=document.createElement("div")).className="drag-target",s.setAttribute("data-sidenav",o),document.body.appendChild(s)):s=null,"left"===this.options.edge?(i.classList.add("left-aligned"),i.style.transform="translateX(-100%)",s&&(s.style.left="0")):(i.classList.add("right-aligned"),i.style.transform="translateX(100%)",s&&(s.style.right="0")),i.classList.contains("fixed")&&window.innerWidth>992&&(i.style.transform="translateX(0)");let l=!1,a=!1;function d(n){l=!1,a=!1,document.body.style.overflow="",document.body.style.width="";let o=document.getElementById("sidenav-overlay");o&&t(o,{opacity:"0"},200,"ease-out",function(){o.parentNode&&o.parentNode.removeChild(o)}),"left"===e.options.edge?(s&&(s.style.width="",s.style.right="",s.style.left="0"),t(i,{transform:"translateX(-100%)"},200,"cubic-bezier(0.25, 0.46, 0.45, 0.94)",function(){!0===n&&(i.removeAttribute("style"),i.style.width=e.options.menuWidth+"px"),"function"==typeof e.options.onClose&&e.options.onClose.call(i)})):(s&&(s.style.width="",s.style.right="0",s.style.left=""),t(i,{transform:"translateX(100%)"},200,"cubic-bezier(0.25, 0.46, 0.45, 0.94)",function(){!0===n&&(i.removeAttribute("style"),i.style.width=e.options.menuWidth+"px"),"function"==typeof e.options.onClose&&e.options.onClose.call(i)}))}if(i.classList.contains("fixed")&&window.addEventListener("resize",function(){window.innerWidth>992?document.getElementById("sidenav-overlay")&&a?d(!0):i.style.transform="translateX(0)":a||("left"===e.options.edge?i.style.transform="translateX(-100%)":i.style.transform="translateX(100%)")}),!0===this.options.closeOnClick&&i.addEventListener("click",function(t){let e=t.target;"a"!==e.tagName.toLowerCase()||e.classList.contains("collapsible-header")||window.innerWidth>992&&i.classList.contains("fixed")||d()}),this.options.draggable&&s){s.addEventListener("click",function(){a&&d()});let r=0,y=0,$=!1;s.addEventListener("touchstart",function(t){1===t.touches.length&&($=!0,r=t.touches[0].clientX)}),s.addEventListener("touchmove",function(t){if(!$)return;y=t.touches[0].clientX;let n=y-r;if(0===y&&0===t.touches[0].clientY)return;let o=document.body.clientWidth;document.body.style.overflow="hidden",document.body.style.width=o+"px";let s=document.getElementById("sidenav-overlay");if(s||((s=document.createElement("div")).id="sidenav-overlay",s.style.opacity="0",s.addEventListener("click",function(){d()}),document.body.appendChild(s),"function"==typeof e.options.onOpen&&e.options.onOpen.call(i)),"left"===e.options.edge){let l=n;l>e.options.menuWidth?l=e.options.menuWidth:l<0&&(l=0),a=l>=e.options.menuWidth/2,i.style.transform=`translateX(${l-e.options.menuWidth}px)`,s.style.opacity=l/e.options.menuWidth}else{let c=y;c>window.innerWidth&&(c=window.innerWidth),c<window.innerWidth-e.options.menuWidth&&(c=window.innerWidth-e.options.menuWidth),a=c<window.innerWidth-e.options.menuWidth/2;let p=c-e.options.menuWidth/2;p<0&&(p=0),i.style.transform=`translateX(${p}px)`,s.style.opacity=Math.abs((c-window.innerWidth)/e.options.menuWidth)}}),s.addEventListener("touchend",function(n){if(!$)return;$=!1;let o=document.getElementById("sidenav-overlay"),l=y,d=l-e.options.menuWidth,r=l-e.options.menuWidth/2;d>0&&(d=0),r<0&&(r=0),"left"===e.options.edge?a?(0!==d&&t(i,{transform:"translateX(0)"},300,"ease-out"),o&&t(o,{opacity:"1"},50,"ease-out"),s&&(s.style.width="50%",s.style.right="0",s.style.left=""),a=!0):(document.body.style.overflow="",document.body.style.width="",t(i,{transform:"translateX(-100%)"},200,"ease-out",function(){"function"==typeof e.options.onClose&&e.options.onClose.call(i)}),o&&t(o,{opacity:"0"},200,"ease-out",function(){o.parentNode&&o.parentNode.removeChild(o)}),s&&(s.style.width="10px",s.style.right="",s.style.left="0"),a=!1):a?(0!==r&&t(i,{transform:"translateX(0)"},300,"ease-out"),o&&t(o,{opacity:"1"},50,"ease-out"),s&&(s.style.width="50%",s.style.right="",s.style.left="0"),a=!0):(document.body.style.overflow="",document.body.style.width="",t(i,{transform:"translateX(100%)"},200,"ease-out",function(){"function"==typeof e.options.onClose&&e.options.onClose.call(i)}),o&&t(o,{opacity:"0"},200,"ease-out",function(){o.parentNode&&o.parentNode.removeChild(o)}),s&&(s.style.width="10px",s.style.right="0",s.style.left=""),a=!1)})}n.addEventListener("click",function(n){if(n.preventDefault(),!0===a)a=!1,l=!1,d();else{let o=document.body.clientWidth;document.body.style.overflow="hidden",document.body.style.width=o+"px",e.options.draggable&&s&&document.body.appendChild(s);let r=document.createElement("div");r.id="sidenav-overlay",r.style.opacity="0",r.addEventListener("click",function(){a=!1,l=!1,d(),t(r,{opacity:"0"},300,"ease-out",function(){r.parentNode&&r.parentNode.removeChild(r)})}),document.body.appendChild(r),"left"===e.options.edge?(s&&(s.style.width="50%",s.style.right="0",s.style.left=""),t(i,{transform:"translateX(0)"},300,"ease-out")):(s&&(s.style.width="50%",s.style.right="",s.style.left="0"),t(i,{transform:"translateX(0)"},300,"ease-out")),t(r,{opacity:"1"},300,"ease-out",function(){a=!0,l=!1}),"function"==typeof e.options.onOpen&&e.options.onOpen.call(i)}})},n.prototype.destroy=function(){let t=this.elem.getAttribute("data-activates"),e=document.getElementById("sidenav-overlay"),n=document.querySelector(`.drag-target[data-sidenav="${t}"]`);e&&e.click(),n&&n.parentNode&&n.parentNode.removeChild(n)},n.prototype.show=function(){this.elem.click()},n.prototype.hide=function(){let t=document.getElementById("sidenav-overlay");t&&t.click()},window.SideNav=n}();
/*Waves*/
if(WavesAllow){!function(n){var t=t||{},e=document.querySelectorAll.bind(document);function h(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e+=n+":"+t[n]+";");return e}var w={duration:750,show:function(t,e){if(2===t.button)return!1;var n=e||this,a=document.createElement("div");a.className="waves-ripple",n.appendChild(a);var i,o,r,s,u,d,c,l=(u={top:0,left:0},d=(i=n)&&i.ownerDocument,c=d.documentElement,void 0!==i.getBoundingClientRect&&(u=i.getBoundingClientRect()),o=null!==(s=r=d)&&s===s.window?r:9===r.nodeType&&r.defaultView,{top:u.top+o.pageYOffset-c.clientTop,left:u.left+o.pageXOffset-c.clientLeft}),m=t.pageY-l.top,f=t.pageX-l.left,p="scale("+n.clientWidth/100*10+")";"touches"in t&&(m=t.touches[0].pageY-l.top,f=t.touches[0].pageX-l.left),a.setAttribute("data-hold",Date.now()),a.setAttribute("data-scale",p),a.setAttribute("data-x",f),a.setAttribute("data-y",m);var v={top:m+"px",left:f+"px"};a.className=a.className+" waves-notransition",a.setAttribute("style",h(v)),a.className=a.className.replace("waves-notransition",""),v["-webkit-transform"]=p,v["-moz-transform"]=p,v["-ms-transform"]=p,v["-o-transform"]=p,v.transform=p,v.opacity="1",v["-webkit-transition-duration"]=w.duration+"ms",v["-moz-transition-duration"]=w.duration+"ms",v["-o-transition-duration"]=w.duration+"ms",v["transition-duration"]=w.duration+"ms",v["-webkit-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",v["-moz-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",v["-o-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",v["transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",a.setAttribute("style",h(v))},hide:function(t){u.touchup(t);var e=this,n=(e.clientWidth,null),a=e.getElementsByClassName("waves-ripple");if(!(0<a.length))return!1;var i=(n=a[a.length-1]).getAttribute("data-x"),o=n.getAttribute("data-y"),r=n.getAttribute("data-scale"),s=350-(Date.now()-Number(n.getAttribute("data-hold")));s<0&&(s=0),setTimeout(function(){var t={top:o+"px",left:i+"px",opacity:"0","-webkit-transition-duration":w.duration+"ms","-moz-transition-duration":w.duration+"ms","-o-transition-duration":w.duration+"ms","transition-duration":w.duration+"ms","-webkit-transform":r,"-moz-transform":r,"-ms-transform":r,"-o-transform":r,transform:r};n.setAttribute("style",h(t)),setTimeout(function(){try{e.removeChild(n)}catch(t){return!1}},w.duration)},s)},wrapInput:function(t){for(var e=0;e<t.length;e++){var n=t[e];if("input"===n.tagName.toLowerCase()){var a=n.parentNode;if("i"===a.tagName.toLowerCase()&&-1!==a.className.indexOf("waves-effect"))continue;var i=document.createElement("i");i.className=n.className+" waves-input-wrapper";var o=(o=n.getAttribute("style"))||"";i.setAttribute("style",o),n.className="waves-button-input",n.removeAttribute("style"),a.replaceChild(i,n),i.appendChild(n)}}}},u={touches:0,allowEvent:function(t){var e=!0;return"touchstart"===t.type?u.touches+=1:"touchend"===t.type||"touchcancel"===t.type?setTimeout(function(){0<u.touches&&--u.touches},500):"mousedown"===t.type&&0<u.touches&&(e=!1),e},touchup:function(t){u.allowEvent(t)}};function a(t){var e=function(t){if(!1===u.allowEvent(t))return null;for(var e=null,n=t.target||t.srcElement;null!==n.parentNode;){if(!(n instanceof SVGElement)&&-1!==n.className.indexOf("waves-effect")){e=n;break}n=n.parentNode}return e}(t);null!==e&&(w.show(t,e),"ontouchstart"in n&&(e.addEventListener("touchend",w.hide,!1),e.addEventListener("touchcancel",w.hide,!1)),e.addEventListener("mouseup",w.hide,!1),e.addEventListener("mouseleave",w.hide,!1),e.addEventListener("dragend",w.hide,!1))}t.displayEffect=function(t){"duration"in(t=t||{})&&(w.duration=t.duration),w.wrapInput(e(".waves-effect")),"ontouchstart"in n&&document.body.addEventListener("touchstart",a,!1),document.body.addEventListener("mousedown",a,!1)},t.attach=function(t){"input"===t.tagName.toLowerCase()&&(w.wrapInput([t]),t=t.parentNode),"ontouchstart"in n&&t.addEventListener("touchstart",a,!1),t.addEventListener("mousedown",a,!1)},n.Waves=t,t.displayEffect()}(window);}else{document.querySelectorAll('body *').forEach(el=>{if(hasClass(el,'waves-effect')){el.classList.remove('waves-effect')}if(hasClass(el,'waves-light')){el.classList.remove('waves-light')}})};
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
for (const attr of ['data-tooltip', 'data-delay', 'data-position']) {
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
function Drawer(){
const sideNavs = document.querySelectorAll('.drawer-btn');
sideNavs.forEach(nav => {
const mySidenav = new SideNav(nav, {
menuWidth: 300,
draggable: true
});
document.addEventListener("click", function (event) { 
if (!(event.target instanceof Element)) return;
const el = event.target.closest(".drawer-close");
if (!el) return;
mySidenav.hide();
});
});
}