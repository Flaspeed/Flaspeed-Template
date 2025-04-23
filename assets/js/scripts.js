
(function(){
let archiveData={},
Error = ['<div class="errorFetch">'+ 'هناك خطأ ما' + '...</div>','<div class="noFetch">' + Msg.noResultsFound + "</div>"];
PostCount = typeof PostCount !== 'undefined' ? PostCount:0;
feed_count = Math.ceil(PostCount / 150);
if (typeof _bl !== 'undefined') {
for (const Jx of _bl) {
archiveData[Jx.split(':')[0]] = parseInt(Jx.split(':')[1]);
}
} else {
archiveData = {};
}
/*============================================================
-->> GET FUNCTIONS
==============================================================*/
window.addEventListener('scroll', () => InitiScripts(),{once:true});
labelMaxSet();
MainMenu();

if(!HeaderFixed && (NavbarFixed && MenuFixed) || (HeaderFixed && NavbarFixed && MenuFixed) || HeaderFixed){
FixedElem(document.querySelector('#BlogHeader'))
} else if(NavbarFixed){
FixedElem(document.querySelector('#BlogHeader .navbar'))
} else if(MenuFixed){
FixedElem(document.querySelector('#BlogHeader .MainMenu-Contianer'))
}


if(!!sessionStorage.getItem('flaSpeed')){
loadPostsOnView({type: 'run'});
} else {
loadPostsOnView(cateEvent);
}






textFields();
/*============================================================
-->> labelMaxSet()
==============================================================*/
function labelMaxSet() {
const links = document.querySelectorAll('a[href*="search/label/"]:not([href*="max-results"])');
for (const link of links) {
const url = new URL(link.href),
maxResults = url.searchParams.get("max-results");
if (maxResults) {
url.searchParams.set("max-results", getMaxResults);
} else {
url.searchParams.append("max-results", getMaxResults);
}
link.href = url.toString();
}
}


/*============================================================
-->> InitiScripts()
==============================================================*/
function InitiScripts() {
const Kj = document.querySelector("#blogger-components").innerHTML.replace(/(\<\!\-\-|\-\-\>)/g, ''),
Kz = Kj.match(/http.+?widgets\.js/)[0],
Kc = "/js/cookienotice.js",
Kv = Kj.match(/(\<|&lt;)script type='text\/javascript'(\>|&gt;)((.|\n)*)?(\<|&lt;)\/script(\>|&gt;)/g)[0]
.replace(/((\<|&lt;)script type='text\/javascript'(\>|&gt;)|(\<|&lt;)\/script(\>|&gt;))/g, ''),
Ks = Kj.match(/(\<|&lt;)script(\>|&gt;)(.|\n)*?(\<|&lt;)\/script(\>|&gt;)/g) || null,
Kb = '';
if (Ks != null) {
getScript(Kc, function() {
Ks = Ks[0].replace(/(\<script\>|\<\/script\>)/g, '').match(/(\(window|window).*/g);
if (Ks) {
for (const KS of Ks) {
Kb += KS;
}
}
new Function(Kb)();
});
}
getScript(Kz, function() {
new Function(Kv)();
BlogId = _WidgetManager._GetAllData().blog.blogId;
});
}

/*============================================================
-->> GetSlider()
==============================================================*/
function gtSlider(KR) {
getScript("https://host.iscodi.com/assets/js/splidejs@4.1.4.min.js?v=3",
function() {
KR();
})
}

/*============================================================
-->> Sliders()
==============================================================*/
const sp = [],
anReduced = '(prefers-reduced-motion: reduce)';
function getSliderOptions(autoplay) {
const options = {
perMove: 1,
direction: BlogDirection
};
if (matchMedia(anReduced).matches) {
options.reducedMotion = {
speed: 500,
rewindSpeed: 500,
...(autoplay && { autoplay: true })
};
} else {
options.speed = 500;
options.rewindSpeed = 500;
if (autoplay) options.autoplay = true;
}

return options;
}
function setSlides(slider, widgetId, type, perPage, pagination, arrows, gap, breakpointsEnabled, ...rest) {
  const elem = document.querySelector(slider),
        widget = document.querySelector(widgetId);
  if (!elem || !widget || elem.hasAttribute('data-mounted')) return;

  let autoplay = false,
      rewind = false,
      callback = null,
      breakpoints = null;

  if (breakpointsEnabled) {
    const [break1, break2, break3, auto, rw, cb] = rest;
    autoplay = auto;
    rewind = rw;
    callback = cb;
    breakpoints = {
      1100: { perPage: break1 },
      860: { perPage: break2 },
      640: { perPage: break3 }
    };
  } else {
    [autoplay, rewind, callback] = rest;
  }

  const KA = getSliderOptions(autoplay);
  KA.type = type;
  KA.perPage = perPage;
  KA.pagination = pagination;
  KA.arrows = arrows;
  KA.gap = gap;
  KA.rewind = rewind;
  if (breakpoints) KA.breakpoints = breakpoints;

  new Splide(elem, KA).on('mounted', () => {
    if (typeof callback === "function") callback();
    if (!elem.classList.contains('m-slider')) {
      if (elem.previousElementSibling?.classList.contains('posts-loading')) {
        elem.previousElementSibling.remove();
      }
      elem.fadeIn(300, 'block');
    }
    if (elem.classList.contains('m-slider')) {
      loadClass();
    }
    elem.setAttribute('data-mounted', 'true');
  }).mount();
}

/*============================================================
-->> FixedElem()
==============================================================*/
function FixedElem(headerElement) {
  const iY = headerElement?.offsetTop;

  const toRGBA = (color, alpha) => {
    let r, g, b;
    if (color.startsWith('rgb')) [r, g, b] = color.match(/\d+/g).map(Number);
    else if (color.startsWith('#')) {
      const hex = color.length === 4
        ? [...color.slice(1)].map(ch => ch + ch).join('')
        : color.slice(1);
      [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
    } else return color;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const headDown = document.querySelector('.head-down');
    if (scroll > iY) {
      headerElement.classList.add('fixed');
      headerElement.style.backgroundColor = toRGBA(getComputedStyle(headerElement).backgroundColor, 0.95);
      if ((!HeaderFixed && NavbarFixed && MenuFixed) || (HeaderFixed && NavbarFixed && MenuFixed) || HeaderFixed || NavbarFixed)
        headDown.classList.add('fixed');
    } else {
      headerElement.classList.remove('fixed');
      headerElement.style.backgroundColor = '';
      if ((!HeaderFixed && NavbarFixed && MenuFixed) || (HeaderFixed && NavbarFixed && MenuFixed) || HeaderFixed || NavbarFixed)
        headDown.classList.remove('fixed');
    }
  });
}



/*============================================================
-->> MainMenu()
==============================================================*/
function MainMenu() {
  const menuItems = document.querySelectorAll('.menu-bar li');
  for (let j = 0, len2 = menuItems.length; j < len2; j++) {
    const emptyList = menuItems[j].querySelector('ul:empty');
    if (emptyList) {
      emptyList.remove();
    }
  }

  if (document.querySelector('#menu-bar ul li > a')) {
    const titleLinks = document.querySelectorAll('#menu-bar ul li:not(.homeicon) > a');
    for (let k = 0, len3 = titleLinks.length; k < len3; k++) {
      const currentTitle = titleLinks[k].getAttribute('title');
      titleLinks[k].setAttribute('title', currentTitle.replace(/(<[^>]*>|_)/g, '').replace(/#/g, ''));
    }
  }

  if (document.querySelector('#menu-bar .subMenu a')) {
    const subMenuLinks = document.querySelectorAll('#menu-bar .subMenu a');
    for (let l = 0, len4 = subMenuLinks.length; l < len4; l++) {
      subMenuLinks[l].innerHTML = subMenuLinks[l].innerHTML.replace(/_/g, '').replace(/#/g, '');
    }
  }

  if (document.querySelector('#menu-bar .MegaMenu > ul')) {
    const megaUl = document.querySelectorAll('#menu-bar .MegaMenu > ul');
    for (let m = 0, len5 = megaUl.length; m < len5; m++) {
      if (megaUl[m]) {
        megaUl[m].remove();
      }
    }
  }

  if (document.querySelector('.menu-bar > ul > li:not(.sub-menu) > ul')) {
    const nonSubMenus = document.querySelectorAll('.menu-bar > ul > li:not(.sub-menu) > ul');
    for (let n = 0, len6 = nonSubMenus.length; n < len6; n++) {
      if (nonSubMenus[n]) {
        nonSubMenus[n].remove();
      }
    }
  }

  if (document.querySelector('.nav-drawer #menu-bar .sub-menu > a')) {
    const navSubLinks = document.querySelectorAll('.nav-drawer #menu-bar .sub-menu > a');
    for (let o = 0, len7 = navSubLinks.length; o < len7; o++) {
      navSubLinks[o].addEventListener('click', function(evt) {
        evt.preventDefault();
        const sibling = this.nextElementSibling;
        if (window.getComputedStyle(sibling).display === 'none') {
          sibling.slideDown(200, 'block');
          this.classList.add('expanded');
        } else {
          sibling.slideUp(200);
          this.classList.remove('expanded');
        }
      });
    }
  }

  function megaClick() {
    const megaLinks = document.querySelectorAll(".MegaMenu a");
    for (let p = 0, len8 = megaLinks.length; p < len8; p++) {
      const linkElem = megaLinks[p];
      if (linkElem.dataset.info) {
        const parsedInfo = JSON.parse(linkElem.dataset.info);
        const labelVal = parsedInfo.mglabel;
        linkElem.setAttribute("href", `${SearchUrl}/label/${encodeURIComponent(labelVal)}?max-results=${getMaxResults}`);
        linkElem.removeAttribute('data-info');
      }
    }
  }

  document.addEventListener("click", function(event) {
    const btnElem = event.target.closest('.openNavMobile');
    if (!btnElem) return;
    megaClick();
  });
}



/*============================================================
-->> elemFeed()
==============================================================*/
function elemFeed(Jx) {
const JR = {},
Jq = Jx.link.filter(function (JI) {
return JI.rel == 'alternate';
})[0].href;
JR.Link = Jq.startsWith('http://') ? Jq.replace('http://', 'https://') : Jq;

/* ======================================================================
> Categorys [Section]
=========================================================================*/
JR.Category = Jx.category?.[0]?.term || "بدون تسمية";
JR.Categorys = Jx.category?.map(item => item.term) || []; 
JR.CategoryName = JR.Categorys.length > 0 ? `<span class="Category Categories cateback-${Math.floor(42 * Math.random() + 1)}">${JR.Category}</span>` : "";
JR.CategoryLink = JR.Categorys.length > 0 ? `<a class="category-link Categories cateback-${Math.floor(42 * Math.random() + 1)}" href="/search/label/${encodeURIComponent(JR.Category)}?max-results=${getMaxResults}">${JR.Category}</a>` : "";

if(JR.Link !== ''){
JR.Title = Jx.title.$t;
JR.FullTitle = Jx.title.$t;
if (MaxTitle && JR.FullTitle.split(" ").length > MaxTitleNum) {
JR.Title = JR.FullTitle.split(" ").slice(0, MaxTitleNum).join(" ") + "..."
}

JR.Snippet = (Jx.summary?.$t || Jx.content?.$t || "").replace(/<\S[^>]*>/g, "");
JR.SnippetShorten = JR.Snippet.slice(0, snippetLength) + "...";

/* ======================================================================
> Date [Section]
=========================================================================*/
JR.FullDate = Jx.published.$t;
JR.UpDate = Jx.updated.$t;
JR.Date = timeAgo ? langDate(JR.UpDate) : `${JR.FullDate.slice(8, 10)} ${langDate(JR.FullDate)} ${JR.FullDate.slice(0, 4)}`;
JR.Format = `${BlogUrl}${JR.FullDate.slice(0, 10).replace(/-/g, "_")}_archive.html`;
JR.getDateElem = showTimestamp ? `<span class="post-date">${TimeIcon}<time datetime="${JR.UpDate}" title="${JR.UpDate}">${JR.Date}</time></span>` : "";
JR.LinkDate = showTimestamp ? `<span class="post-date"><a href="${JR.Format}" datetime="${JR.UpDate}" title="${JR.UpDate}" rel="nofollow">${TimeIcon}<time datetime="${JR.UpDate}" title="${JR.UpDate}">${JR.Date}</time></a></span>` : "";

/* ======================================================================
> Comments [Section]
=========================================================================*/
JR.NumCom = Jx.thr$total?.$t || '0';
JR.NumComElem = Jx.thr$total ? `<span class="icComments">${CommentsIcon}${JR.NumCom}</span>` : '';
JR.NumComUrl = Jx.thr$total ? `<span class="icComments"><a class="comments" href="${JR.Link}#item-comments">${CommentsIcon}${JR.NumCom}</a></span>` : '';

/* ======================================================================
> Authors [Section]
=========================================================================*/
JR.Author = Jx.author[0]?.name?.$t || 'مجهول';
JR.AuthTagNameElem = showAuthor ? `<span class="post-author">${UserIcon}${JR.Author}</span>` : '';
JR.AuthNameURL = Jx.author[0]?.uri?.$t || '#';
if (showAuthor) {
JR.AuthNameLink = JR.AuthNameURL !== '#' ? `<span class="post-author"><a class="author-name" rel="nofollow noreferrer" target="_blank" href="${JR.AuthNameURL}">${UserIcon}${JR.Author}</a></span>` : JR.AuthTagNameElem;
} else {
JR.AuthNameLink = `<span class="post-author">${UserIcon}${JR.Author}</span>`;
}
JR.Author_IMG = Jx.author[0]?.gd$image?.src.includes('blogger_logo_round') || Jx.author[0]?.gd$image?.src.includes('img1.blogblog.com') ? AltAuthor : Jx.author[0]?.gd$image?.src;
JR.AuthTagImageElem = showAuthor ? `<a class="author-img" aria-label="${JR.Author}" rel="nofollow noreferrer" target="_blank" href="${JR.AuthNameURL}"><span class="Lazy authImage"><img alt="Author Photo" data-auth-src="${JR.Author_IMG}"/></span><span class="authName">${JR.Author}</span></a>` : '';

/* ======================================================================
> Images [Section]
=========================================================================*/
const JC = Jx.media$thumbnail?.url || (Jx.content?.$t.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/) ? (JR.YoutubeId = Jx.content.$t.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop(),
JR.YoutubeId.length === 11 ? "//img.youtube.com/vi/" + JR.YoutubeId + "/0.jpg" : null) : (Jx.content?.$t.match(/src=(.+?[\.jpg|\.gif|\.png]")/) ? Jx.content.$t.match(/src=(.+?[\.jpg|\.gif|\.png]")/)[1] : AltImage));
JR.ImgUrl = JC.startsWith('http://') ? JC.replace('http://', 'https://') : JC;

/* ======================================================================
> PostID [Section]
=========================================================================*/
JR.PostId = Jx.id.$t.replace(/.+\-/g, '');
}

return JR;
}; // End Elements Feed


/*============================================================
-->> GetHtml()
==============================================================*/
function GetHtml(data, element, start = 0, end = 24, listSlide, sideSlide) {
const mega = element.getAttribute("data-type").includes("mega"),
megatwo = element.getAttribute("data-type") === 'mega-2',
megathree = element.getAttribute("data-type") === 'mega-3',
tikcernews = element.getAttribute("data-type").includes("tikcernews"),
slider = element.getAttribute("data-type").includes("slider"),
allcats = element.getAttribute("data-type").includes("allcats"),
sided = element.getAttribute("data-type").includes("sided"),
timeline = element.getAttribute("data-type").includes("timeline"),
cover = element.getAttribute("data-type").includes("cover"),
semicov = element.getAttribute("data-type").includes("semicov"),
video = element.getAttribute("data-type").includes("video"),
small = element.getAttribute("data-type").includes("small"),
noimage = element.getAttribute("data-type").includes("noimage"),
splide = element.getAttribute("data-type").includes("splide"),
carousel = element.getAttribute("data-type").includes("carousel"),
grid = element.getAttribute("data-type").includes("grid"),
sectionType = tikcernews ? 'ul' : 'section',
articleType = tikcernews ? 'li' : 'article',
animDir = tikcernews ? (BlogDirection === 'rtl' ? 'an-right' : 'an-left'): 'an-up',
splideList = (slider && listSlide && sideSlide) ? ' splide__list' : '',
splideSlide = (slider && listSlide && sideSlide) ? ' splide__slide' : '',
roleArticle = !tikcernews ? 'role="article"' : '',
roleFeed = !tikcernews ? 'role="feed"' : '';

let htmlContent = '';

htmlContent += '<'+sectionType+' class="cates '+element.getAttribute("data-type")+ splideList + " " +animDir+'" '+roleFeed+'>';

if(allcats){
const catsLabel = element.getAttribute("data-label") === 'TheRecent' ? 'أخر التدوينات' : element.getAttribute("data-label") === 'TheRandom' ? 'الأكثر زيارة' : element.getAttribute("data-label"),
catsLink = element.getAttribute("data-label") === 'TheRecent' || element.getAttribute("data-label") === 'TheRandom' ? SearchUrl + `?max-results=${getMaxResults}` : SearchUrl + `/label/${encodeURIComponent(element.getAttribute("data-label"))}?max-results=${getMaxResults}`;
htmlContent += '<h3 role="heading" class="catstitle">',
htmlContent += '<a class="image Lazy" href="'+catsLink+'" title="'+catsLabel+'">',
htmlContent += '<img alt="'+catsLabel+'" class="lazyload" data-sizes="auto" data-src="'+elemFeed(data.feed.entry[0]).ImgUrl+'"/>',
htmlContent += '<span class="catsname">'+catsLabel+'</span>',
htmlContent += '</a>',
htmlContent += '</h3>';
}

for (let i = start; i < end && i < data.feed.entry.length; i++) {
const entry = data.feed.entry[i];
let D1 = elemFeed(entry);

function det(){
let htmlDet = '';
htmlDet += '<div class="details">',
htmlDet += !mega && !allcats ? D1.AuthNameLink : '',
htmlDet += D1.LinkDate,
htmlDet += !allcats ? D1.NumComUrl : '';
return htmlDet + '</div>';
}
htmlContent += '<'+articleType+' class="post post-'+ i + splideSlide +'" '+roleArticle+' data-item="'+D1.PostId+'" data-cate="'+D1.Category+'">';

/* 
>> Mega
====================== */
if(mega){
htmlContent += '<div class="post-image">',
htmlContent += '<a title="'+D1.FullTitle+'" class="image Lazy" href="'+D1.Link+'">',
htmlContent += !megatwo ? D1.CategoryName : '',
htmlContent += megathree ? '<canvas id="bar" width="50" height="50"></canvas>' : '',
htmlContent += megathree ? '<i class="fa fa-video"></i>' : '',
htmlContent += '<img alt="'+D1.FullTitle+'" class="lazyload" data-sizes="auto" data-src="'+D1.ImgUrl+'"/>',
htmlContent += '</a>',
htmlContent += '<button aria-label="Read it Later" class="snackbar-btn tooltipped postSave" data-tooltip="اقرأها لاحقا" type="button" data-duration="4000">',
htmlContent += '<svg fill="none" height="16" stroke="var(--key)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
htmlContent += '</button>',              
htmlContent += '</div>';
if(megatwo){
htmlContent += '<div class="mginfo-wrap">';
}
htmlContent += det();
htmlContent += '<h3 role="heading" class="post-title"><a title="'+D1.FullTitle+'" href="'+D1.Link+'">'+D1.Title+'</a></h3>';
if(megatwo){
htmlContent += '</div>';
}
}

/* 
>> Ticker
====================== */
if(tikcernews){
htmlContent += '<h3 role="heading" class="post-title"><a title="'+D1.FullTitle+'" href="'+D1.Link+'">'+D1.FullTitle+'</a></h3>';
}


/* 
>> MainSlider
====================== */
if(slider){
if(listSlide){
htmlContent += '<div class="post-image caption-img">',
htmlContent += '<a title="'+D1.FullTitle+'" class="image Lazy" href="'+D1.Link+'">',
htmlContent += D1.CategoryName,
htmlContent += '<img alt="'+D1.FullTitle+'" class="lazyload" data-sizes="auto" data-src="'+D1.ImgUrl+'"/>',
htmlContent += '</a>',
htmlContent += '<button aria-label="Read it Later" class="snackbar-btn tooltipped postSave" data-tooltip="اقرأها لاحقا" type="button" data-duration="4000">',
htmlContent += '<svg fill="none" height="16" stroke="var(--key)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
htmlContent += '</button>',              
htmlContent += '</div>',
htmlContent += '<div class="caption">',
htmlContent += det(),
htmlContent += '<h3 role="heading" class="post-title caption-title"><a title="'+D1.FullTitle+'" href="'+D1.Link+'">'+D1.Title+'</a></h3>',
htmlContent += sideSlide ? '<p class="post-snippet">'+D1.SnippetShorten+'</p>' : '',
htmlContent += '</div>';
} else {
htmlContent += '<div class="post-image">',
htmlContent += '<a title="'+D1.FullTitle+'" class="image Lazy" href="'+D1.Link+'">',
htmlContent += '<img alt="'+D1.FullTitle+'" class="lazyload" data-sizes="auto" data-src="'+D1.ImgUrl+'"/>',
htmlContent += '</a>',
htmlContent += '<button aria-label="Read it Later" class="snackbar-btn tooltipped postSave" data-tooltip="اقرأها لاحقا" type="button" data-duration="4000">',
htmlContent += '<svg fill="none" height="16" stroke="var(--key)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
htmlContent += '</button>',              
htmlContent += '</div>',
htmlContent += '<div class="caption-outside">',
htmlContent += D1.CategoryLink,
htmlContent += det(),
htmlContent += '<h3 role="heading" class="post-title"><a title="'+D1.FullTitle+'" href="'+D1.Link+'">'+D1.Title+'</a></h3>',
htmlContent += '</div>';
}
}

/* 
>> Allcats
====================== */
if(allcats){
htmlContent += det();
htmlContent += '<h4 role="heading" class="post-title" data-altsrc="'+D1.ImgUrl+'">',
htmlContent += '<button aria-label="Read it Later" class="snackbar-btn tooltipped postSave" data-tooltip="اقرأها لاحقا" type="button" data-duration="4000">',
htmlContent += '<svg fill="none" height="16" stroke="var(--key)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
htmlContent += '</button>',
htmlContent += '<a title="'+D1.FullTitle+'" href="'+D1.Link+'">'+D1.Title+'</a>',
htmlContent += '</h4>';
}

htmlContent += '</'+articleType+'>';




}

return htmlContent + '</'+sectionType+'>';
}

/*============================================================
-->> Canvas()
==============================================================*/
function CanvasFun(KR) {
  const Kj = KR.getElementsByTagName("canvas")[0];
  const Kz = Kj.width;
  const Kc = Kj.height;
  const Kv = Kj.getContext('2d');

  Kv.lineWidth = 3;
  Kv.strokeStyle = '#fff';
  Kv.shadowBlur = 1;
  Kv.shadowColor = "rgba(0,0,0,0.3)";

  const Ks = Kz / 2;
  const Kb = Kc / 2;
  const KS = 20;
  const Km = 25;
  const KN = 0;
  const KG = 100;
  let Kf = 0;

  (function KF(KV) {
    Kv.clearRect(0, 0, Kz, Kc);
    Kv.beginPath();
    Kv.arc(Ks, Kb, KS, KN, KV, false);
    Kv.stroke();
    Kf++;
    if (Kf < KG + 1) {
      requestAnimationFrame(function () {
        KF(Km * Kf / 100 + KN);
      });
    }
  }());
}


/*============================================================
-->> loadPostsOnView()
==============================================================*/

function loadPostsOnView(event) {
if (!document.querySelector(".posts-from")) return;
const elements = document.querySelectorAll(".posts-from");
for (let i = 0, len = elements.length; i < len; i++) {
const element = elements[i],
label = element.getAttribute("data-label"),
number = element.getAttribute("data-number"),
index = element.getAttribute("data-index"),
elementTop = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
let url, moreLink;
if (label === "TheRecent") {
url = `${BlogUrl}feeds/posts/summary/?alt=json&start-index=${index}&max-results=${number}`;
moreLink = SearchUrl + `?max-results=${getMaxResults}`;
} else if (label === "TheRandom") {
const randomIndex = Math.floor(PostCount / 2),
startIndex = Math.abs(Math.floor(Math.random() * randomIndex + 1));
url = `${BlogUrl}/feeds/posts/summary/?alt=json&start-index=${startIndex}&max-results=${number}`;
moreLink = SearchUrl + `?max-results=${getMaxResults}`;
} else if (label === "randomPostLabel") {
const labelName = element.getAttribute("data-label-name"),
randomIndex = Math.floor(Q[labelName] - number),
startIndex = Math.abs(Math.floor(Math.random() * randomIndex + 1));
url = `${BlogUrl}feeds/posts/summary/-/${encodeURIComponent(labelName)}?alt=json&start-index=${startIndex}&max-results=${number}`;
} else {
url = `${BlogUrl}feeds/posts/summary/-/${encodeURIComponent(label)}?alt=json&start-index=${index}&max-results=${number}`;
moreLink = SearchUrl + `/label/${encodeURIComponent(label)}?max-results=${getMaxResults}`;
}

function joinData(parent,loaderElement){
fetchData(
url,
function () {
if (loaderElement && !loaderElement.querySelector(".LoaderCall")) {
loaderElement.insertAdjacentHTML("beforeend", '<i class="LoaderCall"></i>');
}
},
function (data) {
const headlineMoreBtn = parent.querySelector(".headline .MoreBtn");
if (headlineMoreBtn) {
headlineMoreBtn.href = moreLink;
parent.classList.add("post-from-tag");
}

if(element.getAttribute("data-type").includes("slider")){
element.closest('.top-section').querySelector('.last-box .top').innerHTML = GetHtml(data, element, 0, 1,true,false);
element.closest('.top-section').querySelector('.last-box .bottom').innerHTML = GetHtml(data, element, 1, 2,true,false);
element.closest('.main-slider').querySelector('.bottom-section .one-box').innerHTML = GetHtml(data, element, 2, 3);
element.closest('.main-slider').querySelector('.bottom-section .two-box').innerHTML = GetHtml(data, element, 3, 4);
element.parentElement.innerHTML = GetHtml(data, element, 4, data.feed.entry.length,true,true);
gtSlider(() => {
setSlides('.m-slider', '#HTML3','fade', 1, false, true, 0, false,true,true);
});



}

if(element.getAttribute("data-type") !== "slider" && element.getAttribute("data-type") !== "tikcernews"){
element.parentElement.innerHTML = GetHtml(data, element, 0, data.feed.entry.length);
}

loadClass();

/* Mega */
if (event && (event.type !== "scroll" || event.type !== "run") && document.querySelector("#menu-bar .MegaMenu") && element.getAttribute("data-type").includes("mega")) {
const megaMenus = document.querySelectorAll(".MegaMenu");
for (let j = 0, len2 = megaMenus.length; j < len2; j++) {
const megaMenu = megaMenus[j],
posts = megaMenu.querySelectorAll(".mega-3 .post");
for (let k = 0, len3 = posts.length; k < len3; k++) {
const post = posts[k];
CanvasFun(post);
post.querySelector(".fa-video").style.transform = "scale(1)";
}
megaMenu.addEventListener("mouseenter", function () {
for (let l = 0; l < posts.length; l++) {
CanvasFun(posts[l]);
posts[l].querySelector(".fa-video").style.transform = "scale(1)";
}
});

megaMenu.addEventListener("mouseleave", function () {
for (let m = 0; m < posts.length; m++) {
posts[m].querySelector(".fa-video").style.transform = "scale(0)";
}
});
}
}

/* Ticker */
if (document.querySelector("#HTML2") && element.getAttribute("data-type") === "tikcernews") {
getScript("https://host.iscodi.com/assets/js/ticker.min.js?v=1", function () {
element.parentElement.innerHTML = GetHtml(data, element, 0, data.feed.entry.length);
new IsCodiTicker('.ticker-content');
});
}


},
function (){
element.parentElement.innerHTML = Error[0];
}
);
}


if (event && (event.type !== "run" && event.type !== "scroll") && window.pageYOffset + window.innerHeight > elementTop && !element.classList.contains("loadclass")) {
element.classList.add("loadclass");
const parent = element.parentElement.parentElement,
loaderElement = parent.classList.contains("MegaMenu")? parent.querySelector(".widget-content") : false;
joinData(parent,loaderElement)
}
if (event && (event.type === "run") && !element.classList.contains("loadclass")) {
element.classList.add("loadclass");
const parent = element.parentElement.parentElement;
joinData(parent)
}

if (event && event.type === "scroll" && !element.classList.contains("loadclass")) {
let ticking = false;
function checkVisibility() {
if (!element.classList.contains("loadclass")) {
const parent = element.parentElement.parentElement;
const rect = parent.getBoundingClientRect();
if (rect.top < window.innerHeight && rect.bottom > 0) {
element.classList.add("loadclass");
joinData(parent);
}
}
const allLoaded = Array.from(elements).every(el => el.classList.contains("loadclass"));
if (allLoaded) {
window.removeEventListener("scroll", onScroll);
}
ticking = false;
}
function onScroll() {
if (!ticking) {
requestAnimationFrame(checkVisibility);
ticking = true;
}
}
window.addEventListener("scroll", onScroll);
checkVisibility();
}


}

}


/*============================================================
-->> MegaMenu()
==============================================================*/
if (window.innerWidth > 992 && document.querySelector('#menu-bar .MegaMenu')) {
  const megaMenus = document.querySelectorAll(".MegaMenu");
  for (let i = 0, len = megaMenus.length; i < len; i++) {
    (function(item) {
      item.addEventListener("mouseenter", function(event) {
        const megaContent = item.querySelector(".mega-content");
        if (megaContent) {
          const link = item.querySelector('a');
          if (link.dataset.info) {
            try {
              const megaData = JSON.parse(link.dataset.info);
              link.href = `${SearchUrl}/label/${encodeURIComponent(megaData.mglabel)}?max-results=${getMaxResults}`;
              megaContent.setAttribute('data-label', megaData.mglabel);
              megaContent.setAttribute("data-type", megaData.mgstyle);
              megaContent.classList.add("posts-from");
            } finally {
              loadPostsOnView(event);
              link.removeAttribute('data-info');
            }
          }
        }
      });
    })(megaMenus[i]);
  }
}







/*============================================================
-->> Bookmark()
==============================================================*/



let list = {},
clItem = false;
document.getElementById("bookmark-count").classList.add('active');
document.getElementById("bookmark-count").textContent = '0';
function pushToStorage(data) {
if (typeof Storage !== "undefined") {
localStorage.setItem("list", JSON.stringify(data));
}
}
function clearBookmarks() {
const wrapper = document.querySelector(".bookmarks-list"),
posts = wrapper.querySelector(".bm-posts"),
clearAll = wrapper.querySelector(".clearAll"),
bmDetails = wrapper.querySelector(".bmDetails");
if (Object.keys(list).length > 0) {
clearAll.classList.remove('hide');
bmDetails.classList.add('hide');
} else {
clearAll.classList.add('hide');
bmDetails.classList.remove('hide');
}
clearAll.addEventListener("click", () => {
list = {};
posts.innerHTML = "";
clearAll.classList.add('hide');
bmDetails.classList.remove('hide');
localStorage.removeItem("list");
countBookmarks();
const elements = document.querySelectorAll(".post .postSave.filled");
if (elements.length > 0) {
for (let i = 0; i < elements.length; i++) {
elements[i].classList.remove("filled");
}
}

});
}
function countBookmarks() {
const bmCount = document.getElementById("bookmark-count"),
count = Object.keys(list).length;
if (count > 0) {
if(!bmCount.closest('.menubtn').classList.contains('active')){
bmCount.parentElement.classList.add('an-extra-alt');
}
const icon = document.createElement('i');
icon.className = 'fa fa-bookmark';
bmCount.nextElementSibling.replaceWith(icon);
if (count < 10) {
bmCount.textContent = count;
} else {
bmCount.textContent = '+9';
}
} else {
bmCount.parentElement.classList.remove('an-extra-alt');
const icon = document.createElement('i');
icon.className = 'fa fa-bookmark-slash';
bmCount.nextElementSibling.replaceWith(icon);
bmCount.textContent = '0';
}
}
function loadClass() {
  const storedList = JSON.parse(localStorage.getItem("list"));
  if (!storedList) return;

  const posts = document.querySelectorAll(".cates .post");
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const key = post.getAttribute("data-item");

    if (storedList[key]) {
      const saveBtn = post.querySelector(".postSave");
      if (saveBtn) saveBtn.classList.add("filled");
    }
  }
}

function loadExisting() {
const wrapperPosts = document.querySelector(".bookmarks-list .bm-posts"),
storedList = JSON.parse(localStorage.getItem("list"));
if (storedList){
list = storedList;




document.addEventListener("click", function(event) {
  const btn = event.target.closest('[data-target="vBookmarks"]');
  if (!btn) return;

  btn.classList.remove('an-extra-alt');

  const keys = Object.keys(list);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!wrapperPosts.innerHTML.includes(key) && list[key]) {
      wrapperPosts.innerHTML += list[key];

    }
  }
});

countBookmarks();
loadClass();
}
clearBookmarks();
}
function showResults(element, title, id, imgStyle, link, category, fullTitle) {
let item = `<div class="post" data-item="${id}">
<button aria-label="Clear This Item" class="sp-btn snackbar-btn clearItem tooltipped" type="button" data-tooltip="حذف" data-duration="4000" data-type='error'><i class="fa fa-trash"></i></button>
<div class="post-image">
<a href="${link}" title="${fullTitle}" class="image Lazy smimg">
<img class="lazyload" alt="${fullTitle}" data-src="${imgStyle}" data-sizes="auto">
</a>
</div>
<div class="bookmark-details">
${category ? `<a class="category-link Categories cateback-${Math.floor(42 * Math.random() + 1)}" href="/search/label/${encodeURIComponent(category)}?max-results=${getMaxResults}">${category}</a>` : ''}
<h3 role="heading" class="post-title"><a title="${fullTitle}" href="${link}">${title}</a></h3>
</div>
</div>`;
if (list[id]) {
delete list[id];
pushToStorage(list);
for (const el of document.querySelectorAll(`.post[data-item='${id}'] .postSave`)){el.classList.remove("filled")}
if(document.querySelector(`.bookmarks-list .bm-posts .post[data-item='${id}']`)){document.querySelector(`.bookmarks-list .bm-posts .post[data-item='${id}']`).remove()};
} else {
list[id] = item;
pushToStorage(list);
for (const el of document.querySelectorAll(`.post[data-item='${id}'] .postSave`)){el.classList.add("filled")}
item?document.querySelector(".bookmarks-list .bm-posts").innerHTML += item : '';
}
document.addEventListener("click", function(event) {
const btn = event.target.closest('[data-target="vBookmarks"]');
if (!btn) return;
btn.classList.remove('an-extra');
});
countBookmarks();
clearBookmarks();
}
loadExisting();

document.addEventListener("click", function(event) {
const btn = event.target.closest(".postSave");
if (!btn) return;
const post = btn.closest(".post");
if (!post) return;
if(btn.classList.contains('filled')){
btn.setAttribute('data-type','error');
if(Object.keys(list).length === 1){
btn.setAttribute('data-message','تم إلغاء حفظ جميع المشاركات');
} else{
btn.setAttribute('data-message','تم إلغاء الحفظ');
}
} else {
btn.setAttribute('data-type','success');
btn.setAttribute('data-message','تم الحفظ بنجاح');
}
const title = post.querySelector(".post-title a").textContent,
fullTitle = post.querySelector(".post-title a").getAttribute('title'),
id = post.dataset.item,
imgStyle = post.querySelector(".post-image img") ? post.querySelector(".post-image img").getAttribute('src') : post.querySelector(".post-title").getAttribute('data-altsrc'),
link = post.querySelector(".post-title a").href,
category = post.dataset.cate && post.dataset.cate !== 'بدون تسمية' ? post.dataset.cate : false;
showResults(btn, title, id, imgStyle, link, category, fullTitle);
});


document.addEventListener("click", function(event) {
const trash = event.target.closest(".clearItem");
if (!trash) return;
const post = trash.closest('.post'),
id = post.dataset.item,
listCount = Object.keys(list).length;
if(listCount === 1){
trash.setAttribute('data-message','تم إلغاء حفظ جميع المشاركات');
const getDataId = post.querySelector(`.tooltipped`).getAttribute('data-tooltip-id');
document.querySelector(".bookmarks-list .clearAll").click();
if(document.getElementById(getDataId)){document.getElementById(getDataId).remove()};
} else {
if (list[id]) {
delete list[id];
pushToStorage(list);
trash.setAttribute('data-message','تم إلغاء الحفظ');
for (const el of document.querySelectorAll(`.post[data-item='${id}'] .postSave.filled`)){el.classList.remove("filled")}
const getDataId = post.querySelector(`.tooltipped`).getAttribute('data-tooltip-id');
post.remove();
if(document.getElementById(getDataId)){document.getElementById(getDataId).remove()};
}
countBookmarks();
}
});

/*============================================================
-->> Snakbar()
==============================================================*/
const snackbarQueue = [];
let snackbarVisible = false,
snackbarTimer = null,
hideAt = 0,
remainingTime = 0;
document.addEventListener('click', function(event) {
const button = event.target.closest('.snackbar-btn');
if (!button) return;
const message = button.getAttribute('data-message'),
actionText = button.getAttribute('data-action') || '',
duration = parseInt(button.getAttribute('data-duration')) || 5000,
type = button.getAttribute('data-type') || 'neutral',
actionHandler = button.getAttribute('data-handler') || null;
showSnackbar(message, actionText, actionHandler, duration, type);
});
function showSnackbar(message, actionText = '', actionHandler = null, duration = 5000, type = 'neutral') {
const newSnackbar = { message, actionText, actionHandler, duration, type };
if (snackbarVisible) {
clearTimeout(snackbarTimer);
const snackbar = document.getElementById('snackbar');
snackbar.classList.remove('show');
snackbar.parentElement.fadeOut('100');
snackbar.classList.add('hide');
setTimeout(() => {
snackbar.className = '';
snackbarQueue.unshift(newSnackbar);
displayNextSnackbar();
}, 100);
snackbarVisible = false;
} else {
snackbarQueue.push(newSnackbar);
displayNextSnackbar();
}
}
function displayNextSnackbar() {
if (snackbarQueue.length === 0) return;
const { message, actionText, actionHandler, duration, type } = snackbarQueue.shift();
snackbarVisible = true;
const snackbar = document.getElementById('snackbar'),
msg = document.getElementById('snackbar-message'),
icon = document.getElementById('snackbar-icon'),
actionBtn = document.getElementById('snackbar-action'),
closeBtn = document.getElementById('snackbar-close');
const icons = {
success: '<i class="fa fa-badge-check"></i>',
error: '<i class="fa fa-badge-xmark"></i>',
warning: '<i class="fa fa-alert"></i>',
gift: '<i class="fa fa-gift"></i>',
neutral: '<i class="fa fa-info"></i>'
};
snackbar.className = '';
snackbar.parentElement.fadeIn('100','flex');
snackbar.classList.add(type, 'show');
icon.innerHTML = icons[type] || '';
msg.textContent = message;
if (actionText) {
actionBtn.textContent = actionText;
actionBtn.style.display = 'inline';
actionBtn.onclick = () => {
if (actionHandler && typeof window[actionHandler] === 'function') {
window[actionHandler]();
}
hideSnackbar();
};
} else {
actionBtn.style.display = 'none';
}
closeBtn.onclick = hideSnackbar;
remainingTime = duration;
hideAt = Date.now() + duration;
clearTimeout(snackbarTimer);
snackbarTimer = setTimeout(hideSnackbar, duration);
}
function hideSnackbar() {
const snackbar = document.getElementById('snackbar');
snackbar.classList.remove('show');
snackbar.parentElement.fadeOut('100');
snackbar.classList.add('hide');
clearTimeout(snackbarTimer);
snackbarVisible = false;
setTimeout(() => {
snackbar.className = '';
if (snackbarQueue.length > 0) displayNextSnackbar();
}, 300);
}
window.addEventListener('blur', () => {
if (snackbarVisible && hideAt > Date.now()) {
remainingTime = hideAt - Date.now();
clearTimeout(snackbarTimer);
}
});
window.addEventListener('focus', () => {
if (snackbarVisible && remainingTime > 0) {
hideAt = Date.now() + remainingTime;
snackbarTimer = setTimeout(hideSnackbar, remainingTime);
remainingTime = 0;
}
});

/*============================================================
-->> AutoSearch()
==============================================================*/
AutoSearch('#searchInput','#search-results');
function AutoSearch(searchInput, searchContainer) {
const searchIn = document.querySelector(searchInput),
searchCn = document.querySelector(searchContainer);
let isInputActive = false;

searchIn.addEventListener('input', debounce(function() {
searchEvents();
},500));
searchIn.addEventListener('focus', searchEvents);



document.addEventListener('click', function(event){
const btn = event.target.closest('.search-open'),
searchOverlay = event.target.closest('.outer_overlay');
if(btn){
document.querySelector('.head-down').slideToggle(200,'block');
document.querySelector('.outer_overlay').fadeToggle(200,'block');
document.querySelector('.inner-container').classList.toggle('filter');
} else if(searchOverlay){
document.querySelector('.search-open').click();
} else{
return;
}
});





function searchEvents() {
isInputActive = true;
const searchQuery = searchIn.value;

if (!searchQuery) {
searchCn.innerHTML = '';
searchCn.classList.remove('search-active');
searchCn.fadeOut('100');
return;
}

fetchData(`${BlogUrl}feeds/posts/summary/?alt=json&start-index=1&max-results=999999999`,
() => {
if(!searchCn.querySelector('.LoaderCall')){
searchCn.innerHTML = '<i class="LoaderCall"></i>';
}
searchCn.classList.add('search-active');
searchCn.fadeIn('100', 'flex');
},
(data) => {
const entries = data.feed.entry,
filteredResults = filterResults(entries, searchQuery);
displayResults(filteredResults, searchCn, searchQuery);
},
(error) => {
searchCn.textContent = Msg.noResultsFound;
searchCn.classList.add('search-active');
searchCn.fadeIn('100', 'flex');
}
);
}

document.addEventListener('click', function (event) {
if (
searchIn &&
searchCn &&
!event.target.closest(searchInput) &&
!event.target.closest(searchContainer) &&
searchCn.classList.contains('search-active')
) {
isInputActive = false;
searchCn.innerHTML = '';
searchCn.classList.remove('search-active');
searchCn.fadeOut(100);
}
});

// تصفية النتائج بناءً على استعلام البحث
function filterResults(entries, searchQuery) {
return entries.filter(entry => {
const title = entry.title.$t.toLowerCase();
const query = searchQuery.toLowerCase();
return title.includes(query);
});
}

// تمييز النص المطابق
function highlightText(text, query) {
const regex = new RegExp(`(${query})`, 'gi');
return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// عرض النتائج في الواجهة
function displayResults(results, container, searchQuery) {
container.innerHTML = '';

if (results.length === 0) {
container.textContent = Msg.noResultsFound;
container.classList.add('search-active');
container.fadeIn('100', 'flex');
} else {

for (let i = 0, len = results.length; i < len; i++) {
  const result = results[i];
  const D1 = elemFeed(result);
  const highlightedTitle = highlightText(D1.FullTitle, searchQuery);
  const resultHtml = `
    <div class="search-result">
      <a title="${D1.FullTitle}" href="${D1.Link}">
        <div class="image Lazy smimg">
          <img class="lazyload" data-sizes="auto" data-src="${D1.ImgUrl}" alt="${D1.FullTitle}"/>
        </div>
        <h3 role="heading" class="post-title">${highlightedTitle}</h3>
      </a>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', resultHtml);
}

container.classList.add('search-active');
container.fadeIn('100', 'flex');
}
}

function debounce(func, delay) {
let timer;
return function() {
clearTimeout(timer);
timer = setTimeout(() => {
func.apply(this, arguments);
}, delay);
};
}
} // End autoSearch()

/*============================================================
-->> textFields()
==============================================================*/
function textFields() {
const forms = document.querySelectorAll('.codi-form');
for (let f = 0; f < forms.length; f++) {
const form = forms[f],
fields = form.querySelectorAll('input, textarea');
if (fields.length > 0) {
for (let i = 0; i < fields.length; i++) {
const field = fields[i];
field.addEventListener('blur', () => validateField(field));
}
}
function validateField(input) {
const wrapper = input.closest('.codi-field'),
type = wrapper?.dataset.validate,
icon = wrapper?.querySelector('.status-icon');
let valid = true;
if (type === 'required') {
valid = input.value.trim() !== '';
} else if (type === 'email') {
valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
}
if (wrapper) {
wrapper.classList.toggle('error', !valid);
wrapper.classList.toggle('valid', valid);
}
if (icon) icon.textContent = valid ? '<i class="fa fa-badge-check"></i>' : '<i class="fa fa-badge-xmark"></i>';
return valid;
}
form.addEventListener('submit', function (e) {
let allValid = true;
const inputs = this.querySelectorAll('input, textarea');
for (let j = 0; j < inputs.length; j++) {
if (!validateField(inputs[j])) allValid = false;
}
if (!allValid) e.preventDefault();
});
const resetBtn = form.querySelector('#resetFields');
if (resetBtn) {
resetBtn.addEventListener('click', () => {
form.reset();
const wrappers = form.querySelectorAll('.codi-field');
for (let k = 0; k < wrappers.length; k++) {
wrappers[k].classList.remove('error', 'valid');
}
});
}
}
}

/*============================================================
-->> Services()
==============================================================*/
function ServiceFun(){
const linkList = document.querySelector("#LinkList3");
if (!linkList) return;
const items = document.querySelectorAll("#LinkList3 li a");
for (let i = 0; i < items.length; i++) {
const s = items[i],
nameSer = s.dataset.link;
if (nameSer) {
const [title, desc, href] = nameSer.split("+").map(v => v.trim());
if (!s.querySelector(".service-title")) {
s.insertAdjacentHTML('beforeend', `<span class='service-title an-up'>${title}</span>`);
}
if (!s.querySelector(".service-description")) {
s.insertAdjacentHTML('beforeend', `<span class='service-description an-up'>${desc}</span>`);
}
if (href) {
s.setAttribute("href", href);
const attrs = ["aria-disabled", "role", "onclick"];
for (let i = 0; i < attrs.length; i++) {
s.removeAttribute(attrs[i]);
}
}
s.removeAttribute("data-link");
if (s.getAttribute("href") === "#") {
s.classList.add("nolink-service");
}
}
}
if(ServiceGrid){
linkList.querySelector('.posts-loading') && (linkList.querySelector('.posts-loading').remove());
linkList.querySelector('.services-wrapper').fadeIn(300,'block');
}
}



/*============================================================
-->> GlobalSlider()
==============================================================*/
gtSlider(() => {
setSlides('.categories-wrapper', '#Label2','slide', 4, true, false, 20, true, 3, 2, 1);
!ServiceGrid ? setSlides('.services-wrapper', '#LinkList3','slide', 4, true, false, 20, true, 3, 2, 1, false, false, ServiceFun) : ServiceFun();
});

})();