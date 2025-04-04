// Vanilla JS Tooltip Plugin
(function(){function e(){return'flaspeedTooltip-'+Math.random().toString(16).substr(2,12)}function t(e,t,o,l){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),s=o.getBoundingClientRect(),r=window.innerWidth,a=window.innerHeight,c=window.pageYOffset,d=window.pageXOffset;let p=0,u=0,m='0px',h='0px';switch(l){case'top':u=n.top+c-i.height,p=n.left+d+n.width/2-i.width/2,h='-10px',o.style.cssText=`bottom:0;left:0;border-radius:14px 14px 0 0;transform-origin:50% 100%;margin-top:${i.height}px;margin-left:${i.width/2-s.width/2}px`;break;case'left':u=n.top+c+n.height/2-i.height/2,p=n.left+d-i.width,m='-10px',o.style.cssText=`top:-7px;right:0;width:14px;height:14px;border-radius:14px 0 0 14px;transform-origin:95% 50%;margin-top:${i.height/2}px;margin-left:${i.width}px`;break;case'right':u=n.top+c+n.height/2-i.height/2,p=n.left+d+n.width,m='+10px',o.style.cssText=`top:-7px;left:0;width:14px;height:14px;border-radius:0 14px 14px 0;transform-origin:5% 50%;margin-top:${i.height/2}px;margin-left:0px`;break;default:u=n.top+c+n.height,p=n.left+d+n.width/2-i.width/2,h='+10px',o.style.cssText=`top:0;left:0;margin-left:${i.width/2-s.width/2}px`}return p<0&&(p=4),p+i.width>r&&(p-=p+i.width-r),u<0&&(u=4),u+i.height>a+c&&(u-=u+i.height-a),{left:p,top:u,translateX:m,translateY:h}}function o(e){this.defaultOptions={delay:350,tooltip:'',position:'bottom',html:!1},this.options=Object.assign({},this.defaultOptions,e)}o.prototype.init=function(t){t.getAttribute('data-tooltip-id')&&document.getElementById(t.getAttribute('data-tooltip-id'))&&document.getElementById(t.getAttribute('data-tooltip-id')).remove();const o=e();t.setAttribute('data-tooltip-id',o);const l=document.createElement('div');l.className='material-tooltip',l.id=o,l.style.margin='0';const n=document.createElement('span'),i=this.getTooltipText(t);this.isHtml(t)?n.innerHTML=i:n.textContent=i;const s=document.createElement('div');return s.className='backdrop',s.style.margin='0',l.appendChild(n),l.appendChild(s),document.body.appendChild(l),this.attachEvents(t,l,s),l},o.prototype.getTooltipText=function(e){return e.getAttribute('data-tooltip')||this.options.tooltip||e.getAttribute('title')||''},o.prototype.isHtml=function(e){return'true'===e.getAttribute('data-html')||this.options.html},o.prototype.getPosition=function(e){return e.getAttribute('data-position')||this.options.position},o.prototype.getDelay=function(e){const t=e.getAttribute('data-delay');return null!==t&&''!==t?parseInt(t):this.options.delay},o.prototype.attachEvents=function(e,o,l){let n,i=!1;const s=()=>{const n=this.getPosition(e),{left:s,top:r,translateX:a,translateY:c}=t(e,o,l,n);o.style.visibility='visible',o.style.left=`${s}px`,o.style.top=`${r}px`,l.style.visibility='visible';const d=o.offsetWidth,p=o.offsetHeight,u=l.offsetWidth,m=l.offsetHeight,h=Math.SQRT2*d/u,f=Math.SQRT2*p/m,v=Math.max(h,f);o.style.transition='transform 0.35s, opacity 0.3s',l.style.transition='transform 0.3s, opacity 0.3s',o.style.transform=`translateY(${c}) translateX(${a})`,o.style.opacity='1',l.style.transform=`scale(${v})`,l.style.opacity='1',i=!0},r=()=>{o.style.transform='translateY(0) translateX(0)',o.style.opacity='0',l.style.transform='scale(1)',l.style.opacity='0',setTimeout(()=>{i||(o.style.visibility='hidden',l.style.visibility='hidden'),i=!1},225)};e.addEventListener('mouseenter',()=>{n=setTimeout(s,this.getDelay(e))}),e.addEventListener('mouseleave',()=>{clearTimeout(n),setTimeout(r,225)})},window.VanillaTooltip=function(e,t){if('remove'===t){const t=e.getAttribute('data-tooltip-id');return t&&document.getElementById(t)&&(document.getElementById(t).remove(),e.removeAttribute('data-tooltip-id')),e}const l=new o(t);return l.init(e)}})();
/*DropMenu*/
// تنفيذ وظيفة scrollTo
Element.prototype.scrollTo = function(elem) {
    this.scrollTop = this.scrollTop - this.getBoundingClientRect().top + elem.getBoundingClientRect().top;
    return this;
    };
    
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
    elements.forEach(element => {
    const event = new CustomEvent('open');
    element.dispatchEvent(event);
    });
    return false;
    }
    
    // إذا تم تمرير "close" كخيار، قم بإغلاق جميع العناصر المنسدلة المحددة
    if (options === "close") {
    elements.forEach(element => {
    const event = new CustomEvent('close');
    element.dispatchEvent(event);
    });
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
    elements.forEach(origin => {
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
    buttons.forEach(button => {
    button.addEventListener('click', (e) => {
    // لا نقوم بإيقاف انتشار الحدث هنا حتى يتمكن سكريبت آخر من التقاطه
    });
    });
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
    });
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
(function(){function a(c,d,e,f,g){c.style.transition=`all ${e}ms ${f}`;for(let h in d)c.style[h]=d[h];setTimeout(()=>{c.style.transition="";g&&typeof g=="function"&&g()},e)}const b={menuWidth:300,edge:BlogDirection==='rtl'?'right':'left',closeOnClick:!1,draggable:!0,onOpen:null,onClose:null};function c(d,e){this.elem=d;this.options=Object.assign({},b,e);this.init()}c.prototype.init=function(){const f=this,g=f.elem,h=g.getAttribute("data-activates"),i=document.getElementById(h);if(!i)return;f.options.menuWidth!=300&&(i.style.width=f.options.menuWidth+"px");let j=document.querySelector(`.drag-target[data-sidenav="${h}"]`);if(f.options.draggable){j&&j.parentNode.removeChild(j);j=document.createElement("div");j.className="drag-target";j.setAttribute("data-sidenav",h);document.body.appendChild(j)}else j=null;f.options.edge==="left"?(i.classList.add("left-aligned"),i.style.transform="translateX(-100%)",j&&(j.style.left="0")):(i.classList.add("right-aligned"),i.style.transform="translateX(100%)",j&&(j.style.right="0"));if(i.classList.contains("fixed")&&window.innerWidth>992)i.style.transform="translateX(0)";let k=!1,l=!1;function m(n){k=!1,l=!1;document.body.style.overflow="";document.body.style.width="";const o=document.getElementById("sidenav-overlay");o&&a(o,{opacity:"0"},200,"ease-out",function(){o.parentNode&&o.parentNode.removeChild(o)});if(f.options.edge==="left"){if(j){j.style.width="";j.style.right="";j.style.left="0"}a(i,{transform:"translateX(-100%)"},200,"cubic-bezier(0.25,0.46,0.45,0.94)",function(){n===!0&&(i.removeAttribute("style"),i.style.width=f.options.menuWidth+"px");typeof f.options.onClose==="function"&&f.options.onClose.call(i)})}else{if(j){j.style.width="";j.style.right="0";j.style.left=""}a(i,{transform:"translateX(100%)"},200,"cubic-bezier(0.25,0.46,0.45,0.94)",function(){n===!0&&(i.removeAttribute("style"),i.style.width=f.options.menuWidth+"px");typeof f.options.onClose==="function"&&f.options.onClose.call(i)})}}if(i.classList.contains("fixed"))window.addEventListener("resize",function(){if(window.innerWidth>992){if(document.getElementById("sidenav-overlay")&&l)m(!0);else i.style.transform="translateX(0)"}else if(!l)f.options.edge==="left"?i.style.transform="translateX(-100%)":i.style.transform="translateX(100%)"});f.options.closeOnClick===!0&&i.addEventListener("click",function(n){let o=n.target;if(o.tagName.toLowerCase()==="a"&&!o.classList.contains("collapsible-header")){if(!(window.innerWidth>992&&i.classList.contains("fixed")))m()}});if(f.options.draggable&&j){j.addEventListener("click",function(){l&&m()});let n=0,o=0,p=!1;j.addEventListener("touchstart",function(q){q.touches.length===1&&(p=!0,n=q.touches[0].clientX)});j.addEventListener("touchmove",function(q){if(!p)return;o=q.touches[0].clientX;const r=o-n; if(o===0&&q.touches[0].clientY===0)return;const s=document.body.clientWidth;document.body.style.overflow="hidden";document.body.style.width=s+"px";let t=document.getElementById("sidenav-overlay");if(!t){t=document.createElement("div");t.id="sidenav-overlay";t.style.opacity="0";t.addEventListener("click",function(){m()});document.body.appendChild(t);typeof f.options.onOpen==="function"&&f.options.onOpen.call(i)};if(f.options.edge==="left"){let u=r;u=u>f.options.menuWidth?f.options.menuWidth:u<0?0:u;l=u>=f.options.menuWidth/2;i.style.transform=`translateX(${u-f.options.menuWidth}px)`;t.style.opacity=u/f.options.menuWidth}else{let u=o;u=u>window.innerWidth?window.innerWidth:u;u=u<window.innerWidth-f.options.menuWidth?window.innerWidth-f.options.menuWidth:u;l=u<window.innerWidth-f.options.menuWidth/2;let v=u-f.options.menuWidth/2;v=v<0?0:v;i.style.transform=`translateX(${v}px)`;t.style.opacity=Math.abs((u-window.innerWidth)/f.options.menuWidth)}});j.addEventListener("touchend",function(q){if(!p)return;p=!1;const r=document.getElementById("sidenav-overlay"),s=0,u=o,v=u-f.options.menuWidth,w=u-f.options.menuWidth/2;v=v>0?0:v;w=w<0?0:w;if(f.options.edge==="left"){if((l&&s<=0.3)||s<-0.5){v!==0&&a(i,{transform:"translateX(0)"},300,"ease-out");r&&a(r,{opacity:"1"},50,"ease-out");j&&(j.style.width="50%",j.style.right="0",j.style.left="");l=!0}else{document.body.style.overflow="";document.body.style.width="";a(i,{transform:"translateX(-100%)"},200,"ease-out",function(){typeof f.options.onClose==="function"&&f.options.onClose.call(i)});r&&a(r,{opacity:"0"},200,"ease-out",function(){r.parentNode&&r.parentNode.removeChild(r)});j&&(j.style.width="10px",j.style.right="",j.style.left="0");l=!1}}else{if((l&&s>=-0.3)||s>0.5){w!==0&&a(i,{transform:"translateX(0)"},300,"ease-out");r&&a(r,{opacity:"1"},50,"ease-out");j&&(j.style.width="50%",j.style.right="",j.style.left="0");l=!0}else{document.body.style.overflow="";document.body.style.width="";a(i,{transform:"translateX(100%)"},200,"ease-out",function(){typeof f.options.onClose==="function"&&f.options.onClose.call(i)});r&&a(r,{opacity:"0"},200,"ease-out",function(){r.parentNode&&r.parentNode.removeChild(r)});j&&(j.style.width="10px",j.style.right="0",j.style.left="");l=!1}}});}g.addEventListener("click",function(q){q.preventDefault();if(l){l=!1;k=!1;m()}else{const n=document.body.clientWidth;document.body.style.overflow="hidden";document.body.style.width=n+"px";f.options.draggable&&j&&document.body.appendChild(j);const p=document.createElement("div");p.id="sidenav-overlay";p.style.opacity="0";p.addEventListener("click",function(){l=!1;k=!1;m();a(p,{opacity:"0"},300,"ease-out",function(){p.parentNode&&p.parentNode.removeChild(p)})});document.body.appendChild(p);if(f.options.edge==="left"){j&&(j.style.width="50%",j.style.right="0",j.style.left="");a(i,{transform:"translateX(0)"},300,"ease-out")}else{j&&(j.style.width="50%",j.style.right="",j.style.left="0");a(i,{transform:"translateX(0)"},300,"ease-out")}a(p,{opacity:"1"},300,"ease-out",function(){l=!0;k=!1});typeof f.options.onOpen==="function"&&f.options.onOpen.call(i)}})};c.prototype.destroy=function(){const d=this.elem.getAttribute("data-activates"),e=document.getElementById("sidenav-overlay"),f=document.querySelector(`.drag-target[data-sidenav="${d}"]`);e&&e.click();f&&f.parentNode&&f.parentNode.removeChild(f)};c.prototype.show=function(){this.elem.click()};c.prototype.hide=function(){const d=document.getElementById("sidenav-overlay");d&&d.click()};window.SideNav=c})();
/*Waves*/
if(WavesAllow){!function(n){var t=t||{},e=document.querySelectorAll.bind(document);function h(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e+=n+":"+t[n]+";");return e}var w={duration:750,show:function(t,e){if(2===t.button)return!1;var n=e||this,a=document.createElement("div");a.className="waves-ripple",n.appendChild(a);var i,o,r,s,u,d,c,l=(u={top:0,left:0},d=(i=n)&&i.ownerDocument,c=d.documentElement,void 0!==i.getBoundingClientRect&&(u=i.getBoundingClientRect()),o=null!==(s=r=d)&&s===s.window?r:9===r.nodeType&&r.defaultView,{top:u.top+o.pageYOffset-c.clientTop,left:u.left+o.pageXOffset-c.clientLeft}),m=t.pageY-l.top,f=t.pageX-l.left,p="scale("+n.clientWidth/100*10+")";"touches"in t&&(m=t.touches[0].pageY-l.top,f=t.touches[0].pageX-l.left),a.setAttribute("data-hold",Date.now()),a.setAttribute("data-scale",p),a.setAttribute("data-x",f),a.setAttribute("data-y",m);var v={top:m+"px",left:f+"px"};a.className=a.className+" waves-notransition",a.setAttribute("style",h(v)),a.className=a.className.replace("waves-notransition",""),v["-webkit-transform"]=p,v["-moz-transform"]=p,v["-ms-transform"]=p,v["-o-transform"]=p,v.transform=p,v.opacity="1",v["-webkit-transition-duration"]=w.duration+"ms",v["-moz-transition-duration"]=w.duration+"ms",v["-o-transition-duration"]=w.duration+"ms",v["transition-duration"]=w.duration+"ms",v["-webkit-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",v["-moz-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",v["-o-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",v["transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",a.setAttribute("style",h(v))},hide:function(t){u.touchup(t);var e=this,n=(e.clientWidth,null),a=e.getElementsByClassName("waves-ripple");if(!(0<a.length))return!1;var i=(n=a[a.length-1]).getAttribute("data-x"),o=n.getAttribute("data-y"),r=n.getAttribute("data-scale"),s=350-(Date.now()-Number(n.getAttribute("data-hold")));s<0&&(s=0),setTimeout(function(){var t={top:o+"px",left:i+"px",opacity:"0","-webkit-transition-duration":w.duration+"ms","-moz-transition-duration":w.duration+"ms","-o-transition-duration":w.duration+"ms","transition-duration":w.duration+"ms","-webkit-transform":r,"-moz-transform":r,"-ms-transform":r,"-o-transform":r,transform:r};n.setAttribute("style",h(t)),setTimeout(function(){try{e.removeChild(n)}catch(t){return!1}},w.duration)},s)},wrapInput:function(t){for(var e=0;e<t.length;e++){var n=t[e];if("input"===n.tagName.toLowerCase()){var a=n.parentNode;if("i"===a.tagName.toLowerCase()&&-1!==a.className.indexOf("waves-effect"))continue;var i=document.createElement("i");i.className=n.className+" waves-input-wrapper";var o=(o=n.getAttribute("style"))||"";i.setAttribute("style",o),n.className="waves-button-input",n.removeAttribute("style"),a.replaceChild(i,n),i.appendChild(n)}}}},u={touches:0,allowEvent:function(t){var e=!0;return"touchstart"===t.type?u.touches+=1:"touchend"===t.type||"touchcancel"===t.type?setTimeout(function(){0<u.touches&&--u.touches},500):"mousedown"===t.type&&0<u.touches&&(e=!1),e},touchup:function(t){u.allowEvent(t)}};function a(t){var e=function(t){if(!1===u.allowEvent(t))return null;for(var e=null,n=t.target||t.srcElement;null!==n.parentNode;){if(!(n instanceof SVGElement)&&-1!==n.className.indexOf("waves-effect")){e=n;break}n=n.parentNode}return e}(t);null!==e&&(w.show(t,e),"ontouchstart"in n&&(e.addEventListener("touchend",w.hide,!1),e.addEventListener("touchcancel",w.hide,!1)),e.addEventListener("mouseup",w.hide,!1),e.addEventListener("mouseleave",w.hide,!1),e.addEventListener("dragend",w.hide,!1))}t.displayEffect=function(t){"duration"in(t=t||{})&&(w.duration=t.duration),w.wrapInput(e(".waves-effect")),"ontouchstart"in n&&document.body.addEventListener("touchstart",a,!1),document.body.addEventListener("mousedown",a,!1)},t.attach=function(t){"input"===t.tagName.toLowerCase()&&(w.wrapInput([t]),t=t.parentNode),"ontouchstart"in n&&t.addEventListener("touchstart",a,!1),t.addEventListener("mousedown",a,!1)},n.Waves=t,t.displayEffect()}(window);}else{document.querySelectorAll('body *').forEach(el=>{if(hasClass(el,'waves-effect')){el.classList.remove('waves-effect')}if(hasClass(el,'waves-light')){el.classList.remove('waves-light')}})};
/*============================================================
-->> Tooltips()
==============================================================*/
if(Tooltips){tooltip()};
function tooltip(){
document.addEventListener("mouseenter", function (event) { 
if (!(event.target instanceof Element)) return;
const btn = event.target.closest(".tooltipped");
if (!btn) return;
if (!window._vanillaTooltips) {
window._vanillaTooltips = new Map();
}
const tooltipId = btn.dataset.tooltipId || btn.getAttribute("id") || Math.random().toString(36).substr(2, 9);
if (!window._vanillaTooltips.has(tooltipId)) {
window._vanillaTooltips.set(tooltipId, new VanillaTooltip(btn,{delay: 50}));
}
}, true);
}
/*============================================================
-->> DropMenu()
==============================================================*/
document.addEventListener("click", function (event) { 
if (!(event.target instanceof Element)) return;
const el = event.target.closest(".dropdown-button");
if (!el) return;
if(!el.hasAttribute("data-initialized")){
const spAlignment = el.dataset.target === 'vBookmarks' ? {alignment:'left'} : '';
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