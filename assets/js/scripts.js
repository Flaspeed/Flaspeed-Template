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





})();