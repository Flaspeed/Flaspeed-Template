let getThisId,
lastPost;

document.addEventListener("click", function(event) {
const btn = event.target.closest(".postSave");
if (!btn) return;
const post = btn.closest(".post");
if (!post) return;
if(btn.classList.contains('filled')){
btn.setAttribute('data-duration','7000');
btn.setAttribute('data-type','error');
btn.setAttribute('data-message','تم الغاء الحفظ');
btn.setAttribute('data-action','إستعادة');
btn.setAttribute('data-handler','restoreSave');
getThisId = post.dataset.item;
lastPost = post;
}else{
btn.removeAttribute('data-action');
btn.removeAttribute('data-handler');
btn.setAttribute('data-duration','4000');
btn.setAttribute('data-type','success');
btn.setAttribute('data-message','تم الحفظ بنجاح');
}
const title = post.querySelector(".post-title a").textContent,
fullTitle = post.querySelector(".post-title a").getAttribute('title'),
id = post.dataset.item,
imgStyle = post.querySelector(".post-image img").getAttribute('src'),
link = post.querySelector(".post-image a.image").href,
category = post.dataset.cate ? post.dataset.cate : false;
showResults(btn, title, id, imgStyle, link, category,fullTitle);
});
// تعريف دالة restoreSave
window.restoreSave = function() {
if (getThisId && lastPost) {
const btn = lastPost.querySelector('.postSave');
if (btn && !btn.classList.contains('filled') && getThisId === lastPost.dataset.item) {
btn.click(); // إعادة الضغط تلقائياً
}
}
}