Element.prototype.appendElements = function (J, m) {
var h = this,
w = document.createElement('template');
w.innerHTML = J;
for (const M of Array.from(w.content.children)) {
if (M.nodeName === 'SCRIPT') {
var c = document.createElement('script');
if (M.src !== '') c.src = M.src;
if (M.async !== undefined) c.async = M.async;
if (M.defer !== undefined) c.defer = M.defer;
if (M.textContent !== '') c.textContent = M.textContent;
h[m](c);
} else {
h[m](M);
}
}
};
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
var Kj = document.querySelector("#blogger-components").innerHTML.replace(/(\<\!\-\-|\-\-\>)/g, ''),
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
-->> MainMenu()
==============================================================*/
function MainMenu() {
if (document.querySelector('.menu-bar > ul > li')) {
var mainItems = document.querySelectorAll('.menu-bar > ul > li');
for (var i = 0, len = mainItems.length; i < len; i++) {
mainItems[i].setAttribute('id', 'listitem-' + i);
}
}
var menuItems = document.querySelectorAll('.menu-bar li');
for (var j = 0, len2 = menuItems.length; j < len2; j++) {
var emptyList = menuItems[j].querySelector('ul:empty');
if (emptyList) {
emptyList.remove();
}
}
if (document.querySelector('#menu-bar ul li > a')) {
var titleLinks = document.querySelectorAll('#menu-bar ul li > a:not(.homeicon)');
for (var k = 0, len3 = titleLinks.length; k < len3; k++) {
var currentTitle = titleLinks[k].getAttribute('title');
titleLinks[k].setAttribute('title', currentTitle.replace(/(<[^>]*>|_)/g, '').replace(/#/g, ''));
}
}
if (document.querySelector('#menu-bar .subMenu a')) {
var subMenuLinks = document.querySelectorAll('#menu-bar .subMenu a');
for (var l = 0, len4 = subMenuLinks.length; l < len4; l++) {
subMenuLinks[l].innerHTML = subMenuLinks[l].innerHTML.replace(/_/g, '').replace(/#/g, '');
}
}
if (document.querySelector('#menu-bar .MegaMenu > ul')) {
var megaUl = document.querySelectorAll('#menu-bar .MegaMenu > ul');
for (var m = 0, len5 = megaUl.length; m < len5; m++) {
if (megaUl[m]) {
megaUl[m].remove();
}
}
}
if (document.querySelector('.menu-bar > ul > li:not(.sub-menu) > ul')) {
var nonSubMenus = document.querySelectorAll('.menu-bar > ul > li:not(.sub-menu) > ul');
for (var n = 0, len6 = nonSubMenus.length; n < len6; n++) {
if (nonSubMenus[n]) {
nonSubMenus[n].remove();
}
}
}
if (document.querySelector('.nav-drawer #menu-bar .sub-menu > a')) {
var navSubLinks = document.querySelectorAll('.nav-drawer #menu-bar .sub-menu > a');
for (var o = 0, len7 = navSubLinks.length; o < len7; o++) {
navSubLinks[o].addEventListener('click', function(evt) {
evt.preventDefault();
var sibling = this.nextElementSibling;
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
var megaLinks = document.querySelectorAll(".MegaMenu a");
for (var p = 0, len8 = megaLinks.length; p < len8; p++) {
var linkElem = megaLinks[p];
if (linkElem.dataset.info) {
var parsedInfo = JSON.parse(linkElem.dataset.info);
var labelVal = parsedInfo.mglabel;
linkElem.setAttribute("href", `${SearchUrl}/label/${encodeURIComponent(labelVal)}?max-results=${getMaxResults}`);
linkElem.removeAttribute('data-info');
}
}
}
document.addEventListener("click", function(event) {
var btnElem = event.target.closest('.openNavMobile');
if (!btnElem) return;
megaClick();
});
}


/*============================================================
-->> elemFeed()
==============================================================*/
function elemFeed(Jx) {
var JR = {},
Jq = Jx.link.filter(function (JI) {
return JI.rel == 'alternate';
})[0].href;
JR.Link = Jq.startsWith('http://') ? Jq.replace('http://', 'https://') : Jq;

/* ======================================================================
> Categorys [Section]
=========================================================================*/
JR.Category = Jx.category?.[0]?.term || "بدون تسمية";
JR.Categorys = Jx.category?.map(item => item.term) || [];
JR.CategoryName = JR.Categorys.length > 0 ? `<span class="Category cateback-${Math.floor(42 * Math.random() + 1)}">${JR.Category}</span>` : "";
JR.CategoryLink = JR.Categorys.length > 0 ? `<a class="category-link" href="/search/label/${encodeURIComponent(JR.Category)}?max-results=${getMaxResults}">${JR.Category}</a>` : "";

if(JR.Link !== ''){
JR.Title = Jx.title.$t;
JR.FullTitle = Jx.title.$t;
if (MaxTitle && JR.FullTitle.split(" ").length > MaxTitleNum) {
JR.Title = JR.FullTitle.split(" ").slice(0, MaxTitleNum).join(" ") + "..."
}

JR.Snippet = (Jx.summary?.$t || Jx.content?.$t || "").replace(/<\S[^>]*>/g, "");
JR.SnippetShorten = JR.Snippet.substr(0, snippetLength) + "...";

/* ======================================================================
> Date [Section]
=========================================================================*/
JR.FullDate = Jx.published.$t;
JR.UpDate = Jx.updated.$t;
JR.Date = timeAgo ? langDate(JR.UpDate) : `${JR.FullDate.substr(8, 2)} ${langDate(JR.FullDate)} ${JR.FullDate.substr(0, 4)}`;
JR.Format = `${BlogUrl}${JR.FullDate.substr(0, 10).replace(/-/g, "_")}_archive.html`;
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
function GetHtml(data,element){
const mega = element.getAttribute("data-type").includes("mega"),
megatwo = element.getAttribute("data-type") === 'mega-2',
megathree = element.getAttribute("data-type") === 'mega-3',
sided = element.getAttribute("data-type").includes("sided"),
cover = element.getAttribute("data-type").includes("cover"),
semicov = element.getAttribute("data-type").includes("semicov"),
video = element.getAttribute("data-type").includes("video"),
small = element.getAttribute("data-type").includes("small"),
noimage = element.getAttribute("data-type").includes("noimage"),
slider = element.getAttribute("data-type").includes("slider"),
carousel = element.getAttribute("data-type").includes("carousel"),
timeline = element.getAttribute("data-type").includes("timeline"),
grid = element.getAttribute("data-type").includes("grid");

let htmlContent = '';
htmlContent += '<section class="cates '+element.getAttribute("data-type")+'">';
for (let i = 0; i < 24; i++) {
const entry = data.feed.entry[i];
if (i === data.feed.entry.length) break;
let D1 = elemFeed(entry);

function det(){
let htmlDet = '';
htmlDet += '<div class="details">',
htmlDet += !mega ? D1.AuthTagNameElem : '',
htmlDet += D1.LinkDate,
htmlDet += D1.NumComUrl;
return htmlDet + '</div>';
}
htmlContent += '<article class="post post-'+i+' an-up" data-item="'+D1.PostId+'" data-cate="'+D1.Category+'">';
if(mega){
htmlContent += '<div class="post-image">',
htmlContent += '<a title="'+D1.FullTitle+'" class="image Lazy" href="'+D1.Link+'">',
htmlContent += !megatwo ? D1.CategoryName : '',
htmlContent += megathree ? '<canvas id="bar" width="50" height="50"></canvas>' : '',
htmlContent += megathree ? '<i class="fa fa-video"></i>' : '',
htmlContent += '<img alt="'+D1.FullTitle+'" data-src="'+D1.ImgUrl+'"/>',
htmlContent += '</a>',
htmlContent += '<button aria-label="Read it Later" class="tooltipped postSave" data-tooltip="اقرأها لاحقاً" type="button" aria-pressed="false">',
htmlContent += '<svg fill="none" height="16" stroke="var(--key)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
htmlContent += '</button>',              
htmlContent += '</div>';
if(megatwo){
htmlContent += '<div class="mginfo-wrap">';
}
htmlContent += det();
htmlContent += '<h3 class="post-title"><a title="'+D1.FullTitle+'" href="'+D1.Link+'">'+D1.Title+'</a></h3>';
if(megatwo){
htmlContent += '</div>';
}
}

htmlContent += '</article>';

}

return htmlContent + "</section>"
}

/*============================================================
-->> Canvas()
==============================================================*/
function CanvasFun(KR) {
var Kj = KR.getElementsByTagName("canvas")[0],
Kz = Kj.width,
Kc = Kj.height,
Kv = Kj.getContext('2d');
Kv.lineWidth = 4;
Kv.strokeStyle = '#fff',
Kv.shadowBlur = 1;
Kv.shadowColor = "rgba(0,0,0,0.3)";
var Ks = Kz / 2,
Kb = Kc / 2,
KS = 20,
Km = 25,
KN = 0,
KG = 100,
Kf = 0;
(function KF(KV) {
Kv.clearRect(0, 0, Kz, Kc);
Kv.beginPath(),
Kv.arc(Ks, Kb, KS, KN, KV, false),
Kv.stroke(),
Kf++,
Kf < KG + 1 && requestAnimationFrame(function() {
KF(Km * Kf / 100 + KN);
});
}());
}


/*============================================================
-->> loadPostsOnView()
==============================================================*/
function loadPostsOnView(event) {
if(document.querySelectorAll(".posts-from")){
const elements = document.querySelectorAll(".posts-from");
for (let i = 0, len = elements.length; i < len; i++) {
const element = elements[i],
label = element.getAttribute("data-label"),
number = element.getAttribute("data-number"),
index = element.getAttribute("data-index"),
elementTop = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
let url, moreLink;
if (label === "lastPost") {
url = `${BlogUrl}feeds/posts/summary/?alt=json&start-index=${index}&max-results=${number}`;
moreLink = SearchUrl;
} else if (label === "randomPost") {
const randomIndex = Math.floor(PostCount / 2),
startIndex = Math.abs(Math.floor(Math.random() * randomIndex + 1));
url = `${BlogUrl}/feeds/posts/summary/?alt=json&start-index=${startIndex}&max-results=${number}`;
moreLink = SearchUrl;
} else if (label === "randomPostLabel") {
const labelName = element.getAttribute("data-label-name"),
randomIndex = Math.floor(Q[labelName] - number),
startIndex = Math.abs(Math.floor(Math.random() * randomIndex + 1));
url = `${BlogUrl}feeds/posts/summary/-/${encodeURIComponent(labelName)}?alt=json&start-index=${startIndex}&max-results=${number}`;
} else {
url = `${BlogUrl}feeds/posts/summary/-/${encodeURIComponent(label)}?alt=json&start-index=${index}&max-results=${number}`;
moreLink = `${BlogUrl}search/label/${encodeURIComponent(label)}`;
}

if (window.pageYOffset + window.innerHeight > elementTop && !element.classList.contains("loadclass")) {
element.classList.add("loadclass");
const parentElement = element.parentElement.parentElement,
loaderElement = parentElement.classList.contains("MegaMenu")? parentElement.querySelector(".widget-content") : null;

fetchData(
url,
function () {
if (loaderElement && !loaderElement.querySelector(".LoaderCall")) {
loaderElement.insertAdjacentHTML("beforeend", '<i class="LoaderCall"></i>');
}
},
function (data) {
const headlineMoreBtn = parentElement.querySelector(".headline .MoreBtn");
if (headlineMoreBtn) {
headlineMoreBtn.href = moreLink;
parentElement.classList.add("post-from-tag");
}
element.parentElement.innerHTML = GetHtml(data, element);
LazyImages("data-src");
loadClass();

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
},
function (){
element.parentElement.innerHTML = Error[0];
}
);
}
if (event && event.type === "scroll" && !element.classList.contains("loadclass")) {
element.classList.add("loadclass");
}
}
}
}


/*============================================================
-->> MegaMenu()
==============================================================*/
if (window.innerWidth > 992 && document.querySelector('#menu-bar .MegaMenu')) {
var megaMenus = document.querySelectorAll(".MegaMenu");
for (var i = 0, len = megaMenus.length; i < len; i++) {
(function(item) {
item.addEventListener("mouseenter", function(event) {
var megaContent = item.querySelector(".mega-content");
if (megaContent) {
var link = item.querySelector('a');
if (link.dataset.info) {
try {
var megaData = JSON.parse(link.dataset.info);
link.href = SearchUrl + '/label/' + encodeURIComponent(megaData.mglabel) + '?max-results=' + getMaxResults;
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

})();