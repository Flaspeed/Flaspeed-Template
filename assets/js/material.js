// Vanilla JS Tooltip Plugin
if(!isMobileTooltip){!function(){function t(t,i){Object.assign(t.style,i)}function i(t,i,e,o){let s=t.getBoundingClientRect(),l=i.getBoundingClientRect(),h=e.getBoundingClientRect();return function t(i,e,o,s){let l=window.innerWidth,h=window.innerHeight,n=0,r=0,a="0px",p="0px",d={};switch(s){case"top":r=i.top-e.height,n=i.left+i.width/2-e.width/2,p="-10px",d={bottom:"0",left:"0",borderRadius:"14px 14px 0 0",transformOrigin:"50% 100%",marginTop:`${e.height}px`,marginLeft:`${e.width/2-o.width/2}px`};break;case"left":r=i.top+i.height/2-e.height/2,n=i.left-e.width,a="-10px",d={top:"-7px",right:"0",width:"14px",height:"14px",borderRadius:"14px 0 0 14px",transformOrigin:"95% 50%",marginTop:`${e.height/2}px`,marginLeft:`${e.width}px`};break;case"right":r=i.top+i.height/2-e.height/2,n=i.left+i.width,a="+10px",d={top:"-7px",left:"0",width:"14px",height:"14px",borderRadius:"0 14px 14px 0",transformOrigin:"5% 50%",marginTop:`${e.height/2}px`,marginLeft:"0px"};break;default:r=i.top+i.height,n=i.left+i.width/2-e.width/2,p="+10px",d={top:"0",left:"0",marginLeft:`${e.width/2-o.width/2}px`}}return{left:n=Math.max(4,Math.min(n,l-e.width-4)),top:r=Math.max(4,Math.min(r,h-e.height-4)),translateX:a,translateY:p,backdropStyles:d}}(s,l,h,o)}class e{constructor(t={}){this.options=Object.assign({delay:350,tooltip:"",position:"bottom",html:!1},t),this.isVisible=!1,this.isHovering=!1,this.targetEl=null,this.tooltipEl=null,this.backdropEl=null,this.hoverTimeout=null,this.currentBackdropStyles={},this.scrolling=!1,this.ticking=!1,this.animationFrame=null,this.handleScroll=this.handleScroll.bind(this),this.handleResize=this.handleResize.bind(this),this.showTooltip=this.showTooltip.bind(this),this.hideTooltip=this.hideTooltip.bind(this),this.onPointerEnter=this.onPointerEnter.bind(this),this.onPointerLeave=this.onPointerLeave.bind(this),this.repositionTooltip=this.repositionTooltip.bind(this)}init(t){if(this.targetEl=t,t.getAttribute("data-tooltip-id")){let i=document.getElementById(t.getAttribute("data-tooltip-id"));i&&i.remove()}let e="flaspeedtooltip-"+Math.random().toString(16).slice(2,14);t.setAttribute("data-tooltip-id",e),this.tooltipEl=document.createElement("div"),this.tooltipEl.className="material-tooltip",this.tooltipEl.id=e,this.tooltipEl.style.margin="0",this.tooltipEl.style.position="fixed",this.tooltipEl.style.visibility="hidden",this.tooltipEl.style.opacity="0";let o=document.createElement("span"),s=this.getTooltipText();return this.isTooltipHtml()?o.innerHTML=s:o.textContent=s,this.backdropEl=document.createElement("div"),this.backdropEl.className="backdrop",this.backdropEl.style.margin="0",this.backdropEl.style.visibility="hidden",this.backdropEl.style.opacity="0",this.tooltipEl.appendChild(o),this.tooltipEl.appendChild(this.backdropEl),document.body.appendChild(this.tooltipEl),this.attachEvents(),this.tooltipEl}getTooltipText(){return this.targetEl.getAttribute("data-tooltip")||this.options.tooltip||this.targetEl.getAttribute("title")||""}isTooltipHtml(){return"true"===this.targetEl.getAttribute("data-html")||this.options.html}getPosition(){return this.targetEl.getAttribute("data-position")||this.options.position}getDelay(){let t=this.targetEl.getAttribute("data-delay");return null!==t&&""!==t?parseInt(t):this.options.delay}attachEvents(){this.targetEl.addEventListener("pointerenter",this.onPointerEnter),this.targetEl.addEventListener("pointerleave",this.onPointerLeave),window.addEventListener("scroll",this.handleScroll,{passive:!0}),window.addEventListener("resize",this.handleResize,{passive:!0})}detachEvents(){this.targetEl.removeEventListener("pointerenter",this.onPointerEnter),this.targetEl.removeEventListener("pointerleave",this.onPointerLeave),window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.handleResize),this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null)}onPointerEnter(t){this.isHovering=!0,this.hoverTimeout&&clearTimeout(this.hoverTimeout),this.hoverTimeout=setTimeout(()=>{this.showTooltip()},this.getDelay())}onPointerLeave(){this.isHovering=!1,this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.hideTooltip()}showTooltip(){let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h,backdropStyles:n}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.currentBackdropStyles=n,this.tooltipEl.style.visibility="visible",this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.backdropEl.style.visibility="visible",t(this.backdropEl,n);let r=this.tooltipEl.offsetWidth,a=this.tooltipEl.offsetHeight,p=this.backdropEl.offsetWidth,d=this.backdropEl.offsetHeight,E=Math.max(Math.SQRT2*r/p,Math.SQRT2*a/d);this.tooltipEl.style.transition="transform 0.3s, opacity 0.3s",this.backdropEl.style.transition="transform 0.3s, opacity 0.3s",this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,this.tooltipEl.style.opacity="1",this.backdropEl.style.transform=`scale(${E})`,this.backdropEl.style.opacity="1",this.isVisible=!0})}hideTooltip(){this.animationFrame&&cancelAnimationFrame(this.animationFrame),this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform="translateY(0) translateX(0)",this.tooltipEl.style.opacity="0",this.backdropEl.style.transform="scale(1)",this.backdropEl.style.opacity="0",setTimeout(()=>{this.isVisible&&(this.tooltipEl.style.visibility="hidden",this.backdropEl.style.visibility="hidden",this.isVisible=!1)},225)}),this.isVisible=!1}repositionTooltip(){if(!this.isVisible)return;let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,t(this.backdropEl,this.currentBackdropStyles)}handleScroll(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}handleResize(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}remove(){this.detachEvents(),this.tooltipEl&&this.tooltipEl.parentNode&&this.tooltipEl.parentNode.removeChild(this.tooltipEl),this.targetEl&&this.targetEl.removeAttribute("data-tooltip-id"),this.targetEl=null,this.tooltipEl=null,this.backdropEl=null}}window.VanillaTooltip=function(t,i){if(!t)return null;if("remove"===i){let o=t.getAttribute("data-tooltip-id");if(o){let s=document.getElementById(o);s&&s._tooltip?s._tooltip.remove():s&&s.remove(),t.removeAttribute("data-tooltip-id")}return}let l=new e(i),h=l.init(t);return h._tooltip=l,t}}();};
/*DropMenu*/
function materialEnter(t,e,i){t.style.display="block",t.style.opacity="0",t.style.transform="scale(0.8)",t.style.transition=`transform ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,t.offsetWidth,requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="scale(1)"}),setTimeout(()=>{t.style.transition="","function"==typeof i&&i()},e+20)}function materialExit(t,e,i){t.style.transition=`transform ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,t.style.opacity="0",t.style.transform="scale(0.8)",setTimeout(()=>{t.style.display="none",t.style.transition="","function"==typeof i&&i()},e)}function initDropdown(t,e={}){if("open"===e){for(let i of t){let n=new CustomEvent("open");i.dispatchEvent(n)}return!1}if("close"===e){for(let o of t){let s=new CustomEvent("close");o.dispatchEvent(s)}return!1}let a={inDuration:100,outDuration:100,constrainWidth:!1,hover:!1,gutter:0,belowOrigin:!0,alignment:"rtl"===BlogDirection?"right":"left",stopPropagation:!1};for(let r of t){let l=Object.assign({},a,e),c=!1,d=r.getAttribute("data-target"),p=document.getElementById(d);function f(){void 0!==r.dataset.induration&&(l.inDuration=parseInt(r.dataset.induration)),void 0!==r.dataset.outduration&&(l.outDuration=parseInt(r.dataset.outduration)),void 0!==r.dataset.constrainwidth&&(l.constrainWidth="true"===r.dataset.constrainwidth),void 0!==r.dataset.hover&&(l.hover="true"===r.dataset.hover),void 0!==r.dataset.gutter&&(l.gutter=parseInt(r.dataset.gutter)),void 0!==r.dataset.beloworigin&&(l.belowOrigin="true"===r.dataset.beloworigin),void 0!==r.dataset.alignment&&(l.alignment=r.dataset.alignment),void 0!==r.dataset.stoppropagation&&(l.stopPropagation="true"===r.dataset.stoppropagation)}function u(t){"focus"===t&&(c=!0),f(),p.classList.add("active"),r.classList.add("active");let e=r.getBoundingClientRect().width;!0===l.constrainWidth&&(p.style.width=e+"px"),p.style.display="block",p.style.visibility="hidden",p.style.opacity="0",p.style.transform="scale(0.8)";let i=window.innerWidth,n=window.innerHeight,o=r.clientHeight,s=r.getBoundingClientRect(),a=p.offsetWidth,d=p.offsetHeight,u=l.alignment;"left"===u?s.left+a>i&&(u="right"):"right"===u&&s.right-a<0&&(u="left");let y=0;!0===l.belowOrigin&&(y=o);let $=0,v=r.parentElement;if(v&&v!==document.body&&v.scrollHeight>v.clientHeight&&($=v.scrollTop),s.top+y+d>n){if(s.top+o-d<0){let m=n-s.top-y;p.style.maxHeight=m+"px"}else y||(y+=o),y-=d}p.style.position="absolute",p.style.top=r.offsetTop+y+$+"px","left"===u?(p.style.left="0px",p.style.right="auto",p.style.transformOrigin="top left"):"right"===u?(p.style.right="0px",p.style.left="auto",p.style.transformOrigin="top right"):p.style.transformOrigin="top",p.style.display="none",p.style.visibility="visible",materialEnter(p,l.inDuration,()=>{p.style.height=""}),setTimeout(()=>{document.addEventListener("click",g)},0)}p&&(p.style.display="none",p.style.opacity="0"),f(),p&&r.nextElementSibling!==p&&r.parentNode.insertBefore(p,r.nextElementSibling);let g=function(t){!(t.target.closest("button.sp-btn")||t.target.closest(".sp-btn"))&&(y(),document.removeEventListener("click",g))};function y(){c=!1,materialExit(p,l.outDuration,()=>{p.classList.remove("active"),r.classList.remove("active"),document.removeEventListener("click",g),p.style.maxHeight=""})}if(l.hover){let $=!1;r.removeEventListener("click",clickHandler),r.addEventListener("mouseenter",t=>{!1===$&&(u(),$=!0)}),r.addEventListener("mouseleave",t=>{let e=t.relatedTarget;e&&p.contains(e)||(y(),$=!1)}),p.addEventListener("mouseleave",t=>{let e=t.relatedTarget;e&&r.contains(e)||(y(),$=!1)})}else{let v=function(t){if(!c){if(r!==t.currentTarget||r.classList.contains("active")||t.target.closest(".dropdown-content")){if(r.classList.contains("active")){if(t.target.closest("button.sp-btn")||t.target.closest(".sp-btn"))return;y(),document.removeEventListener("click",g)}}else t.preventDefault(),l.stopPropagation&&t.stopPropagation(),u("click")}};if(p){let m=p.querySelectorAll("button.sp-btn, .sp-btn");for(let h of m)h.addEventListener("click",t=>{})}r.removeEventListener("click",v),r.addEventListener("click",v)}r.addEventListener("open",t=>{u(t.detail)}),r.addEventListener("close",y)}}NodeList.prototype.dropdown=function(t){return initDropdown(this,t)},HTMLElement.prototype.dropdown=function(t){return initDropdown([this],t)};
/*Drawer*/
(function() {
    // الدالة المساعدة للأنيميشن باستخدام CSS Transition
    function animateStyles(el, styles, duration, easing, callback) {
      el.style.transition = `all ${duration}ms ${easing}`;
      for (let prop in styles) {
        el.style[prop] = styles[prop];
      }
      setTimeout(function() {
        el.style.transition = '';
        if (callback && typeof callback === 'function') callback();
      }, duration);
    }
  
    // الخيارات الافتراضية
    const defaults = {
      menuWidth: 300,
      edge: BlogDirection === 'rtl'?'right':'left',
      closeOnClick: false,
      draggable: true,
      inDuration: 300,
      outDuration: 200,
      onOpen: null,
      onClose: null
    };
  
    // كائن الـ SideNav
    function SideNav(elem, options) {
      this.elem = elem;
      this.options = Object.assign({}, defaults, options);
      
      // متغيرات للحالة
      this.menuOut = false;
      this.isDragged = false; // إضافة متغير isDragged مثل الكود الأصلي
      this._startingXpos = 0;
      this._xPos = 0;
      this._time = 0;
      this._width = 0;
      this.percentOpen = 0;
      this._verticallyScrolling = false;
      
      this.init();
    }
  
    SideNav.prototype.init = function() {
      const self = this;
      const activator = this.elem;
      const menuId = activator.getAttribute('data-activates');
      const menu = document.getElementById(menuId);
      if (!menu) return;
      this.menu = menu;
      
      if (this.options.menuWidth != 300) {
        menu.style.width = this.options.menuWidth + "px";
      }
      this._width = this.options.menuWidth;
      
      // إنشاء منطقة السحب
      let dragTarget = document.querySelector(`.drag-target[data-sidenav="${menuId}"]`);
      if (this.options.draggable) {
        if (dragTarget) {
          dragTarget.parentNode.removeChild(dragTarget);
        }
        dragTarget = document.createElement('div');
        dragTarget.className = 'drag-target';
        dragTarget.setAttribute('data-sidenav', menuId);
        document.body.appendChild(dragTarget);
      } else {
        dragTarget = null;
      }
      this.dragTarget = dragTarget;
      
      // تعيين الموضع الابتدائي بناءً على الحافة (left/right)
      if (this.options.edge === 'left') {
        menu.classList.add('left-aligned');
        menu.style.transform = 'translateX(-100%)';
        if (dragTarget) dragTarget.style.left = '0';
      } else {
        menu.classList.add('right-aligned');
        menu.style.transform = 'translateX(100%)';
        if (dragTarget) dragTarget.style.right = '0';
      }
      
      // حالة الـ fixed
      this.isFixed = menu.classList.contains('fixed');
      if (this.isFixed) {
        if (window.innerWidth > 992) {
          menu.style.transform = 'translateX(0)';
          this.menuOut = true;
        }
      }
  
      this._setupEventHandlers();
    };
    
    SideNav.prototype._isCurrentlyFixed = function() {
      return this.isFixed && window.innerWidth > 992;
    };
    
    SideNav.prototype._setupEventHandlers = function() {
      const self = this;
      
      // معالجة تغيير حجم النافذة
      if (this.isFixed) {
        this._handleWindowResizeBound = this._handleWindowResize.bind(this);
        window.addEventListener('resize', this._handleWindowResizeBound);
      }
      
      // إذا closeOnClick مفعل نضيف حدث إغلاق عند الضغط على الروابط
      if (this.options.closeOnClick === true) {
        this._handleMenuClickBound = this._handleMenuClick.bind(this);
        this.menu.addEventListener('click', this._handleMenuClickBound);
      }
      
      // معالجة النقر على العنصر المفعّل (activator)
      this._handleActivatorClickBound = this._handleActivatorClick.bind(this);
      this.elem.addEventListener('click', this._handleActivatorClickBound);
      
      // معالجة أحداث السحب
      if (this.options.draggable && this.dragTarget) {
        this._handleDragTargetClickBound = () => {
          if (this.menuOut) this.close();
        };
        this.dragTarget.addEventListener('click', this._handleDragTargetClickBound);
        
        // أحداث اللمس للسحب
        this._handleDragTargetDragBound = this._handleDragTargetDrag.bind(this);
        this._handleDragTargetReleaseBound = this._handleDragTargetRelease.bind(this);
        this._handleCloseDragBound = this._handleCloseDrag.bind(this);
        this._handleCloseReleaseBound = this._handleCloseRelease.bind(this);
        
        this.dragTarget.addEventListener('touchstart', this._startDrag.bind(this));
        this.dragTarget.addEventListener('touchmove', this._handleDragTargetDragBound);
        this.dragTarget.addEventListener('touchend', this._handleDragTargetReleaseBound);
        
        // أحداث إضافية للمنطقة المتراكبة والقائمة
        this._handleCloseTriggerClickBound = this._handleCloseTriggerClick.bind(this);
        this.menu.addEventListener('touchmove', this._handleCloseDragBound);
        this.menu.addEventListener('touchend', this._handleCloseReleaseBound);
        this.menu.addEventListener('click', this._handleCloseTriggerClickBound);
      }
    };
    
    SideNav.prototype._removeEventHandlers = function() {
      if (this.isFixed && this._handleWindowResizeBound) {
        window.removeEventListener('resize', this._handleWindowResizeBound);
      }
      
      if (this._handleMenuClickBound) {
        this.menu.removeEventListener('click', this._handleMenuClickBound);
      }
      
      this.elem.removeEventListener('click', this._handleActivatorClickBound);
      
      if (this.options.draggable && this.dragTarget) {
        this.dragTarget.removeEventListener('click', this._handleDragTargetClickBound);
        this.dragTarget.removeEventListener('touchstart', this._startDrag.bind(this));
        this.dragTarget.removeEventListener('touchmove', this._handleDragTargetDragBound);
        this.dragTarget.removeEventListener('touchend', this._handleDragTargetReleaseBound);
        
        this.menu.removeEventListener('touchmove', this._handleCloseDragBound);
        this.menu.removeEventListener('touchend', this._handleCloseReleaseBound);
        this.menu.removeEventListener('click', this._handleCloseTriggerClickBound);
      }
    };
    
    SideNav.prototype._handleWindowResize = function() {
      // فقط معالجة تغييرات العرض الأفقية
      if (window.innerWidth > 992) {
        if (this.menuOut) {
          this.menu.style.transform = 'translateX(0)';
        } else {
          this.open();
        }
      } else if (!this.menuOut) {
        if (this.options.edge === 'left') {
          this.menu.style.transform = 'translateX(-100%)';
        } else {
          this.menu.style.transform = 'translateX(100%)';
        }
      }
    };
    
    SideNav.prototype._handleMenuClick = function(e) {
      let target = e.target;
      if (target.tagName.toLowerCase() === 'a' && !target.classList.contains('collapsible-header')) {
        if (!(window.innerWidth > 992 && this.isFixed)) {
          this.close();
        }
      }
    };
    
    SideNav.prototype._handleCloseTriggerClick = function(e) {
      let $closeTrigger = e.target.closest('.sidenav-close');
      if ($closeTrigger && !this._isCurrentlyFixed()) {
        this.close();
      }
    };
    
    SideNav.prototype._handleActivatorClick = function(e) {
      e.preventDefault();
      if (this.menuOut) {
        this.close();
      } else {
        this.open();
      }
    };
    
    // ميزة جديدة: بدء السحب وضبط متغيرات بدء السحب
    SideNav.prototype._startDrag = function(e) {
      if (!this.options.draggable || this._isCurrentlyFixed()) return;
      
      const touch = e.touches[0];
      if (e.touches.length === 1) {
        this.isDragged = true;
        this._startingXpos = touch.clientX;
        this._xPos = this._startingXpos;
        this._time = Date.now();
        this._verticallyScrolling = false;
        
        // تعطيل التمرير
        const oldWidth = document.body.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.width = oldWidth + "px";
      }
    };
    
    // معالجة حركة السحب
    SideNav.prototype._handleDragTargetDrag = function(e) {
      // التحقق مما إذا كان يمكن السحب
      if (!this.options.draggable || this._isCurrentlyFixed() || this._verticallyScrolling) {
        return;
      }
      
      // إذا لم يكن يتم سحبه، قم بتعيين متغيرات بدء السحب
      if (!this.isDragged) {
        this._startDrag(e);
      }
      
      // تحديث متغيرات الحركة
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      
      this.deltaX = Math.abs(this._xPos - currentX);
      this._xPos = currentX;
      this.velocityX = this.deltaX / (Date.now() - this._time);
      this._time = Date.now();
      
      // التحقق من التمرير العمودي
      if (currentScrollTop !== this._initialScrollTop) {
        this._verticallyScrolling = true;
        return;
      }
      
      e.preventDefault();
      
      // حساب deltaX الإجمالي
      let totalDeltaX = this._xPos - this._startingXpos;
      
      // اتجاه السحب هو اتجاه سحب المستخدم المحاول
      const dragDirection = totalDeltaX > 0 ? 'right' : 'left';
      
      // لا تسمح لـ totalDeltaX بتجاوز عرض SideNav أو السحب في الاتجاه المعاكس
      totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
      if (this.options.edge === dragDirection) {
        totalDeltaX = 0;
      }
      
      // إنشاء overlay إذا لم يكن موجودًا
      let overlay = document.getElementById('sidenav-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidenav-overlay';
        overlay.style.opacity = '0';
        overlay.addEventListener('click', () => this.close());
        document.body.appendChild(overlay);
        this._overlay = overlay;
      }
      
      // حساب نسبة الفتح
      this.percentOpen = Math.min(1, totalDeltaX / this._width);
      
      // تعيين أنماط التحويل والشفافية
      if (this.options.edge === 'left') {
        let transformX = totalDeltaX - this._width;
        // التحقق من الحدود
        if (transformX > 0) transformX = 0;
        
        this.menu.style.transform = `translateX(${transformX}px)`;
        overlay.style.opacity = this.percentOpen;
      } else {
        // للحافة اليمنى
        let transformX = this._width - totalDeltaX;
        if (transformX < 0) transformX = 0;
        
        this.menu.style.transform = `translateX(${window.innerWidth - transformX}px)`;
        overlay.style.opacity = this.percentOpen;
      }
    };
    
    SideNav.prototype._handleCloseDrag = function(e) {
      if (this.menuOut) {
        // التحقق مما إذا كان يمكن السحب
        if (!this.options.draggable || this._isCurrentlyFixed() || this._verticallyScrolling) {
          return;
        }
        
        // إذا لم يكن يتم سحبه، قم بتعيين متغيرات بدء السحب
        if (!this.isDragged) {
          const touch = e.touches[0];
          this.isDragged = true;
          this._startingXpos = touch.clientX;
          this._xPos = this._startingXpos;
          this._time = Date.now();
          this._verticallyScrolling = false;
        }
        
        // تحديث متغيرات الحركة
        const touch = e.touches[0];
        const currentX = touch.clientX;
        
        this.deltaX = Math.abs(this._xPos - currentX);
        this._xPos = currentX;
        this.velocityX = this.deltaX / (Date.now() - this._time);
        this._time = Date.now();
        
        e.preventDefault();
        
        // حساب deltaX الإجمالي
        let totalDeltaX = this._startingXpos - this._xPos;
        
        // اتجاه السحب
        const dragDirection = totalDeltaX > 0 ? 'right' : 'left';
        
        totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
        if (this.options.edge !== dragDirection) {
          totalDeltaX = 0;
        }
        
        let transformX;
        const overlay = document.getElementById('sidenav-overlay');
        
        if (this.options.edge === 'left') {
          transformX = -totalDeltaX;
          this.menu.style.transform = `translateX(${transformX}px)`;
        } else {
          transformX = totalDeltaX;
          this.menu.style.transform = `translateX(${window.innerWidth - this._width + transformX}px)`;
        }
        
        // حساب نسبة الفتح
        this.percentOpen = Math.max(0, 1 - totalDeltaX / this._width);
        
        // تعيين شفافية الـ overlay
        if (overlay) {
          overlay.style.opacity = this.percentOpen;
        }
      }
    };
    
    SideNav.prototype._handleDragTargetRelease = function() {
      if (this.isDragged) {
        if (this.percentOpen > 0.2) {
          this.open();
        } else {
          this.close();
        }
        
        this.isDragged = false;
        this._verticallyScrolling = false;
      }
    };
    
    SideNav.prototype._handleCloseRelease = function() {
      if (this.menuOut && this.isDragged) {
        if (this.percentOpen > 0.8) {
          this.open();
        } else {
          this.close();
        }
        
        this.isDragged = false;
        this._verticallyScrolling = false;
      }
    };
    
    SideNav.prototype._enableBodyScrolling = function() {
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
    
    SideNav.prototype._preventBodyScrolling = function() {
      const oldWidth = document.body.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.width = oldWidth + "px";
    };
    
    SideNav.prototype.open = function() {
      if (this.menuOut === true) return;
      
      if (typeof this.options.onOpen === 'function') {
        this.options.onOpen.call(this.menu);
      }
      
      this.menuOut = true;
      
      // التعامل مع SideNav الثابت
      if (this._isCurrentlyFixed()) {
        this.menu.style.transform = 'translateX(0)';
        this._enableBodyScrolling();
        return;
      }
      
      // منع التمرير
      this._preventBodyScrolling();
      
      // إنشاء overlay إذا لم يكن موجودًا
      let overlay = document.getElementById('sidenav-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidenav-overlay';
        overlay.style.opacity = '0';
        overlay.addEventListener('click', () => this.close());
        document.body.appendChild(overlay);
      }
      
      // إعداد منطقة السحب
      if (this.options.draggable && this.dragTarget) {
        if (this.options.edge === 'left') {
          this.dragTarget.style.width = '50%';
          this.dragTarget.style.right = '0';
          this.dragTarget.style.left = '';
        } else {
          this.dragTarget.style.width = '50%';
          this.dragTarget.style.right = '';
          this.dragTarget.style.left = '0';
        }
      }
      
      // الرسوم المتحركة بناءً على حالة السحب
      if (!this.isDragged || this.percentOpen !== 1) {
        animateStyles(this.menu, { transform: 'translateX(0)' }, this.options.inDuration, 'ease-out');
        animateStyles(overlay, { opacity: '1' }, this.options.inDuration, 'ease-out');
      }
    };
    
    SideNav.prototype.close = function() {
      if (this.menuOut === false) return;
      
      if (typeof this.options.onClose === 'function') {
        this.options.onClose.call(this.menu);
      }
      
      this.menuOut = false;
      
      // التعامل مع SideNav الثابت
      if (this._isCurrentlyFixed()) {
        const transformX = this.options.edge === 'left' ? '-105%' : '105%';
        this.menu.style.transform = `translateX(${transformX})`;
        return;
      }
      
      // تمكين التمرير
      this._enableBodyScrolling();
      
      // الحصول على الـ overlay
      const overlay = document.getElementById('sidenav-overlay');
      
      // الرسوم المتحركة للغلق بناءً على حالة السحب
      if (!this.isDragged || this.percentOpen !== 0) {
        const transformValue = this.options.edge === 'left' ? '-100%' : '100%';
        animateStyles(this.menu, { transform: `translateX(${transformValue})` }, this.options.outDuration, 'ease-out');
        
        if (overlay) {
          animateStyles(overlay, { opacity: '0' }, this.options.outDuration, 'ease-out', function() {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          });
        }
        
        if (this.dragTarget) {
          if (this.options.edge === 'left') {
            this.dragTarget.style.width = '10px';
            this.dragTarget.style.right = '';
            this.dragTarget.style.left = '0';
          } else {
            this.dragTarget.style.width = '10px';
            this.dragTarget.style.right = '0';
            this.dragTarget.style.left = '';
          }
        }
      } else if (overlay) {
        overlay.style.display = 'none';
      }
    };
    
    SideNav.prototype.destroy = function() {
      this._removeEventHandlers();
      this._enableBodyScrolling();
      
      const menuId = this.elem.getAttribute('data-activates');
      const overlay = document.getElementById('sidenav-overlay');
      const dragTarget = document.querySelector(`.drag-target[data-sidenav="${menuId}"]`);
      
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (dragTarget && dragTarget.parentNode) dragTarget.parentNode.removeChild(dragTarget);
      
      this.menu.style.transform = '';
      this.elem.M_SideNav = undefined;
    };
    
    SideNav.prototype.show = function() {
      this.open();
    };
    
    SideNav.prototype.hide = function() {
      this.close();
    };
  
    // تعريض الكائن كخاصية عالمية
    window.SideNav = SideNav;
  })();/*Waves*/
if(WavesAllow)!function(t){let e={},n=document.querySelectorAll.bind(document);function i(t){let e="";for(let n in t)t.hasOwnProperty(n)&&(e+=n+":"+t[n]+";");return e}let a={duration:750,show:function(t,e){if(2===t.button)return!1;let n=e||this,o=document.createElement("div");o.className="waves-ripple",n.appendChild(o);let r={top:0,left:0},s=n&&n.ownerDocument,u=s.documentElement;void 0!==n.getBoundingClientRect&&(r=n.getBoundingClientRect());let l=s===s.window?s:9===s.nodeType&&s.defaultView,c={top:r.top+l.pageYOffset-u.clientTop,left:r.left+l.pageXOffset-u.clientLeft},d=t.pageY-c.top,f=t.pageX-c.left,m="scale("+n.clientWidth/100*10+")";"touches"in t&&(d=t.touches[0].pageY-c.top,f=t.touches[0].pageX-c.left),o.setAttribute("data-hold",Date.now()),o.setAttribute("data-scale",m),o.setAttribute("data-x",f),o.setAttribute("data-y",d);let p={top:d+"px",left:f+"px"};o.className+=" waves-notransition",o.setAttribute("style",i(p)),o.className=o.className.replace("waves-notransition",""),p["-webkit-transform"]=m,p["-moz-transform"]=m,p["-ms-transform"]=m,p["-o-transform"]=m,p.transform=m,p.opacity="1",p["-webkit-transition-duration"]=a.duration+"ms",p["-moz-transition-duration"]=a.duration+"ms",p["-o-transition-duration"]=a.duration+"ms",p["transition-duration"]=a.duration+"ms",p["-webkit-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",p["-moz-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",p["-o-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",p["transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",o.setAttribute("style",i(p))},hide:function(t){o.touchup(t);let e=this,n=e.getElementsByClassName("waves-ripple");if(0===n.length)return!1;let r=n[n.length-1],s=r.getAttribute("data-x"),u=r.getAttribute("data-y"),l=r.getAttribute("data-scale"),c=Date.now()-Number(r.getAttribute("data-hold")),d=350-c;d<0&&(d=0),setTimeout(function(){let t={top:u+"px",left:s+"px",opacity:"0","-webkit-transition-duration":a.duration+"ms","-moz-transition-duration":a.duration+"ms","-o-transition-duration":a.duration+"ms","transition-duration":a.duration+"ms","-webkit-transform":l,"-moz-transform":l,"-ms-transform":l,"-o-transform":l,transform:l};r.setAttribute("style",i(t)),setTimeout(function(){try{e.removeChild(r)}catch(t){return!1}},a.duration)},d)},wrapInput:function(t){for(let e=0;e<t.length;e++){let n=t[e];if("input"===n.tagName.toLowerCase()){let i=n.parentNode;if("i"===i.tagName.toLowerCase()&&-1!==i.className.indexOf("waves-effect"))continue;let a=document.createElement("i");a.className=n.className+" waves-input-wrapper";let o=n.getAttribute("style");o=o||"",a.setAttribute("style",o),n.className="waves-button-input",n.removeAttribute("style"),i.replaceChild(a,n),a.appendChild(n)}}}},o={touches:0,allowEvent:function(t){let e=!0;return"touchstart"===t.type?o.touches+=1:"touchend"===t.type||"touchcancel"===t.type?setTimeout(function(){o.touches>0&&(o.touches-=1)},500):"mousedown"===t.type&&o.touches>0&&(e=!1),e},touchup:function(t){o.allowEvent(t)}};function r(e){let n=function t(e){if(!1===o.allowEvent(e))return null;let n=null,i=e.target||e.srcElement;for(;null!==i.parentNode;){if(!(i instanceof SVGElement)&&-1!==i.className.indexOf("waves-effect")){n=i;break}i=i.parentNode}return n}(e);null!==n&&(a.show(e,n),"ontouchstart"in t&&(n.addEventListener("touchend",a.hide,!1),n.addEventListener("touchcancel",a.hide,!1)),n.addEventListener("mouseup",a.hide,!1),n.addEventListener("mouseleave",a.hide,!1),n.addEventListener("dragend",a.hide,!1))}e.displayEffect=function(e){"duration"in(e=e||{})&&(a.duration=e.duration),a.wrapInput(n(".waves-effect")),"ontouchstart"in t&&document.body.addEventListener("touchstart",r,!1),document.body.addEventListener("mousedown",r,!1)},e.attach=function(e){"input"===e.tagName.toLowerCase()&&(a.wrapInput([e]),e=e.parentNode),"ontouchstart"in t&&e.addEventListener("touchstart",r,!1),e.addEventListener("mousedown",r,!1)},t.Waves=e,e.displayEffect()}(window);else{let t=document.querySelectorAll("body *");for(let e of t)hasClass(e,"waves-effect")&&e.classList.remove("waves-effect"),hasClass(e,"waves-light")&&e.classList.remove("waves-light")}
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
function Drawer() {
const sideNavs = document.querySelectorAll('.drawer-btn');
for (let i = 0; i < sideNavs.length; i++) {
const nav = sideNavs[i],
mySidenav = new SideNav(nav, {
menuWidth: 300,
draggable: true
});
document.addEventListener("click", function (event) {
if (!(event.target instanceof Element)) return;
const el = event.target.closest(".drawer-close");
if (!el) return;
mySidenav.hide();
});
}
}
