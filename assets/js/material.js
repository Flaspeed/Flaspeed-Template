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
      edge: BlogDirection === 'rtl' ? 'right' : 'left',
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
      this.init();
    }
  
    SideNav.prototype.init = function() {
      const self = this;
      const activator = this.elem;
      const menuId = activator.getAttribute('data-activates');
      const menu = document.getElementById(menuId);
      if (!menu) return;
      
      // تعيين عرض القائمة
      if (this.options.menuWidth != 300) {
        menu.style.width = this.options.menuWidth + "px";
      }
      
      // متغيرات الحالة المحسنة
      this.isDragged = false;        // يتتبع ما إذا كان السحب نشطًا
      this.percentOpen = 0;          // نسبة فتح القائمة (0-1)
      this.menuWidth = this.options.menuWidth;
      this.startingXpos = 0;         // موقع X الأولي عند بدء السحب
      this.xPos = 0;                 // موقع X الحالي أثناء السحب
      this.time = 0;                 // الوقت للحساب السرعة
      this.velocityX = 0;            // سرعة السحب
      this.deltaX = 0;               // المسافة المسحوبة
      this._verticallyScrolling = false; // لتتبع التمرير الرأسي
      
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
        this.dragTarget = dragTarget;
      } else {
        this.dragTarget = null;
      }
      
      // تعيين الموضع الابتدائي بناءً على الحافة (left/right)
      if (this.options.edge === 'left') {
        menu.classList.add('left-aligned');
        menu.style.transform = 'translateX(-100%)';
        if (this.dragTarget) this.dragTarget.style.left = '0';
      } else {
        menu.classList.add('right-aligned');
        menu.style.transform = 'translateX(100%)';
        if (this.dragTarget) this.dragTarget.style.right = '0';
      }
      
      // حالة الـ fixed
      this.isFixed = menu.classList.contains('fixed');
      if (this.isFixed) {
        if (window.innerWidth > 992) {
          menu.style.transform = 'translateX(0)';
        }
      }
  
      // حالات القائمة
      this.menuOut = false;
      this.menu = menu;
      
      // إذا closeOnClick مفعل نضيف حدث إغلاق عند الضغط على الروابط
      this._setupCloseOnClick();
      
      // إعداد أحداث السحب المحسنة
      this._setupDragEvents();
      
      // إعداد أحداث تغيير حجم النافذة
      this._setupResizeEvents();
      
      // إعداد حدث النقر على المفعل
      this._setupActivatorClick();
    };
    
    SideNav.prototype._setupCloseOnClick = function() {
      if (this.options.closeOnClick === true) {
        this.menu.addEventListener('click', (e) => {
          let target = e.target;
          if (target.tagName.toLowerCase() === 'a' && !target.classList.contains('collapsible-header')) {
            if (!(window.innerWidth > 992 && this.isFixed)) {
              this.close();
            }
          }
        });
      }
    };
    
    SideNav.prototype._setupResizeEvents = function() {
      if (this.isFixed) {
        window.addEventListener('resize', () => {
          if (window.innerWidth > 992) {
            if (document.getElementById('sidenav-overlay') && this.menuOut) {
              this.close(true);
            } else {
              this.menu.style.transform = 'translateX(0)';
            }
          } else if (!this.menuOut) {
            if (this.options.edge === 'left') {
              this.menu.style.transform = 'translateX(-100%)';
            } else {
              this.menu.style.transform = 'translateX(100%)';
            }
          }
        });
      }
    };
    
    SideNav.prototype._setupActivatorClick = function() {
      this.elem.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.menuOut === true) {
          this.close();
        } else {
          this.open();
        }
      });
    };
    
    SideNav.prototype._setupDragEvents = function() {
      if (!this.options.draggable || !this.dragTarget) return;
      
      // كائن للتتبع حالة اللمس
      const touchTracker = {
        touching: false,
        initialY: 0
      };
      
      // حدث النقر على منطقة السحب
      this.dragTarget.addEventListener('click', () => {
        if (this.menuOut) this.close();
      });
      
      // أحداث اللمس المحسنة
      this.dragTarget.addEventListener('touchstart', (e) => {
        this._handleDragTargetStart(e, touchTracker);
      });
      
      this.dragTarget.addEventListener('touchmove', (e) => {
        this._handleDragTargetMove(e, touchTracker);
      });
      
      this.dragTarget.addEventListener('touchend', (e) => {
        this._handleDragTargetRelease(e, touchTracker);
      });
      
      // إضافة أحداث للقائمة نفسها لإدارة الإغلاق بالسحب
      if (this.options.edge === 'left') {
        this.menu.addEventListener('touchstart', (e) => {
          this._handleMenuStart(e, touchTracker);
        });
        
        this.menu.addEventListener('touchmove', (e) => {
          this._handleMenuMove(e, touchTracker);
        });
        
        this.menu.addEventListener('touchend', (e) => {
          this._handleMenuRelease(e, touchTracker);
        });
      }
    };
    
    // معالجة بدء السحب على منطقة السحب
    SideNav.prototype._handleDragTargetStart = function(e, touchTracker) {
      if (e.touches.length !== 1) return;
      
      // تعيين متغيرات بدء السحب
      this._startDrag(e, touchTracker);
    };
    
    // معالجة السحب المستمر على منطقة السحب
    SideNav.prototype._handleDragTargetMove = function(e, touchTracker) {
      if (!touchTracker.touching) return;
      
      // تحديث معلومات السحب
      this._dragMoveUpdate(e);
      
      // منع التمرير العمودي إذا كان السحب أفقيًا
      if (Math.abs(this.deltaX) > 10 && !this._verticallyScrolling) {
        e.preventDefault();
        
        // تعطيل التمرير
        const oldWidth = document.body.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.width = oldWidth + "px";
        
        // إنشاء أو تحديث الـ overlay
        this._setupOrUpdateOverlay();
        
        // حساب الموضع الجديد بناءً على الحافة
        if (this.options.edge === 'left') {
          this._handleLeftEdgeDrag();
        } else {
          this._handleRightEdgeDrag();
        }
      } else {
        // التحقق إذا كان التمرير رأسيًا
        const deltaY = Math.abs(e.touches[0].clientY - touchTracker.initialY);
        if (deltaY > 10) {
          this._verticallyScrolling = true;
        }
      }
    };
    
    // معالجة إفراج السحب على منطقة السحب
    SideNav.prototype._handleDragTargetRelease = function(e, touchTracker) {
      if (!touchTracker.touching) return;
      touchTracker.touching = false;
      
      // قرار ما إذا كان سيتم فتح أو إغلاق القائمة بناءً على السرعة والمسافة
      if (this.isDragged) {
        if (this.percentOpen > 0.3 || this.velocityX > 0.3) {
          this.open();
        } else {
          this.close();
        }
        
        this.isDragged = false;
        this._verticallyScrolling = false;
      }
    };
    
    // معالجة بدء السحب على القائمة نفسها
    SideNav.prototype._handleMenuStart = function(e, touchTracker) {
      if (e.touches.length !== 1 || !this.menuOut) return;
      
      // تعيين متغيرات بدء السحب
      this._startDrag(e, touchTracker);
    };
    
    // معالجة السحب المستمر على القائمة
    SideNav.prototype._handleMenuMove = function(e, touchTracker) {
      if (!touchTracker.touching || !this.menuOut) return;
      
      // تحديث معلومات السحب
      this._dragMoveUpdate(e);
      
      // منع التمرير العمودي إذا كان السحب أفقيًا
      if (Math.abs(this.deltaX) > 10 && !this._verticallyScrolling) {
        e.preventDefault();
        
        // حساب الموضع الجديد بناءً على الحافة
        if (this.options.edge === 'left') {
          // حساب النسبة المئوية للإغلاق
          let translateX = this.xPos - this.startingXpos;
          if (translateX > 0) translateX = 0;
          this.percentOpen = 1 + translateX / this.menuWidth;
          
          // تحديث موضع القائمة والشفافية
          this.menu.style.transform = `translateX(${translateX}px)`;
          const overlay = document.getElementById('sidenav-overlay');
          if (overlay) overlay.style.opacity = this.percentOpen;
        } else {
          // حساب وتطبيق مشابه للحافة اليمنى
          let translateX = this.xPos - this.startingXpos;
          if (translateX < 0) translateX = 0;
          this.percentOpen = 1 - translateX / this.menuWidth;
          
          // تحديث موضع القائمة والشفافية
          this.menu.style.transform = `translateX(${this.menuWidth - translateX}px)`;
          const overlay = document.getElementById('sidenav-overlay');
          if (overlay) overlay.style.opacity = this.percentOpen;
        }
      } else {
        // التحقق إذا كان التمرير رأسيًا
        const deltaY = Math.abs(e.touches[0].clientY - touchTracker.initialY);
        if (deltaY > 10) {
          this._verticallyScrolling = true;
        }
      }
    };
    
    // معالجة إفراج السحب على القائمة
    SideNav.prototype._handleMenuRelease = function(e, touchTracker) {
      if (!touchTracker.touching || !this.menuOut) return;
      touchTracker.touching = false;
      
      // قرار ما إذا كان سيتم فتح أو إغلاق القائمة بناءً على النسبة المئوية
      if (this.isDragged) {
        if (this.percentOpen < 0.7) {
          this.close();
        } else {
          this.open();
        }
        
        this.isDragged = false;
        this._verticallyScrolling = false;
      }
    };
    
    // دالة مساعدة لبدء السحب
    SideNav.prototype._startDrag = function(e, touchTracker) {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      
      this.isDragged = true;
      this.startingXpos = clientX;
      this.xPos = this.startingXpos;
      this.time = Date.now();
      touchTracker.touching = true;
      touchTracker.initialY = clientY;
      this._verticallyScrolling = false;
    };
    
    // دالة مساعدة لتحديث معلومات السحب
    SideNav.prototype._dragMoveUpdate = function(e) {
      const clientX = e.touches[0].clientX;
      
      // حساب المسافة والسرعة
      this.deltaX = Math.abs(this.xPos - clientX);
      this.xPos = clientX;
      this.velocityX = this.deltaX / (Date.now() - this.time);
      this.time = Date.now();
    };
    
    // دالة مساعدة للتعامل مع السحب من الحافة اليسرى
    SideNav.prototype._handleLeftEdgeDrag = function() {
      let translateX = this.xPos - this.startingXpos;
      // تقييد translateX بين 0 و menuWidth
      if (translateX > this.menuWidth) translateX = this.menuWidth;
      if (translateX < 0) translateX = 0;
      
      // حساب النسبة المئوية للفتح
      this.percentOpen = translateX / this.menuWidth;
      
      // تحديث موضع القائمة
      this.menu.style.transform = `translateX(${translateX - this.menuWidth}px)`;
      
      // تحديث شفافية الـ overlay
      const overlay = document.getElementById('sidenav-overlay');
      if (overlay) overlay.style.opacity = this.percentOpen;
    };
    
    // دالة مساعدة للتعامل مع السحب من الحافة اليمنى
    SideNav.prototype._handleRightEdgeDrag = function() {
      const windowWidth = window.innerWidth;
      let translateX = windowWidth - this.xPos;
      
      // تقييد translateX بين 0 و menuWidth
      if (translateX > this.menuWidth) translateX = this.menuWidth;
      if (translateX < 0) translateX = 0;
      
      // حساب النسبة المئوية للفتح
      this.percentOpen = translateX / this.menuWidth;
      
      // تحديث موضع القائمة
      this.menu.style.transform = `translateX(${windowWidth - translateX}px)`;
      
      // تحديث شفافية الـ overlay
      const overlay = document.getElementById('sidenav-overlay');
      if (overlay) overlay.style.opacity = this.percentOpen;
    };
    
    // إعداد أو تحديث الـ overlay
    SideNav.prototype._setupOrUpdateOverlay = function() {
      let overlay = document.getElementById('sidenav-overlay');
      
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidenav-overlay';
        overlay.style.opacity = '0';
        
        overlay.addEventListener('click', () => {
          this.close();
        });
        
        document.body.appendChild(overlay);
        
        // تشغيل استدعاء onOpen
        if (typeof this.options.onOpen === 'function') {
          this.options.onOpen.call(this.menu);
        }
      }
      
      return overlay;
    };
    
    // فتح القائمة الجانبية
    SideNav.prototype.open = function() {
      if (this.menuOut === true) return;
      
      // تعطيل التمرير
      const oldWidth = document.body.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.width = oldWidth + "px";
      
      // إعداد العناصر للعرض
      const overlay = this._setupOrUpdateOverlay();
      
      // تعيين أبعاد منطقة السحب
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
      
      // الرسوم المتحركة لفتح القائمة
      animateStyles(this.menu, { transform: 'translateX(0)' }, this.options.inDuration, 'ease-out');
      animateStyles(overlay, { opacity: '1' }, this.options.inDuration, 'ease-out', () => {
        this.menuOut = true;
      });
      
      // تشغيل استدعاء onOpen إذا لم يتم تشغيله عند إنشاء الـ overlay
      if (typeof this.options.onOpen === 'function' && !document.getElementById('sidenav-overlay')) {
        this.options.onOpen.call(this.menu);
      }
    };
    
    // إغلاق القائمة الجانبية
    SideNav.prototype.close = function(restoreNav) {
      if (this.menuOut === false) return;
      
      this.menuOut = false;
      
      // إعادة تمكين التمرير
      document.body.style.overflow = '';
      document.body.style.width = '';
      
      // الحصول على الـ overlay
      const overlay = document.getElementById('sidenav-overlay');
      
      // إخفاء الـ overlay
      if (overlay) {
        animateStyles(overlay, { opacity: '0' }, this.options.outDuration, 'ease-out', function() {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        });
      }
      
      // تعيين أبعاد منطقة السحب وتحريك القائمة
      if (this.options.edge === 'left') {
        if (this.dragTarget) {
          this.dragTarget.style.width = '';
          this.dragTarget.style.right = '';
          this.dragTarget.style.left = '0';
        }
        
        animateStyles(this.menu, { transform: 'translateX(-100%)' }, this.options.outDuration, 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', () => {
          if (restoreNav === true) {
            this.menu.removeAttribute('style');
            this.menu.style.width = this.options.menuWidth + "px";
          }
          
          if (typeof this.options.onClose === 'function') {
            this.options.onClose.call(this.menu);
          }
        });
      } else {
        if (this.dragTarget) {
          this.dragTarget.style.width = '';
          this.dragTarget.style.right = '0';
          this.dragTarget.style.left = '';
        }
        
        animateStyles(this.menu, { transform: 'translateX(100%)' }, this.options.outDuration, 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', () => {
          if (restoreNav === true) {
            this.menu.removeAttribute('style');
            this.menu.style.width = this.options.menuWidth + "px";
          }
          
          if (typeof this.options.onClose === 'function') {
            this.options.onClose.call(this.menu);
          }
        });
      }
    };
    
    // عرض القائمة الجانبية
    SideNav.prototype.show = function() {
      this.open();
    };
    
    // إخفاء القائمة الجانبية
    SideNav.prototype.hide = function() {
      this.close();
    };
    
    // تدمير مكون القائمة الجانبية
    SideNav.prototype.destroy = function() {
      const menuId = this.elem.getAttribute('data-activates');
      const overlay = document.getElementById('sidenav-overlay');
      const dragTarget = document.querySelector(`.drag-target[data-sidenav="${menuId}"]`);
      
      // إزالة أحداث السحب
      if (this.options.draggable && dragTarget) {
        dragTarget.removeEventListener('touchstart', this._handleDragTargetStart);
        dragTarget.removeEventListener('touchmove', this._handleDragTargetMove);
        dragTarget.removeEventListener('touchend', this._handleDragTargetRelease);
        
        if (dragTarget.parentNode) {
          dragTarget.parentNode.removeChild(dragTarget);
        }
      }
      
      // إغلاق القائمة إذا كانت مفتوحة
      if (overlay) {
        overlay.click();
      }
      
      // إزالة مرجع Sidenav من العنصر
      this.elem._sidenav = null;
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
