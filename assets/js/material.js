// Vanilla JS Tooltip Plugin
if(!isMobileTooltip){!function(){function t(t,i){Object.assign(t.style,i)}function i(t,i,e,o){let s=t.getBoundingClientRect(),l=i.getBoundingClientRect(),h=e.getBoundingClientRect();return function t(i,e,o,s){let l=window.innerWidth,h=window.innerHeight,n=0,r=0,a="0px",p="0px",d={};switch(s){case"top":r=i.top-e.height,n=i.left+i.width/2-e.width/2,p="-10px",d={bottom:"0",left:"0",borderRadius:"14px 14px 0 0",transformOrigin:"50% 100%",marginTop:`${e.height}px`,marginLeft:`${e.width/2-o.width/2}px`};break;case"left":r=i.top+i.height/2-e.height/2,n=i.left-e.width,a="-10px",d={top:"-7px",right:"0",width:"14px",height:"14px",borderRadius:"14px 0 0 14px",transformOrigin:"95% 50%",marginTop:`${e.height/2}px`,marginLeft:`${e.width}px`};break;case"right":r=i.top+i.height/2-e.height/2,n=i.left+i.width,a="+10px",d={top:"-7px",left:"0",width:"14px",height:"14px",borderRadius:"0 14px 14px 0",transformOrigin:"5% 50%",marginTop:`${e.height/2}px`,marginLeft:"0px"};break;default:r=i.top+i.height,n=i.left+i.width/2-e.width/2,p="+10px",d={top:"0",left:"0",marginLeft:`${e.width/2-o.width/2}px`}}return{left:n=Math.max(4,Math.min(n,l-e.width-4)),top:r=Math.max(4,Math.min(r,h-e.height-4)),translateX:a,translateY:p,backdropStyles:d}}(s,l,h,o)}class e{constructor(t={}){this.options=Object.assign({delay:350,tooltip:"",position:"bottom",html:!1},t),this.isVisible=!1,this.isHovering=!1,this.targetEl=null,this.tooltipEl=null,this.backdropEl=null,this.hoverTimeout=null,this.currentBackdropStyles={},this.scrolling=!1,this.ticking=!1,this.animationFrame=null,this.handleScroll=this.handleScroll.bind(this),this.handleResize=this.handleResize.bind(this),this.showTooltip=this.showTooltip.bind(this),this.hideTooltip=this.hideTooltip.bind(this),this.onPointerEnter=this.onPointerEnter.bind(this),this.onPointerLeave=this.onPointerLeave.bind(this),this.repositionTooltip=this.repositionTooltip.bind(this)}init(t){if(this.targetEl=t,t.getAttribute("data-tooltip-id")){let i=document.getElementById(t.getAttribute("data-tooltip-id"));i&&i.remove()}let e="flaspeedtooltip-"+Math.random().toString(16).slice(2,14);t.setAttribute("data-tooltip-id",e),this.tooltipEl=document.createElement("div"),this.tooltipEl.className="material-tooltip",this.tooltipEl.id=e,this.tooltipEl.style.margin="0",this.tooltipEl.style.position="fixed",this.tooltipEl.style.visibility="hidden",this.tooltipEl.style.opacity="0";let o=document.createElement("span"),s=this.getTooltipText();return this.isTooltipHtml()?o.innerHTML=s:o.textContent=s,this.backdropEl=document.createElement("div"),this.backdropEl.className="backdrop",this.backdropEl.style.margin="0",this.backdropEl.style.visibility="hidden",this.backdropEl.style.opacity="0",this.tooltipEl.appendChild(o),this.tooltipEl.appendChild(this.backdropEl),document.body.appendChild(this.tooltipEl),this.attachEvents(),this.tooltipEl}getTooltipText(){return this.targetEl.getAttribute("data-tooltip")||this.options.tooltip||this.targetEl.getAttribute("title")||""}isTooltipHtml(){return"true"===this.targetEl.getAttribute("data-html")||this.options.html}getPosition(){return this.targetEl.getAttribute("data-position")||this.options.position}getDelay(){let t=this.targetEl.getAttribute("data-delay");return null!==t&&""!==t?parseInt(t):this.options.delay}attachEvents(){this.targetEl.addEventListener("pointerenter",this.onPointerEnter),this.targetEl.addEventListener("pointerleave",this.onPointerLeave),window.addEventListener("scroll",this.handleScroll,{passive:!0}),window.addEventListener("resize",this.handleResize,{passive:!0})}detachEvents(){this.targetEl.removeEventListener("pointerenter",this.onPointerEnter),this.targetEl.removeEventListener("pointerleave",this.onPointerLeave),window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.handleResize),this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null)}onPointerEnter(t){this.isHovering=!0,this.hoverTimeout&&clearTimeout(this.hoverTimeout),this.hoverTimeout=setTimeout(()=>{this.showTooltip()},this.getDelay())}onPointerLeave(){this.isHovering=!1,this.hoverTimeout&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=null),this.hideTooltip()}showTooltip(){let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h,backdropStyles:n}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.currentBackdropStyles=n,this.tooltipEl.style.visibility="visible",this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.backdropEl.style.visibility="visible",t(this.backdropEl,n);let r=this.tooltipEl.offsetWidth,a=this.tooltipEl.offsetHeight,p=this.backdropEl.offsetWidth,d=this.backdropEl.offsetHeight,E=Math.max(Math.SQRT2*r/p,Math.SQRT2*a/d);this.tooltipEl.style.transition="transform 0.3s, opacity 0.3s",this.backdropEl.style.transition="transform 0.3s, opacity 0.3s",this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,this.tooltipEl.style.opacity="1",this.backdropEl.style.transform=`scale(${E})`,this.backdropEl.style.opacity="1",this.isVisible=!0})}hideTooltip(){this.animationFrame&&cancelAnimationFrame(this.animationFrame),this.animationFrame=requestAnimationFrame(()=>{this.tooltipEl.style.transform="translateY(0) translateX(0)",this.tooltipEl.style.opacity="0",this.backdropEl.style.transform="scale(1)",this.backdropEl.style.opacity="0",setTimeout(()=>{this.isVisible&&(this.tooltipEl.style.visibility="hidden",this.backdropEl.style.visibility="hidden",this.isVisible=!1)},225)}),this.isVisible=!1}repositionTooltip(){if(!this.isVisible)return;let e=this.getPosition(),{left:o,top:s,translateX:l,translateY:h}=i(this.targetEl,this.tooltipEl,this.backdropEl,e);this.tooltipEl.style.left=`${o}px`,this.tooltipEl.style.top=`${s}px`,this.tooltipEl.style.transform=`translateY(${h}) translateX(${l})`,t(this.backdropEl,this.currentBackdropStyles)}handleScroll(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}handleResize(){this.isVisible&&!this.ticking&&(this.ticking=!0,this.animationFrame=requestAnimationFrame(()=>{this.isHovering?this.repositionTooltip():this.hideTooltip(),this.ticking=!1}))}remove(){this.detachEvents(),this.tooltipEl&&this.tooltipEl.parentNode&&this.tooltipEl.parentNode.removeChild(this.tooltipEl),this.targetEl&&this.targetEl.removeAttribute("data-tooltip-id"),this.targetEl=null,this.tooltipEl=null,this.backdropEl=null}}window.VanillaTooltip=function(t,i){if(!t)return null;if("remove"===i){let o=t.getAttribute("data-tooltip-id");if(o){let s=document.getElementById(o);s&&s._tooltip?s._tooltip.remove():s&&s.remove(),t.removeAttribute("data-tooltip-id")}return}let l=new e(i),h=l.init(t);return h._tooltip=l,t}}();};
/*DropMenu*/
function materialEnter(t,e,i){t.style.display="block",t.style.opacity="0",t.style.transform="scale(0.8)",t.style.transition=`transform ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,t.offsetWidth,requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="scale(1)"}),setTimeout(()=>{t.style.transition="","function"==typeof i&&i()},e+20)}function materialExit(t,e,i){t.style.transition=`transform ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${e}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,t.style.opacity="0",t.style.transform="scale(0.8)",setTimeout(()=>{t.style.display="none",t.style.transition="","function"==typeof i&&i()},e)}function initDropdown(t,e={}){if("open"===e)return t.forEach(t=>{let e=new CustomEvent("open");t.dispatchEvent(e)}),!1;if("close"===e)return t.forEach(t=>{let e=new CustomEvent("close");t.dispatchEvent(e)}),!1;let i={inDuration:100,outDuration:100,constrainWidth:!1,hover:!1,gutter:0,belowOrigin:!0,alignment:"rtl"===BlogDirection?"right":"left",stopPropagation:!1};t.forEach(t=>{let n=Object.assign({},i,e),o=!1,s=t.getAttribute("data-target"),a=document.getElementById(s);function r(){void 0!==t.dataset.induration&&(n.inDuration=parseInt(t.dataset.induration)),void 0!==t.dataset.outduration&&(n.outDuration=parseInt(t.dataset.outduration)),void 0!==t.dataset.constrainwidth&&(n.constrainWidth="true"===t.dataset.constrainwidth),void 0!==t.dataset.hover&&(n.hover="true"===t.dataset.hover),void 0!==t.dataset.gutter&&(n.gutter=parseInt(t.dataset.gutter)),void 0!==t.dataset.beloworigin&&(n.belowOrigin="true"===t.dataset.beloworigin),void 0!==t.dataset.alignment&&(n.alignment=t.dataset.alignment),void 0!==t.dataset.stoppropagation&&(n.stopPropagation="true"===t.dataset.stoppropagation)}function l(e){"focus"===e&&(o=!0),r(),a.classList.add("active"),t.classList.add("active");let i=t.getBoundingClientRect().width;!0===n.constrainWidth&&(a.style.width=i+"px"),a.style.display="block",a.style.visibility="hidden",a.style.opacity="0",a.style.transform="scale(0.8)";let s=window.innerWidth,l=window.innerHeight,d=t.clientHeight,p=t.getBoundingClientRect(),u=a.offsetWidth,g=a.offsetHeight,f=n.alignment;"left"===f?p.left+u>s&&(f="right"):"right"===f&&p.right-u<0&&(f="left");let y=0;!0===n.belowOrigin&&(y=d);let $=0,v=t.parentElement;if(v&&v!==document.body&&v.scrollHeight>v.clientHeight&&($=v.scrollTop),p.top+y+g>l){if(p.top+d-g<0){let h=l-p.top-y;a.style.maxHeight=h+"px"}else y||(y+=d),y-=g}a.style.position="absolute",a.style.top=t.offsetTop+y+$+"px","left"===f?(a.style.left="0px",a.style.right="auto",a.style.transformOrigin="top left"):"right"===f?(a.style.right="0px",a.style.left="auto",a.style.transformOrigin="top right"):a.style.transformOrigin="top",a.style.display="none",a.style.visibility="visible",materialEnter(a,n.inDuration,()=>{a.style.height=""}),setTimeout(()=>{document.addEventListener("click",c)},0)}a&&(a.style.display="none",a.style.opacity="0"),r(),a&&t.nextElementSibling!==a&&t.parentNode.insertBefore(a,t.nextElementSibling);let c=function(t){!(t.target.closest("button.sp-btn")||t.target.closest(".sp-btn"))&&(d(),document.removeEventListener("click",c))};function d(){o=!1,materialExit(a,n.outDuration,()=>{a.classList.remove("active"),t.classList.remove("active"),document.removeEventListener("click",c),a.style.maxHeight=""})}if(n.hover){let p=!1;t.removeEventListener("click",clickHandler),t.addEventListener("mouseenter",t=>{!1===p&&(l(),p=!0)}),t.addEventListener("mouseleave",t=>{let e=t.relatedTarget;e&&a.contains(e)||(d(),p=!1)}),a.addEventListener("mouseleave",e=>{let i=e.relatedTarget;i&&t.contains(i)||(d(),p=!1)})}else{let u=function(e){if(!o){if(t!==e.currentTarget||t.classList.contains("active")||e.target.closest(".dropdown-content")){if(t.classList.contains("active")){if(e.target.closest("button.sp-btn")||e.target.closest(".sp-btn"))return;d(),document.removeEventListener("click",c)}}else e.preventDefault(),n.stopPropagation&&e.stopPropagation(),l("click")}};if(a){let g=a.querySelectorAll("button.sp-btn, .sp-btn");g.forEach(t=>{t.addEventListener("click",t=>{})})}t.removeEventListener("click",u),t.addEventListener("click",u)}t.addEventListener("open",t=>{l(t.detail)}),t.addEventListener("close",d)})}NodeList.prototype.dropdown=function(t){return initDropdown(this,t)},HTMLElement.prototype.dropdown=function(t){return initDropdown([this],t)};
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
      if (this.options.menuWidth != 300) {
        menu.style.width = this.options.menuWidth + "px";
      }
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
      if (menu.classList.contains('fixed')) {
        if (window.innerWidth > 992) {
          menu.style.transform = 'translateX(0)';
        }
      }
  
      // متغيرات للحالة
      let panning = false;
      let menuOut = false;
  
      // دالة لإغلاق القائمة
      function removeMenu(restoreNav) {
        panning = false;
        menuOut = false;
        // إعادة تمكين التمرير
        document.body.style.overflow = '';
        document.body.style.width = '';
        const overlay = document.getElementById('sidenav-overlay');
        if (overlay) {
          animateStyles(overlay, { opacity: '0' }, 200, 'ease-out', function() {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          });
        }
        if (self.options.edge === 'left') {
          if (dragTarget) {
            dragTarget.style.width = '';
            dragTarget.style.right = '';
            dragTarget.style.left = '0';
          }
          animateStyles(menu, { transform: 'translateX(-100%)' }, 200, 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', function() {
            if (restoreNav === true) {
              menu.removeAttribute('style');
              menu.style.width = self.options.menuWidth + "px";
            }
            if (typeof self.options.onClose === 'function') {
              self.options.onClose.call(menu);
            }
          });
        } else {
          if (dragTarget) {
            dragTarget.style.width = '';
            dragTarget.style.right = '0';
            dragTarget.style.left = '';
          }
          animateStyles(menu, { transform: 'translateX(100%)' }, 200, 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', function() {
            if (restoreNav === true) {
              menu.removeAttribute('style');
              menu.style.width = self.options.menuWidth + "px";
            }
            if (typeof self.options.onClose === 'function') {
              self.options.onClose.call(menu);
            }
          });
        }
      }
  
      // حدث تغيير حجم النافذة
      if (menu.classList.contains('fixed')) {
        window.addEventListener('resize', function() {
          if (window.innerWidth > 992) {
            if (document.getElementById('sidenav-overlay') && menuOut) {
              removeMenu(true);
            } else {
              menu.style.transform = 'translateX(0)';
            }
          } else if (!menuOut) {
            if (self.options.edge === 'left') {
              menu.style.transform = 'translateX(-100%)';
            } else {
              menu.style.transform = 'translateX(100%)';
            }
          }
        });
      }
  
      // إذا closeOnClick مفعل نضيف حدث إغلاق عند الضغط على الروابط (باستثناء عناصر collapsible-header)
      if (this.options.closeOnClick === true) {
        menu.addEventListener('click', function(e) {
          let target = e.target;
          if (target.tagName.toLowerCase() === 'a' && !target.classList.contains('collapsible-header')) {
            if (!(window.innerWidth > 992 && menu.classList.contains('fixed'))) {
              removeMenu();
            }
          }
        });
      }
  
      // معالجة أحداث اللمس للسحب (بدون Hammer)
      if (this.options.draggable && dragTarget) {
        dragTarget.addEventListener('click', function() {
          if (menuOut) {
            removeMenu();
          }
        });
        let startX = 0;
        let currentX = 0;
        let touching = false;
        dragTarget.addEventListener('touchstart', function(e) {
          if (e.touches.length === 1) {
            touching = true;
            startX = e.touches[0].clientX;
          }
        });
        dragTarget.addEventListener('touchmove', function(e) {
          if (!touching) return;
          currentX = e.touches[0].clientX;
          const deltaX = currentX - startX;
          // إصلاح لمشكلة التمرير العمودي
          if (currentX === 0 && e.touches[0].clientY === 0) return;
          // تعطيل التمرير
          const oldWidth = document.body.clientWidth;
          document.body.style.overflow = 'hidden';
          document.body.style.width = oldWidth + "px";
          // إنشاء overlay إذا لم يكن موجودًا
          let overlay = document.getElementById('sidenav-overlay');
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sidenav-overlay';
            overlay.style.opacity = '0';
            overlay.addEventListener('click', function() {
              removeMenu();
            });
            document.body.appendChild(overlay);
            if (typeof self.options.onOpen === 'function') {
              self.options.onOpen.call(menu);
            }
          }
          if (self.options.edge === 'left') {
            let x = deltaX;
            if (x > self.options.menuWidth) { x = self.options.menuWidth; }
            else if (x < 0) { x = 0; }
            menuOut = (x >= self.options.menuWidth / 2);
            menu.style.transform = `translateX(${x - self.options.menuWidth}px)`;
            overlay.style.opacity = x / self.options.menuWidth;
          } else {
            let x = currentX;
            if (x > window.innerWidth) { x = window.innerWidth; }
            if (x < window.innerWidth - self.options.menuWidth) { x = window.innerWidth - self.options.menuWidth; }
            menuOut = (x < window.innerWidth - self.options.menuWidth / 2);
            let rightPos = x - self.options.menuWidth / 2;
            if (rightPos < 0) { rightPos = 0; }
            menu.style.transform = `translateX(${rightPos}px)`;
            overlay.style.opacity = Math.abs((x - window.innerWidth) / self.options.menuWidth);
          }
        });
        dragTarget.addEventListener('touchend', function(e) {
          if (!touching) return;
          touching = false;
          const overlay = document.getElementById('sidenav-overlay');
          // هنا لم نقم بحساب السرعة كما في النسخة الأصلية؛ يمكن تحسينها إذا دعت الحاجة
          const velocityX = 0;
          const x = currentX;
          let leftPos = x - self.options.menuWidth;
          let rightPos = x - self.options.menuWidth / 2;
          if (leftPos > 0) leftPos = 0;
          if (rightPos < 0) rightPos = 0;
          if (self.options.edge === 'left') {
            if ((menuOut && velocityX <= 0.3) || velocityX < -0.5) {
              if (leftPos !== 0) {
                animateStyles(menu, { transform: 'translateX(0)' }, 300, 'ease-out');
              }
              if (overlay) {
                animateStyles(overlay, { opacity: '1' }, 50, 'ease-out');
              }
              if (dragTarget) {
                dragTarget.style.width = '50%';
                dragTarget.style.right = '0';
                dragTarget.style.left = '';
              }
              menuOut = true;
            } else {
              document.body.style.overflow = '';
              document.body.style.width = '';
              animateStyles(menu, { transform: 'translateX(-100%)' }, 200, 'ease-out', function() {
                if (typeof self.options.onClose === 'function') {
                  self.options.onClose.call(menu);
                }
              });
              if (overlay) {
                animateStyles(overlay, { opacity: '0' }, 200, 'ease-out', function() {
                  if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                });
              }
              if (dragTarget) {
                dragTarget.style.width = '10px';
                dragTarget.style.right = '';
                dragTarget.style.left = '0';
              }
              menuOut = false;
            }
          } else {
            if ((menuOut && velocityX >= -0.3) || velocityX > 0.5) {
              if (rightPos !== 0) {
                animateStyles(menu, { transform: 'translateX(0)' }, 300, 'ease-out');
              }
              if (overlay) {
                animateStyles(overlay, { opacity: '1' }, 50, 'ease-out');
              }
              if (dragTarget) {
                dragTarget.style.width = '50%';
                dragTarget.style.right = '';
                dragTarget.style.left = '0';
              }
              menuOut = true;
            } else {
              document.body.style.overflow = '';
              document.body.style.width = '';
              animateStyles(menu, { transform: 'translateX(100%)' }, 200, 'ease-out', function() {
                if (typeof self.options.onClose === 'function') {
                  self.options.onClose.call(menu);
                }
              });
              if (overlay) {
                animateStyles(overlay, { opacity: '0' }, 200, 'ease-out', function() {
                  if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                });
              }
              if (dragTarget) {
                dragTarget.style.width = '10px';
                dragTarget.style.right = '0';
                dragTarget.style.left = '';
              }
              menuOut = false;
            }
          }
        });
      }
  
      // حدث النقر على العنصر المفعّل (activator)
      activator.addEventListener('click', function(e) {
        e.preventDefault();
        if (menuOut === true) {
          menuOut = false;
          panning = false;
          removeMenu();
        } else {
          const oldWidth = document.body.clientWidth;
          document.body.style.overflow = 'hidden';
          document.body.style.width = oldWidth + "px";
          if (self.options.draggable && dragTarget) {
            document.body.appendChild(dragTarget);
          }
          const overlay = document.createElement('div');
          overlay.id = 'sidenav-overlay';
          overlay.style.opacity = '0';
          overlay.addEventListener('click', function() {
            menuOut = false;
            panning = false;
            removeMenu();
            animateStyles(overlay, { opacity: '0' }, 300, 'ease-out', function() {
              if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            });
          });
          document.body.appendChild(overlay);
          if (self.options.edge === 'left') {
            if (dragTarget) {
              dragTarget.style.width = '50%';
              dragTarget.style.right = '0';
              dragTarget.style.left = '';
            }
            animateStyles(menu, { transform: 'translateX(0)' }, 300, 'ease-out');
          } else {
            if (dragTarget) {
              dragTarget.style.width = '50%';
              dragTarget.style.right = '';
              dragTarget.style.left = '0';
            }
            animateStyles(menu, { transform: 'translateX(0)' }, 300, 'ease-out');
          }
          animateStyles(overlay, { opacity: '1' }, 300, 'ease-out', function() {
            menuOut = true;
            panning = false;
          });
          if (typeof self.options.onOpen === 'function') {
            self.options.onOpen.call(menu);
          }
        }
      });
    };
  
    SideNav.prototype.destroy = function() {
      const menuId = this.elem.getAttribute('data-activates');
      const overlay = document.getElementById('sidenav-overlay');
      const dragTarget = document.querySelector(`.drag-target[data-sidenav="${menuId}"]`);
      if (overlay) overlay.click();
      if (dragTarget && dragTarget.parentNode) dragTarget.parentNode.removeChild(dragTarget);
      // يُفضّل في تطبيق حقيقي حفظ مرجع للمعالج وإزالته هنا
    };
  
    SideNav.prototype.show = function() {
      this.elem.click();
    };
  
    SideNav.prototype.hide = function() {
      const overlay = document.getElementById('sidenav-overlay');
      if (overlay) overlay.click();
    };
  
    // تعريض الكائن كخاصية عالمية
    window.SideNav = SideNav;
  })();
  
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