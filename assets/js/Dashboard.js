// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase, ref, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyArzd7D7GlXvGHs6axqYEaM60CMSA061vY",
authDomain: "flaspeed-database.firebaseapp.com",
projectId: "flaspeed-database",
databaseURL: "https://flaspeed-database-default-rtdb.firebaseio.com",
storageBucket: "flaspeed-database.firebasestorage.app",
messagingSenderId: "136826395842",
appId: "1:136826395842:web:987c8fe9d21ee60f4fef5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Authentication Functions
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.init();
        this.templateVersions = [];
    }

    init() {
        // Listen for auth state changes
        auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            if (user) {
                this.checkUserRole(user);
            } else {
                this.showLoginPage();
            }
        });

    }


    async signInWithGoogle() {
        try {
            // لا نعرض صفحة التحميل في البداية
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;


        } catch (error) {
            console.error('Google sign in error:', error);
            this.showError('فشل في تسجيل الدخول بجوجل', 'Google sign in failed');
        }
    }

    async signInWithEmail() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        if (!email || !password) {
            this.showError('يرجى ملء جميع الحقول', 'Please fill all fields');
            return;
        }

        try {

            const result = await signInWithEmailAndPassword(auth, email, password);

        } catch (error) {
            console.error('Admin sign in error:', error);
            let errorMessage = 'معلومات التسجيل غير صحيحة',
            errorMessageEn = 'Invalid registration details';

            this.showError(errorMessage, errorMessageEn);
        }
    }

    async checkUserRole(user) {
        try {
            // التحقق من طريقة تسجيل الدخول
            // نتحقق إذا كان المستخدم قد سجل الدخول عبر البريد الإلكتروني وكلمة المرور
            // وليس عبر حساب جوجل
            const providerId = user.providerData[0].providerId;

            if (providerId === 'password') {
                // التحقق من صلاحيات المشرف في قاعدة البيانات
                const adminRef = ref(db, `admins/${user.email.replace(/\./g, ',')}`); 
                const adminSnapshot = await get(adminRef);

                if (adminSnapshot.exists()) {
                    this.isAdmin = true;
                    // عرض لوحة تحكم المشرف
                    this.showAdminDashboard(user);

                } else {
                    // المستخدم ليس مشرفًا
                    this.showError('غير مصرح لك بالدخول كمشرف', 'Not authorized as admin');
                    // تسجيل الخروج
                    await signOut(auth);
                }
            } else if (providerId === 'google.com') {
                // المستخدم سجل الدخول باستخدام جوجل
                // توجيه المستخدم إلى صفحة المستخدم مع التحقق من حالته
                this.showUserDashboard(user);
            }

        } catch (error) {
            console.error('Error checking user role:', error);
            this.showError('حدث خطأ أثناء التحقق من صلاحياتك', 'Error checking your permissions');
        }
    }

    // تحديث بيانات المستخدم في لوحة التحكم
    updateUserDashboardData(userData, user) {
        try {
            // تخزين بيانات المستخدم الحالية للوصول إليها من دوال أخرى
            window.currentUserData = userData;

            // تحديث تفاصيل الحساب
            const registrationDate = document.getElementById('registrationDate');
            const userStatus = document.getElementById('userStatus');
            const supportDaysLeft = document.getElementById('supportDaysLeft');

            // تحديث تفاصيل الشراء
            const purchasedPlan = document.getElementById('purchasedPlan');
            const allowedActivations = document.getElementById('allowedActivations');
            const purchaseValue = document.getElementById('purchaseValue');
            const developerSignature = document.getElementById('developerSignature');
            const developerSignatureContainer = document.getElementById('developerSignatureContainer');

            // تحديث معلومات التفعيل
            const remainingActivations = document.getElementById('remainingActivations');
            const totalActivations = document.getElementById('totalActivations');

            // تعيين قيم تفاصيل الحساب
            if (userData.createdAt) {
                const date = new Date(userData.createdAt);
                registrationDate.textContent = date.toLocaleDateString('en-GB');
            } else {
                registrationDate.textContent = new Date().toLocaleDateString('en-GB');
            }


            // تعيين حالة المستخدم
            if (userData.status === 'active') {
                userStatus.textContent = userStatus.getAttribute('data-ar');
                userStatus.className = 'inline-flex mt-2 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full';
            } else if (userData.status === 'pending') {
                userStatus.textContent = 'قيد الانتظار';
                userStatus.setAttribute('data-ar', 'قيد الانتظار');
                userStatus.setAttribute('data-en', 'Pending');
                userStatus.className = 'inline-flex mt-2 px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full';
            } else if (userData.status === 'blocked') {
                userStatus.textContent = 'محظور';
                userStatus.setAttribute('data-ar', 'محظور');
                userStatus.setAttribute('data-en', 'Blocked');
                userStatus.className = 'inline-flex mt-2 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full';
            }

            // تعيين أيام الدعم المتبقية
            supportDaysLeft.textContent = userData.supportDays || '0';

            // تعيين تفاصيل الشراء
            const planName = userData.plan || 'basic';
            // تعيين سمات اللغة للخطة
            if (planName === 'basic') {
                purchasedPlan.setAttribute('data-ar', 'الأساسية');
                purchasedPlan.setAttribute('data-en', 'Basic');
            } else if (planName === 'pro') {
                purchasedPlan.setAttribute('data-ar', 'الإحترافية');
                purchasedPlan.setAttribute('data-en', 'Pro');
            } else if (planName === 'ultimate') {
                purchasedPlan.setAttribute('data-ar', 'الخارقة');
                purchasedPlan.setAttribute('data-en', 'Ultimate');
            } else {
                purchasedPlan.setAttribute('data-ar', planName);
                purchasedPlan.setAttribute('data-en', planName);
            }

            // تعيين النص بناءً على اللغة الحالية
            const currentLang = localStorage.getItem('language') || 'ar';
            purchasedPlan.textContent = currentLang === 'ar' ? purchasedPlan.getAttribute('data-ar') : purchasedPlan.getAttribute('data-en');

            allowedActivations.textContent = userData.activations || '1';
            purchaseValue.textContent = '$' + userData.purchaseValue || '$5';

            // التحقق من نوع الخطة لإظهار/إخفاء توقيع المطور
            const plan = userData.plan || 'basic';
            if (plan === 'basic') {
                developerSignature.textContent = developerSignature.getAttribute('data-ar');
                developerSignature.classList.add('bg-green-100', 'dark:bg-green-900/20', 'text-green-800', 'dark:text-green-300');
                developerSignatureContainer.style.display = 'flex';
            } else if (plan === 'pro' || plan === 'ultimate') {
                developerSignature.setAttribute('data-ar', 'مخفي');
                developerSignature.setAttribute('data-en', 'Hidden');
                const currentLang = localStorage.getItem('language') || 'ar';
                developerSignature.textContent = currentLang === 'ar' ? developerSignature.getAttribute('data-ar') : developerSignature.getAttribute('data-en');
                developerSignature.classList.add('bg-red-100', 'dark:bg-red-900/20', 'text-red-800', 'dark:text-red-300');
                developerSignatureContainer.style.display = 'flex';
            } else {
                developerSignatureContainer.style.display = 'flex';
            }

            // تحديث معلومات التفعيل
            const activatedBlogs = userData.activatedBlogs ? Object.keys(userData.activatedBlogs).length : 0;
            const total = userData.activations || 1;
            const remaining = Math.max(0, total - activatedBlogs);

            remainingActivations.textContent = remaining;
            totalActivations.textContent = total;

            // تطبيق اللغة المحفوظة
            applyLanguageToNewElements(document.getElementById('dashboard-conetnt'));

        } catch (error) {
            console.error('Error updating user dashboard data:', error);
        }
    }

    // تهيئة وظائف تفعيل المدونة
    initBlogActivation(userData, user) {
        const activateBlogBtn = document.getElementById('activateBlogBtn');
        const blogUrl = document.getElementById('blogUrl');

        if (activateBlogBtn && blogUrl) {
            activateBlogBtn.addEventListener('click', () => {
                const url = blogUrl.value.trim();
                if (!url) {
                    this.showError('يرجى إدخال رابط المدونة', 'Please enter blog URL');
                    return;
                }

                // التحقق من عدد التفعيلات المتبقية
                const activatedBlogs = userData.activatedBlogs ? Object.keys(userData.activatedBlogs).length : 0;
                const total = userData.activations || 1;
                const remaining = Math.max(0, total - activatedBlogs);

                if (remaining <= 0) {
                    this.showError('لقد وصلت إلى الحد الأقصى من التفعيلات المسموح بها', 'You have reached the maximum allowed activations');
                    return;
                }

                // جمع معلومات المدونة
                this.getBlogInfo(url, userData, user);
            });
        }
    }

    // دالة للحصول على معلومات المدونة
    getBlogInfo(blogUrl, userData, user) {
        // Helper function to get blog data via JSONP 
        function getJSONP(url, beforeSend, callback, onError) { 
            const script = document.createElement("script"); 
            let callbackName = new URLSearchParams(url).get("callback"); 
            if (!callbackName) { 
                callbackName = 'iscodi_' + Math.round(Math.random() * 1e12); 
                url += "&callback=" + callbackName; 
            } 
            if (beforeSend && typeof beforeSend === 'function') { 
                beforeSend(); 
            } 
            script.src = url; 
            window[callbackName] = function(data) { 
                callback(data); 
                document.head.removeChild(script); 
                delete window[callbackName]; 
            }; 
            script.onerror = function() { 
                onError(); 
                document.head.removeChild(script); 
                delete window[callbackName]; 
            }; 
            document.head.appendChild(script); 
        } 

        function normalizeBlogUrl(url) { 
            url = url.replace(/\/$/, ''); 
            if (!url.startsWith('http://') && !url.startsWith('https://')) { 
                url = 'https://' + url; 
            } 
            return url; 
        } 

        const normalizedUrl = normalizeBlogUrl(blogUrl); 
        const apiUrl = `${normalizedUrl}/feeds/posts/default?alt=json-in-script`; 
        const blogInfoMessage = document.getElementById('blogInfoMessage'); 
        blogInfoMessage.classList.remove('hidden'); 

        getJSONP(apiUrl, 
            function() {}, 
            (data) => { 
                blogInfoMessage.classList.add('hidden'); 
                if (data && data.feed && data.feed.id && data.feed.id.$t) { 
                    const blogId = data.feed.id.$t.split("blog-").pop(); 
                    const blogTitle = data.feed.title ? data.feed.title.$t : normalizedUrl; 

                    // حفظ معلومات المدونة في قاعدة البيانات
                    this.saveBlogInfo({
                        id: blogId,
                        name: blogTitle,
                        url: normalizedUrl,
                        activationDate: new Date().toISOString()
                    }, userData, user);

                } else { 
                    this.showError('لم يتم العثور على بيانات المدونة', 'Blog data not found'); 
                } 
            }, 
            () => { 
                blogInfoMessage.classList.add('hidden'); 
                this.showError('فشل الاتصال بالمدونة. تأكد من الرابط وحاول مرة أخرى.', 'Failed to connect to the blog. Check the URL and try again.'); 
            } 
        ); 
    }

    // إرسال بيانات المدونة إلى Google Sheets
    sendToGoogleSheets(action, blogData, userData) {
        try {
            // عنوان API لـ Google Apps Script
            const apiUrl = 'https://script.google.com/macros/s/AKfycbxAM0zt8n5rBqxhWltJl-s6KnVoATcXui6foURbpiXen0z6oZ_MFr3MqTYYCb1VR_Ax/exec';
            
            // تجهيز البيانات كمعلمات URL لتجنب مشكلة CORS
            const params = new URLSearchParams();
            
            // إضافة كلمة المرور للحماية
            params.append('password', 'codi-188');
            
            // إضافة نوع العملية
            params.append('action', action); // 'add' أو 'delete_row'
            
            // إضافة بيانات المدونة
            params.append('blogId', blogData.id || '');
            params.append('blogName', blogData.name || '');
            params.append('blogUrl', blogData.url || '');
            params.append('activationDate', blogData.activationDate || new Date().toISOString());
            
            // إضافة بيانات المستخدم
            params.append('userEmail', userData.email || '');
            params.append('username', userData.username || '');
            params.append('plan', userData.plan || 'basic');
            params.append('status', userData.status || 'active');
            
            // إنشاء عنوان URL كامل مع المعلمات
            const fullUrl = `${apiUrl}?${params.toString()}`;
            
            // إرسال البيانات باستخدام fetch API مع طلب GET
            fetch(fullUrl)
            .then(response => response.json())
            .catch(error => {
                console.error('Error sending data to Google Sheets:', error);
            });
        } catch (error) {
            console.error('Error in sendToGoogleSheets:', error);
        }
    }

    // حفظ معلومات المدونة في قاعدة البيانات
    async saveBlogInfo(blogInfo, userData, user) {
        try {
            // التحقق من وجود المدونة مسبقًا
            if (userData.activatedBlogs) {
                for (const key in userData.activatedBlogs) {
                    if (userData.activatedBlogs[key].id === blogInfo.id || userData.activatedBlogs[key].url === blogInfo.url) {
                        this.showError('هذه المدونة مفعلة بالفعل', 'This blog is already activated');
                        return;
                    }
                }
            }

            // إنشاء مرجع للمدونة الجديدة باستخدام البريد الإلكتروني كمعرف
            const emailKey = user.email.replace(/\./g, ',');
            const userRef = ref(db, `users/${emailKey}`);
            const newBlogRef = ref(db, `users/${emailKey}/activatedBlogs/${blogInfo.id}`);

            // حفظ معلومات المدونة
            await set(newBlogRef, blogInfo);

            // إرسال بيانات المدونة إلى Google Sheets
            this.sendToGoogleSheets('add', blogInfo, userData);

            // تحديث واجهة المستخدم
            this.showSuccess('تم تفعيل المدونة بنجاح', 'Blog activated successfully');

            // إعادة تحميل بيانات المستخدم - فقط تحديث لوحة المستخدم وجدول المدونات المفعلة
            // بدون تحديث جدول المستخدمين لتجنب التكرار
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
                const updatedUserData = userSnapshot.val();
                this.updateUserDashboardData(updatedUserData, user);
                this.loadActivatedBlogs(updatedUserData, user);

                // مسح حقل الإدخال
                document.getElementById('blogUrl').value = '';
            }

        } catch (error) {
            console.error('Error saving blog info:', error);
            this.showError('حدث خطأ أثناء حفظ معلومات المدونة', 'Error saving blog information');
        }
    }

    // تحميل المدونات المفعلة
    loadActivatedBlogs(userData, user) {
        const activatedBlogsTable = document.getElementById('activatedBlogsTable');
        if (!activatedBlogsTable) return;

        // مسح الجدول
        activatedBlogsTable.innerHTML = '';

        // التحقق من وجود مدونات مفعلة
        if (!userData.activatedBlogs || Object.keys(userData.activatedBlogs).length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'text-center';
            emptyRow.innerHTML = `
            <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 16 16" class="text-gray-300 dark:text-gray-600 m-auto mb-2 w-[35px]">
<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path>
</svg>
<span class="text-gray-500 dark:text-gray-400" data-ar="لا توجد مدونات مفعلة حتى الآن" data-en="No activated blogs yet">لا توجد مدونات مفعلة حتى الآن</span>
                        </td>
            `;
            activatedBlogsTable.appendChild(emptyRow);
            return;
        }

        // إضافة المدونات المفعلة إلى الجدول
        for (const blogId in userData.activatedBlogs) {
            const blog = userData.activatedBlogs[blogId];
            const row = document.createElement('tr');

            // تنسيق تاريخ التفعيل
            let activationDate = 'غير معروف';
            if (blog.activationDate) {
                const date = new Date(blog.activationDate);
                activationDate = date.toLocaleDateString('en-GB');
            }

            // إنشاء زر إلغاء التفعيل (يظهر فقط في الخطة الخارقة)

            let actionButton = '';
            if (userData.plan === 'ultimate') {
                actionButton = `
                <button class="deactivate-blog-btn px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200" data-blog-id="${blogId}" data-ar="إلغاء التفعيل" data-en="Deactivate">إلغاء التفعيل</button>
                `;
            } else {
                actionButton = `<span class="text-gray-400 dark:text-gray-500 text-xs" data-ar="غير متاح" data-en="Not available">غير متاح</span>`;
            }

            row.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${blog.name}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${blogId}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <a href="${blog.url}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">${blog.url}</a>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${activationDate}</td>
                <td class="px-4 py-4 whitespace-nowrap ltr:text-left rtl:text-right text-sm font-medium">
                    ${actionButton}
                </td>
            `;

            activatedBlogsTable.appendChild(row);
        }

        // إضافة مستمعي الأحداث لأزرار إلغاء التفعيل
        const deactivateButtons = document.querySelectorAll('.deactivate-blog-btn');
        deactivateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const blogId = button.getAttribute('data-blog-id');
                this.deactivateBlog(blogId, userData, user);
            });
        });

        // تطبيق اللغة المحفوظة
        applyLanguageToNewElements(document.getElementById('dashboard-conetnt'));
    }

    // إلغاء تفعيل المدونة
    async deactivateBlog(blogId, userData, user) {
        try {
            if (confirm('هل أنت متأكد من رغبتك في إلغاء تفعيل هذه المدونة؟')) {
                // الحصول على معلومات المدونة قبل حذفها
                const emailKey = user.email.replace(/\./g, ',');
                const blogRef = ref(db, `users/${emailKey}/activatedBlogs/${blogId}`);
                const blogSnapshot = await get(blogRef);
                
                if (blogSnapshot.exists()) {
                    // حفظ معلومات المدونة قبل حذفها
                    const blogData = blogSnapshot.val();
                    
                    // حذف المدونة من قاعدة البيانات
                    await remove(blogRef);
                    
                    // إرسال بيانات المدونة إلى Google Sheets لحذف الصف نهائياً
                    this.sendToGoogleSheets('delete_row', blogData, userData);
                    
                    // تحديث واجهة المستخدم
                    this.showSuccess('تم إلغاء تفعيل المدونة بنجاح', 'Blog deactivated successfully');
                    
                    // إعادة تحميل بيانات المستخدم
                    const userRef = ref(db, `users/${emailKey}`);
                    const userSnapshot = await get(userRef);
                    if (userSnapshot.exists()) {
                        const updatedUserData = userSnapshot.val();
                        this.updateUserDashboardData(updatedUserData, user);
                        this.loadActivatedBlogs(updatedUserData, user);
                    }
                } else {
                    this.showError('لم يتم العثور على معلومات المدونة', 'Blog information not found');
                }
            }
        } catch (error) {
            console.error('Error deactivating blog:', error);
            this.showError('حدث خطأ أثناء إلغاء تفعيل المدونة', 'Error deactivating blog');
        }
    }

    showLoginPage() {
        if (!this.currentUser) {
            // إنشاء صفحة تسجيل الدخول ديناميكيًا
            const mainDash = document.getElementById('dashboard-conetnt');

            // إنشاء عنصر صفحة تسجيل الدخول
            const loginPage = document.createElement('div');
            loginPage.id = 'loginPage';
            loginPage.className = 'flex items-center justify-center py-12 mb-8 mt-8';


            // إنشاء محتوى صفحة تسجيل الدخول
            loginPage.innerHTML = `
                <div class="max-w-md w-full">
                    <!-- Main Login Container -->
                    <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 transform">
                        <!-- Logo and Title -->
                        <div class="text-center pt-10 pb-6 px-8">
                            <div class="relative mx-auto h-24 w-24 flex items-center justify-center mb-6">
                                <div class="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 animate-pulse"></div>
                                <div class="absolute inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:rotate-12 hover:scale-105">
                                    <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                            </div>
                            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400" data-ar="مرحباً بك في فلاسبيد" data-en="Welcome to Flaspeed">مرحباً بك في فلاسبيد</h2>
                            <p class="text-sm text-gray-600 dark:text-gray-400" data-ar="قم بتسجيل الدخول للوصول إلى لوحة التحكم" data-en="Sign in to access your dashboard">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
                        </div>

                        <div class="px-8 pb-10 pt-4">
                            <!-- Login Tabs -->
                            <!-- Google Sign In for Subscribers -->
                            <div id="subscriberLoginSection" class="mb-8">
                                <button id="googleSignInBtn" class="w-full flex justify-center items-center px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-md font-medium text-gray-700 dark:text-gray-300 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-md group">
                                    <div class="mr-3 rtl:mr-0 rtl:ml-3 p-1.5 bg-white rounded-full shadow-sm group-hover:shadow transition-all duration-300">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </div>
                                    <span data-ar="تسجيل الدخول بحساب جوجل" data-en="Sign in with Google">تسجيل الدخول بحساب جوجل</span>
                                </button>
                            </div>

                            <!-- Divider with OR -->
                            <div class="flex items-center justify-center mb-8">
                                <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                                <span class="mx-4 text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="أو" data-en="OR">أو</span>
                                <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                            </div>

                            <!-- Admin Login -->
                            <div id="adminLoginSection" class="mb-8">
                                <form id="adminLoginForm" class="space-y-5">
                                    <!-- Email Field -->
                                    <div>
                                        <label for="adminEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</label>
                                        <input type="email" id="adminEmail" name="email" autocomplete="email" required class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-400 dark:focus:border-primary-400 transition-all duration-300" data-ar-placeholder="أدخل البريد الإلكتروني" data-en-placeholder="Enter your email" placeholder="أدخل البريد الإلكتروني">
                                    </div>

                                    <!-- Password Field -->
                                    <div>
                                        <label for="adminPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" data-ar="كلمة المرور" data-en="Password">كلمة المرور</label>
                                        <div class="relative">
                                            <input type="password" id="adminPassword" name="password" required class="w-full px-4 py-3.5 pr-10 rtl:pr-3 rtl:pl-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-400 dark:focus:border-primary-400 transition-all duration-300" data-ar-placeholder="أدخل كلمة المرور" data-en-placeholder="Enter your password" placeholder="أدخل كلمة المرور">
                                            <button type="button" id="togglePassword" class="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <svg id="eyeIcon" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                                <svg id="eyeOffIcon" class="h-5 w-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Submit Button -->
                                    <button type="submit" id="adminLoginBtn" class="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-md font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-[-2px] active:translate-y-0">
                                        <span id="adminLoginBtnText" data-ar="تسجيل الدخول" data-en="Sign In">تسجيل الدخول</span>
                                        <svg id="adminLoginSpinner" class="hidden animate-spin ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>

                            <!-- Terms and Conditions Agreement -->
                            <div class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                                <p><span data-ar="بالمتابعة أنت توافق على" data-en="By continuing, you agree to our">بالمتابعة أنت توافق على</span> <a href="https://www.iscodi.com/p/termsofservice.html" target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline transition-all duration-300" data-ar="الشروط والأحكام" data-en="Terms and Conditions">الشروط والأحكام</a></p>
                            </div>
                        </div>
                    </div>




                </div>
            `;

            // إضافة صفحة تسجيل الدخول إلى العنصر الرئيسي
            mainDash.innerHTML = '';
            mainDash.appendChild(loginPage);

            // تطبيق اللغة المحفوظة على العناصر الجديدة
            applyLanguageToNewElements(loginPage);

        // Google Sign In
        document.getElementById('googleSignInBtn').addEventListener('click', () => {
            this.signInWithGoogle();
        });

        // Admin Login Form
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
 document.getElementById('adminLoginBtnText').classList.add('hidden');
 document.getElementById('adminLoginSpinner').classList.remove('hidden');

            this.signInWithEmail();
        });

        // Password Toggle
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        }
        // Hide other pages when implemented
    }

    showAdminDashboard(user) {

        // إنشاء صفحة لوحة تحكم الأدمن ديناميكيًا
        const mainDash = document.getElementById('dashboard-conetnt');

        // إنشاء محتوى صفحة لوحة التحكم
        mainDash.innerHTML = `

<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
<div class="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
<!-- Admin Info -->
<div class="flex items-center w-full sm:w-auto space-x-3 sm:space-x-4 md:space-x-5">
<div class="relative flex-shrink-0">
<div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
<svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
</svg>
</div>
<div class="absolute -bottom-1 ltr:-left-1 rtl:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
</div>
<div class="space-y-0.5 sm:space-y-1">
<div class="flex flex-wrap items-center gap-2">
<h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white" data-ar="المسؤول" data-en="Administrator">المسؤول</h3>
<span class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full" data-ar="متواجد" data-en="Present">متواجد</span>
</div>
<p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none" id="adminDashboardEmail">${user.email}</p>
</div>
</div>
<!-- Admin Logout Button -->
<button id="adminLogoutBtn" class="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 group">
<svg class="w-4 h-4 rtl:ml-2 ltr:mr-2 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
</svg>
<span data-ar="تسجيل الخروج" data-en="Logout">تسجيل الخروج</span>
</button>
</div>
</div>

<!-- Admin Tabs Navigation -->
<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
    <div class="border-b border-gray-200 dark:border-gray-700 mb-5">
        <ul class="flex flex-wrap -mb-px" role="tablist">
            <li role="presentation">
                <button id="users-tab" class="inline-block py-4 px-4 text-sm font-medium text-center text-primary-600 dark:text-primary-400 rounded-t-lg border-b-2 border-primary-600 dark:border-primary-400 active" data-ar="إدارة المستخدمين" data-en="Users Management" role="tab" aria-controls="users" aria-selected="true">إدارة المستخدمين</button>
            </li>
            <li class="mr-2" role="presentation">
                <button id="template-versions-tab" class="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" data-ar="إصدارات القالب" data-en="Template Versions" role="tab" aria-controls="template-versions" aria-selected="false">إصدارات القالب</button>
            </li>
            <li class="mr-2" role="presentation">
                <button id="template-add-admin-tab" class="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" data-ar="إضافة مدير" data-en="Add Admin" role="tab" aria-controls="add-addmins" aria-selected="false">إضافة مدير</button>
            </li>
        </ul>
    </div>


<!-- Users Management Section -->
<div id="users" role="tabpanel" aria-labelledby="users-tab">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" data-ar="إدارة المستخدمين" data-en="Users Management">إدارة المستخدمين</h2>
        <div class="flex flex-wrap gap-2 sm:gap-3">
            <button id="addUserBtn" data-bs-toggle="modal" data-bs-target="#addUserModal" class="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 w-full sm:w-auto">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:ml-1.5 sm:rtl:ml-2 ltr:mr-1.5 sm:ltr:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span data-ar="إضافة مستخدم جديد" data-en="Add New User">إضافة مستخدم جديد</span>
            </button>
            <button id="bulkMessageBtn" data-bs-toggle="modal" data-bs-target="#bulkMessageModal" class="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 w-full sm:w-auto">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:ml-1.5 sm:rtl:ml-2 ltr:mr-1.5 sm:ltr:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span data-ar="رسالة جماعية" data-en="Bulk Message">رسالة جماعية</span>
            </button>
        </div>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table id="usersTable" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="اسم المستخدم" data-en="Username">اسم المستخدم</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="الخطة" data-en="Plan">الخطة</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="التفعيلات (المستخدمة / الإجمالية)" data-en="Activations (Used / Total)">التفعيلات (المستخدمة / الإجمالية)</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="أيام الدعم" data-en="Support Days">أيام الدعم</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="قيمة الشراء" data-en="Purchase Value">قيمة الشراء</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="الحالة" data-en="Status">الحالة</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="الإجراءات" data-en="Actions">الإجراءات</th>
                </tr>
            </thead>
            <tbody id="usersTableBody" class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                <!-- Users will be loaded here dynamically -->
            </tbody>
        </table>
    </div>
</div>

<!-- Template Versions Section -->
<div id="template-versions" class="hidden" role="tabpanel" aria-labelledby="template-versions-tab">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" data-ar="إصدارات القالب" data-en="Template Versions">إصدارات القالب</h2>
        <div class="flex space-x-3">
            <button id="addVersionBtn" data-bs-toggle="modal" data-bs-target="#addVersionModal" class="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 w-full sm:w-auto">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:ml-1.5 sm:rtl:ml-2 ltr:mr-1.5 sm:ltr:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span data-ar="إضافة إصدار جديد" data-en="Add New Version">إضافة إصدار جديد</span>
            </button>
        </div>
    </div>

    <!-- Versions Table -->
    <div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table id="versionsTable" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="رقم الإصدار" data-en="Version Number">رقم الإصدار</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="العنوان" data-en="Title">العنوان</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="الوصف" data-en="Description">الوصف</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="رابط التحميل" data-en="Download Link">رابط التحميل</th>
                    <th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="الإجراءات" data-en="Actions">الإجراءات</th>
                </tr>
            </thead>
            <tbody id="versionsTableBody" class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                <!-- Versions will be loaded here dynamically -->
            </tbody>
        </table>
    </div>
</div>

<!-- Add Admins Section -->
<div id="add-addmins" class="hidden" role="tabpanel" aria-labelledby="template-versions-tab">
<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
<h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" data-ar="إدارة المديرين" data-en="Manage Admins">إدارة المديرين</h2>
<div class="flex space-x-3">
<button id="addAdminBtn" data-bs-toggle="modal" data-bs-target="#addAdminModal" class="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 w-full sm:w-auto">
<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:ml-1.5 sm:rtl:ml-2 ltr:mr-1.5 sm:ltr:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
</svg>
<span data-ar="إضافة مدير جديد" data-en="Add New Admin">إضافة مدير جديد</span>
</button>
</div>
</div>
<!-- Admins Table -->
<div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
<table id="adminsTable" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
<thead class="bg-gray-50 dark:bg-gray-800">
<tr>
<th scope="col" class="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="بريد المدير" data-en="Admin Email">بريد المدير</th>
<th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="الإجراءات" data-en="Actions">الإجراءات</th>
</tr>
</thead>
<tbody id="AdminsTableBody" class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
<!-- Admins will be loaded here dynamically -->
</tbody>
</table>
</div>
</div>
</div>


<!--Admin Modals-->
<!-- Add Admin Modal -->
<div id="addAdminModal" class="modal fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out opacity-0">
<div class="modal-dialog relative w-full max-w-4xl mx-4 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out transform translate-y-4 scale-95">
<!-- Modal Header -->
<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<div class="flex items-center gap-3">
<div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
</svg>
</div>
<div>
<h2 class="text-2xl font-bold text-gray-900 dark:text-white" data-ar="تسجيل مسؤول جديد" data-en="Add New Admin">تسجيل مسؤول جديد</h2>
</div>
</div>
<button data-bs-dismiss="modal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>

<!-- Modal Body -->
<div class="p-6 max-h-[60vh] overflow-y-auto">
<form id="addAdminForm" class="space-y-6">
    <div class="group">
        <label for="newAdminEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400" data-ar="البريد الإلكتروني" data-en="Email Address">
            <svg class="inline-block w-4 h-4 rtl:ml-2 ltr:mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
            البريد الإلكتروني
        </label>
        <input 
            type="email" 
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500" 
            id="newAdminEmail" 
            name="newAdminEmail" 
            required 
            autocomplete="email"
            data-ar-placeholder="أدخل البريد الإلكتروني للمدير الجديد"
            data-en-placeholder="Enter email address for new admin"
            placeholder="أدخل البريد الإلكتروني للمدير الجديد"
        >
    </div>
</form>
</div>

<!-- Modal Footer -->
<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
<button data-bs-dismiss="modal" id="saveAdminBtn" class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200" data-ar="حفظ" data-en="Save">حفظ</button>
</div>
</div>
</div>

<!-- Add Version Modal -->
<div id="addVersionModal" class="modal fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out opacity-0">
<div class="modal-dialog relative w-full max-w-4xl mx-4 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out transform translate-y-4 scale-95">
<!-- Modal Header -->
<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<div class="flex items-center gap-3">
<div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
</svg>
</div>
<div>
<h2 class="text-2xl font-bold text-gray-900 dark:text-white" data-ar="إضافة إصدار جديد" data-en="Add New Version">إضافة إصدار جديد</h2>
</div>
</div>
<button data-bs-dismiss="modal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>

<!-- Modal Body -->
<div class="p-6 max-h-[60vh] overflow-y-auto">
    <form id="newVersionForm" class="space-y-6">
        <!-- Version Number -->
        <div>
            <label for="versionNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="رقم الإصدار" data-en="Version Number">رقم الإصدار</label>
            <input type="text" id="versionNumber" name="versionNumber" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="مثال: 1.0.0" data-en-placeholder="Example: 1.0.0">
        </div>

        <!-- Title (Arabic) -->
        <div>
            <label for="versionTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="العنوان (بالعربية)" data-en="Title (Arabic)">العنوان (بالعربية)</label>
            <input type="text" id="versionTitle" name="versionTitle" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="أدخل عنوان الإصدار بالعربية" data-en-placeholder="Enter version title in Arabic">
        </div>

        <!-- Title (English) -->
        <div>
            <label for="versionTitleEn" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="العنوان (بالإنجليزية)" data-en="Title (English)">العنوان (بالإنجليزية)</label>
            <input type="text" id="versionTitleEn" name="versionTitleEn" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="أدخل عنوان الإصدار بالإنجليزية" data-en-placeholder="Enter version title in English">
        </div>

        <!-- Description (Arabic) -->
        <div>
            <label for="versionDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="الوصف (بالعربية)" data-en="Description (Arabic)">الوصف (بالعربية)</label>
            <textarea id="versionDescription" name="versionDescription" rows="4" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="أدخل وصف الإصدار بالعربية" data-en-placeholder="Enter version description in Arabic"></textarea>
        </div>

        <!-- Description (English) -->
        <div>
            <label for="versionDescriptionEn" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="الوصف (بالإنجليزية)" data-en="Description (English)">الوصف (بالإنجليزية)</label>
            <textarea id="versionDescriptionEn" name="versionDescriptionEn" rows="4" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="أدخل وصف الإصدار بالإنجليزية" data-en-placeholder="Enter version description in English"></textarea>
        </div>

        <!-- Download Link -->
        <div>
            <label for="downloadLink" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="رابط التحميل" data-en="Download Link">رابط التحميل</label>
            <input type="url" id="downloadLink" name="downloadLink" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="أدخل رابط التحميل" data-en-placeholder="Enter download link">
        </div>
    </form>
</div>

<!-- Modal Footer -->
<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
<button data-bs-dismiss="modal" id="saveVersionBtn" class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200" data-ar="حفظ" data-en="Save">حفظ</button>
</div>
</div>
</div>

<div id="addUserModal" class="modal fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out opacity-0">
<div class="modal-dialog relative w-full max-w-4xl mx-4 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out transform translate-y-4 scale-95">
<!-- Modal Header -->
<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<div class="flex items-center gap-3">
<div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
</svg>
</div>
<div>
<h2 class="text-2xl font-bold text-gray-900 dark:text-white" data-ar="تسجيل مستخدم جديد" data-en="Add New User">تسجيل مستخدم جديد</h2>
</div>
</div>
<button data-bs-dismiss="modal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>

<!-- Modal Body -->
<div class="p-6 max-h-[60vh] overflow-y-auto">
    <form id="newUserForm" class="space-y-6">
        <!-- Username -->
        <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="اسم المستخدم" data-en="Username">اسم المستخدم</label>
            <input type="text" id="username" name="username" autocomplete="username" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="أدخل اسم المستخدم" data-en-placeholder="Enter username">
        </div>

        <!-- Email -->
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</label>
            <input type="email" id="email" name="email" autocomplete="email" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="" data-ar-placeholder="أدخل البريد الإلكتروني" data-en-placeholder="Enter email address">
        </div>

        <!-- Plan -->
        <div>
            <label for="plan" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="الخطة المشتراة" data-en="Subscription Plan">الخطة المشتراة</label>
            <select id="plan" name="plan" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors">
                <option value="basic" data-ar="الأساسية" data-en="Basic">الأساسية</option>
                <option value="pro" data-ar="الإحترافية" data-en="Professional">الإحترافية</option>
                <option value="ultimate" data-ar="الخارقة" data-en="Ultimate">الخارقة</option>
            </select>
        </div>

        <!-- Activations -->
        <div>
            <label for="activations" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="عدد التفعيلات المسموحة" data-en="Allowed Activations">عدد التفعيلات المسموحة</label>
            <input type="number" id="activations" name="activations" min="1" value="1" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors">
        </div>

        <!-- Support Days -->
        <div>
            <label for="supportDays" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="عدد أيام الدعم" data-en="Support Days">عدد أيام الدعم</label>
            <input type="number" id="supportDays" name="supportDays" min="0" value="60" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors">
        </div>

        <!-- Purchase Value -->
        <div>
            <label for="purchaseValue" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="قيمة الشراء بالدولار" data-en="Purchase Value (USD)">قيمة الشراء بالدولار</label>
            <input type="number" id="purchaseValue" name="purchaseValue" min="0" step="0.01" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors">
        </div>

        <!-- Status -->
        <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="حالة المستخدم" data-en="User Status">حالة المستخدم</label>
            <select id="status" name="status" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors">
                <option value="active" data-ar="نشط" data-en="Active">نشط</option>
                <option value="pending" data-ar="بانتظار الدفع" data-en="Payment Pending">بانتظار الدفع</option>
                <option value="blocked" data-ar="محظور" data-en="Blocked">محظور</option>
            </select>
        </div>

        <!-- Contact Link (conditional) -->
        <div id="contactLinkContainer" class="hidden">
            <label for="contactLink" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="رابط التواصل" data-en="Contact Link">رابط التواصل</label>
            <input type="url" id="contactLink" name="contactLink" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" data-ar-placeholder="أدخل رابط للتواصل مع المستخدم" data-en-placeholder="Enter a contact link for the user">
        </div>

        <!-- Block Reason (conditional) -->
        <div id="blockReasonContainer" class="hidden">
            <label for="blockReason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="سبب الحظر" data-en="Block Reason">سبب الحظر</label>
            <textarea id="blockReason" name="blockReason" rows="2" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" data-ar-placeholder="أدخل سبب حظر المستخدم" data-en-placeholder="Enter reason for blocking the user"></textarea>
        </div>

        <!-- Notes -->
        <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="ملاحظات (إختياري)" data-en="Notes (Optional)">ملاحظات (إختياري)</label>
            <textarea id="notes" name="notes" rows="3" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" data-ar-placeholder="أدخل أي ملاحظات إضافية هنا" data-en-placeholder="Enter any additional notes here"></textarea>
        </div>
    </form>
</div>

<!-- Modal Footer -->
<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
<button data-bs-dismiss="modal" id="saveNewUserBtn" class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200" data-ar="حفظ" data-en="Save">حفظ</button>
</div>
</div>
</div>




<!-- Edit User Modal -->
<div id="editUserModal" class="modal fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out opacity-0">
<div class="modal-dialog relative w-full max-w-4xl mx-4 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out transform translate-y-4 scale-95">
<!-- Modal Header -->
<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<div class="flex items-center gap-3">
<div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
</svg>
</div>
<div>
<h2 class="text-2xl font-bold text-gray-900 dark:text-white" data-ar="تعديل معلومات المستخدم" data-en="Edit User Info">تعديل معلومات المستخدم</h2>
</div>
</div>
<button data-bs-dismiss="modal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>

<!-- Modal Body -->
<div class="p-6 max-h-[60vh] overflow-y-auto">
    <!-- User Information Form -->
    <form id="editUserForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Username -->
            <div>
                <label for="edit_username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="اسم المستخدم" data-en="Username">اسم المستخدم</label>
                <input type="text" id="edit_username" name="username" autocomplete="username" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            </div>

            <!-- Email -->
            <div>
                <label for="edit_email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</label>
                <input type="email" id="edit_email" name="email" autocomplete="email" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" readonly>
            </div>

            <!-- Plan -->
            <div>
                <label for="edit_plan" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="الخطة" data-en="Plan">الخطة</label>
                <select id="edit_plan" name="plan" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="basic" data-ar="الأساسية" data-en="Basic">الأساسية</option>
                    <option value="pro" data-ar="الإحترافية" data-en="Professional">الإحترافية</option>
                    <option value="ultimate" data-ar="الخارقة" data-en="Ultimate">الخارقة</option>
                </select>
            </div>

            <!-- Activations -->
            <div>
                <label for="edit_activations" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="عدد التفعيلات المسموحة" data-en="Allowed Activations">عدد التفعيلات المسموحة</label>
                <input type="number" id="edit_activations" name="activations" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" min="1">
            </div>

            <!-- Support Days -->
            <div>
                <label for="edit_supportDays" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="أيام الدعم المتبقية" data-en="Remaining Support Days">أيام الدعم المتبقية</label>
                <input type="number" id="edit_supportDays" name="supportDays" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" min="0">
            </div>

            <!-- Purchase Value -->
            <div>
                <label for="edit_purchaseValue" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="قيمة الشراء" data-en="Purchase Value">قيمة الشراء</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                    <input type="number" id="edit_purchaseValue" name="purchaseValue" class="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" step="0.01" min="0">
                </div>
            </div>

            <!-- Status -->
            <div>
                <label for="edit_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="الحالة" data-en="Status">الحالة</label>
                <select id="edit_status" name="status" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="active" data-ar="نشط" data-en="Active">نشط</option>
                    <option value="pending" data-ar="بانتظار الدفع" data-en="Payment Pending">بانتظار الدفع</option>
                    <option value="blocked" data-ar="محظور" data-en="Blocked">محظور</option>
                </select>
            </div>

            <!-- Registration Date -->
            <div>
                <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="تاريخ التسجيل" data-en="Registration Date">تاريخ التسجيل</span>
                <div id="edit_registrationDate" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"></div>
            </div>

        </div>

        <!-- Contact Link (conditional) -->
        <div id="edit_contactLinkContainer" class="hidden">
            <label for="edit_contactLink" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="رابط التواصل" data-en="Contact Link">رابط التواصل</label>
            <input type="text" id="edit_contactLink" name="contactLink" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        </div>

        <!-- Block Reason (conditional) -->
        <div id="edit_blockReasonContainer" class="hidden">
            <label for="edit_blockReason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="سبب الحظر" data-en="Block Reason">سبب الحظر</label>
            <textarea id="edit_blockReason" name="blockReason" rows="3" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
        </div>

        <!-- Notes -->
        <div>
            <label for="edit_notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" data-ar="ملاحظات" data-en="Notes">ملاحظات</label>
            <textarea id="edit_notes" name="notes" rows="3" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
        </div>
    </form>

    <!-- User Blogs Table -->
    <div class="mt-8">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4" data-ar="المدونات المفعلة" data-en="Activated Blogs">المدونات المفعلة</h3>

        <div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" class="px-6 py-3 rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="اسم المدونة" data-en="Blog Name">اسم المدونة</th>
                        <th scope="col" class="px-6 py-3 rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="معرف المدونة" data-en="Blog ID">معرف المدونة</th>
                        <th scope="col" class="px-6 py-3 rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="رابط المدونة" data-en="Blog URL">رابط المدونة</th>
                        <th scope="col" class="px-6 py-3 rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="تاريخ التفعيل" data-en="Activation Date">تاريخ التفعيل</th>
                        <th scope="col" class="px-6 py-3 rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" data-ar="إجراءات" data-en="Actions">إجراءات</th>
                    </tr>
                </thead>
                <tbody id="userBlogsTableBody" class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    <!-- Blog rows will be inserted here dynamically -->
                </tbody>
            </table>
        </div>

        <!-- No Blogs Message -->
        <div id="noBlogsMessage" class="hidden py-8 text-center text-gray-500 dark:text-gray-400">
            <svg fill="currentColor" viewBox="0 0 16 16" class="text-gray-300 dark:text-gray-600 m-auto mb-2 w-[35px]">
<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path>
</svg>
            <span data-ar="لا توجد مدونات مفعلة" data-en="No activated blogs">لا توجد مدونات مفعلة</span>
        </div>
    </div>
</div>

<!-- Modal Footer -->
<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
<button data-bs-dismiss="modal" id="saveEditUserBtn" class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200" data-ar="حفظ" data-en="Save">حفظ</button>
</div>
</div>
</div>




<!-- Send Message To User Modal -->
<div id="sendMessageToUserModal" class="modal fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out opacity-0">
<div class="modal-dialog relative w-full max-w-4xl mx-4 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out transform translate-y-4 scale-95">
<!-- Modal Header -->
<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<div class="flex items-center gap-3">
<div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
</svg>
</div>
<div>
<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
<span data-ar="إرسال رسالة إلى" data-en="Send Message To" data-en="Message to">إرسال رسالة إلى</span>
<span id="userName" class="text-primary-500 dark:text-primary-400 inline-block">المشتري</span>
</h2>
</div>
</div>
<button data-bs-dismiss="modal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>

<!-- Modal Body -->
<div class="p-6 max-h-[60vh] overflow-y-auto">
    <!-- Send Message Form -->
    <form id="sendMessageForm" class="space-y-6">
        <!-- Hidden Field -->
        <input type="hidden" id="messageRecipientEmail" name="messageRecipientEmail">

        <!-- Message Subject (Arabic) -->
        <div class="space-y-2">
            <label for="messageSubject" class="form-label required-field flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span data-ar="عنوان الرسالة (عربي)" data-en="Message Subject (Arabic)">عنوان الرسالة (عربي)</span>
                <span class="text-red-500">*</span>
            </label>
            <input type="text" 
                   class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500" 
                   id="messageSubject" 
                   name="messageSubject" 
                   required 
                   autocomplete="off"
                   data-ar-placeholder="أدخل عنوان الرسالة بالعربية" 
                   data-en-placeholder="Enter message subject in Arabic"
                   placeholder="أدخل عنوان الرسالة بالعربية">
        </div>

        <!-- Message Subject (English) -->
        <div class="space-y-2">
            <label for="messageSubjectEn" class="form-label required-field flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span data-ar="عنوان الرسالة (إنجليزي)" data-en="Message Subject (English)">عنوان الرسالة (إنجليزي)</span>
                <span class="text-red-500">*</span>
            </label>
            <input type="text" 
                   class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500" 
                   id="messageSubjectEn" 
                   name="messageSubjectEn" 
                   required 
                   autocomplete="off"
                   data-ar-placeholder="أدخل عنوان الرسالة بالإنجليزية" 
                   data-en-placeholder="Enter message subject in English"
                   placeholder="أدخل عنوان الرسالة بالإنجليزية">
        </div>

        <!-- Message Type Selection -->
        <div class="space-y-2">
            <label for="messageType" class="form-label required-field flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span data-ar="نوع الرسالة" data-en="Message Type">نوع الرسالة</span>
                <span class="text-red-500">*</span>
            </label>
            <select id="messageType" 
                    name="messageType" 
                    class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500" 
                    required>
                <option value="" data-ar="اختر نوع الرسالة" data-en="Select message type">اختر نوع الرسالة</option>
                <option value="normal" data-ar="إشعار عادي" data-en="Normal Notification">إشعار عادي</option>
                <option value="success" data-ar="رسالة نجاح" data-en="Success Message">رسالة نجاح</option>
                <option value="warning" data-ar="رسالة تحذير" data-en="Warning Message">رسالة تحذير</option>
                <option value="error" data-ar="رسالة خطأ" data-en="Error Message">رسالة خطأ</option>
                <option value="thanks" data-ar="رسالة شكر" data-en="Thanks Message">رسالة شكر</option>
                <option value="gift" data-ar="رسالة هدية" data-en="Gift Message">رسالة هدية</option>
            </select>
        </div>

        <!-- Message Content (Arabic) -->
        <div class="space-y-2">
            <label for="messageContent" class="form-label required-field flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span data-ar="محتوى الرسالة (عربي)" data-en="Message Content (Arabic)">محتوى الرسالة (عربي)</span>
                <span class="text-red-500">*</span>
            </label>
            <textarea class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-vertical" 
                      id="messageContent" 
                      name="messageContent" 
                      rows="5" 
                      required
                      data-ar-placeholder="اكتب محتوى الرسالة هنا بالعربية..." 
                      data-en-placeholder="Write your message content here in Arabic..."
                      placeholder="اكتب محتوى الرسالة هنا بالعربية..."></textarea>
        </div>

        <!-- Message Content (English) -->
        <div class="space-y-2">
            <label for="messageContentEn" class="form-label required-field flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span data-ar="محتوى الرسالة (إنجليزي)" data-en="Message Content (English)">محتوى الرسالة (إنجليزي)</span>
                <span class="text-red-500">*</span>
            </label>
            <textarea class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-vertical" 
                      id="messageContentEn" 
                      name="messageContentEn" 
                      rows="5" 
                      required
                      data-ar-placeholder="اكتب محتوى الرسالة هنا بالإنجليزية..." 
                      data-en-placeholder="Write your message content here in English..."
                      placeholder="اكتب محتوى الرسالة هنا بالإنجليزية..."></textarea>
        </div>

        <!-- Important Message Checkbox -->
        <div class="flex items-center gap-4 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-700/50 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300">
            <div class="flex items-center justify-center w-6 h-6 bg-amber-100 dark:bg-amber-900/40 rounded-full shrink-0">
                <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <div class="flex items-center gap-4 flex-1">
                <div class="relative inline-flex items-center">
                    <input type="checkbox" class="sr-only" id="messageImportant" name="messageImportant">
                    <label for="messageImportant" class="relative inline-flex items-center cursor-pointer">
                        <div class="w-11 h-6 bg-amber-200 dark:bg-amber-800/50 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 dark:peer-checked:bg-amber-600 hover:bg-amber-300 dark:hover:bg-amber-700/60 peer-checked:hover:bg-amber-600 dark:peer-checked:hover:bg-amber-500"></div>
                    </label>
                </div>
                <label class="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-200 cursor-pointer select-none" for="messageImportant">
                    <span class="inline-flex items-center gap-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        <span data-ar="رسالة هامة" data-en="Important Message">رسالة هامة</span>
                    </span>
                    <span class="text-xs text-amber-600 dark:text-amber-400 font-normal" data-ar="(سيتم تمييز الرسالة كهامة)" data-en="(Message will be marked as important)">(سيتم تمييز الرسالة كهامة)</span>
                </label>
            </div>
        </div>
    </form>
</div>

<!-- Modal Footer -->
<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
<button data-bs-dismiss="modal" id="sendMessageBtn" class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200" data-ar="إرسال" data-en="Send">إرسال</button>
</div>
</div>
</div>


<!-- Bulk Message Modal -->
<div id="bulkMessageModal" class="modal fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out opacity-0">
<div class="modal-dialog relative w-full max-w-4xl mx-4 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out transform translate-y-4 scale-95">
<!-- Modal Header -->
<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<div class="flex items-center gap-3">
<div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
</svg>
</div>
<div>
<h2 class="text-2xl font-bold text-gray-900 dark:text-white" data-ar="إرسال رسالة جماعية للمستخدمين" data-en="Send a group message to users">إرسال رسالة جماعية للمستخدمين</h2>
</div>
</div>
<button data-bs-dismiss="modal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>

<!-- Modal Body -->
<div class="p-6 max-h-[60vh] overflow-y-auto">
<!-- Bulk Message Form -->
<form id="bulkMessageForm" class="space-y-8">
<!-- Message Subject (Arabic) -->
<div class="group relative">
    <label for="bulkMessageSubject" class="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        <span data-ar="عنوان الرسالة (عربي)" data-en="Message Subject (Arabic)">عنوان الرسالة (عربي)</span>
        <span class="text-red-500 ms-1 text-base">*</span>
    </label>
        <input type="text" 
                class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500" 
                id="bulkMessageSubject" 
                name="bulkMessageSubject" 
                required 
                autocomplete="off"
                data-ar-placeholder="أدخل عنوان الرسالة بالعربية" 
                data-en-placeholder="Enter message subject in Arabic"
                placeholder="أدخل عنوان الرسالة بالعربية">
</div>

<!-- Message Subject (English) -->
<div class="group relative">
    <label for="bulkMessageSubjectEn" class="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        <span data-ar="عنوان الرسالة (إنجليزي)" data-en="Message Subject (English)">عنوان الرسالة (إنجليزي)</span>
        <span class="text-red-500 ms-1 text-base">*</span>
    </label>
        <input type="text" 
                class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500" 
                id="bulkMessageSubjectEn" 
                name="bulkMessageSubjectEn" 
                required 
                autocomplete="off"
                data-ar-placeholder="أدخل عنوان الرسالة بالإنجليزية" 
                data-en-placeholder="Enter message subject in English"
                placeholder="أدخل عنوان الرسالة بالإنجليزية">
</div>

<!-- Message Content (Arabic) -->
<div class="group relative">
    <label for="bulkMessageContent" class="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        <span data-ar="محتوى الرسالة (عربي)" data-en="Message Content (Arabic)">محتوى الرسالة (عربي)</span>
        <span class="text-red-500 ms-1 text-base">*</span>
    </label>
        <textarea class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-vertical" 
                    id="bulkMessageContent" 
                    name="bulkMessageContent" 
                    rows="5" 
                    required
                    data-ar-placeholder="اكتب محتوى الرسالة هنا بالعربية..." 
                    data-en-placeholder="Write your message content here in Arabic..."
                    placeholder="اكتب محتوى الرسالة هنا بالعربية..."></textarea>
</div>

<!-- Message Content (English) -->
<div class="group relative">
    <label for="bulkMessageContentEn" class="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        <span data-ar="محتوى الرسالة (إنجليزي)" data-en="Message Content (English)">محتوى الرسالة (إنجليزي)</span>
        <span class="text-red-500 ms-1 text-base">*</span>
    </label>
        <textarea class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-vertical" 
                    id="bulkMessageContentEn" 
                    name="bulkMessageContentEn" 
                    rows="5" 
                    required
                    data-ar-placeholder="اكتب محتوى الرسالة هنا بالإنجليزية..." 
                    data-en-placeholder="Write your message content here in English..."
                    placeholder="اكتب محتوى الرسالة هنا بالإنجليزية..."></textarea>
</div>

<!-- Message Type Selection -->
<div class="group relative">
    <label for="bulkMessageType" class="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        <span data-ar="نوع الرسالة" data-en="Message Type">نوع الرسالة</span>
        <span class="text-red-500 ms-1 text-base">*</span>
    </label>
    <select id="bulkMessageType" 
            name="bulkMessageType" 
            class="form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500" 
            required>
        <option value="" data-ar="اختر نوع الرسالة" data-en="Select message type">اختر نوع الرسالة</option>
        <option value="normal" data-ar="إشعار عادي" data-en="Normal Notification">إشعار عادي</option>
        <option value="success" data-ar="رسالة نجاح" data-en="Success Message">رسالة نجاح</option>
        <option value="warning" data-ar="رسالة تحذير" data-en="Warning Message">رسالة تحذير</option>
        <option value="error" data-ar="رسالة خطأ" data-en="Error Message">رسالة خطأ</option>
        <option value="thanks" data-ar="رسالة شكر" data-en="Thanks Message">رسالة شكر</option>
        <option value="gift" data-ar="رسالة هدية" data-en="Gift">رسالة هدية</option>
            </select>
</div>

<!-- Important Message Checkbox -->
<div class="group relative">
    <div class="flex items-center gap-4 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-700/50 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300">
        <div class="flex items-center justify-center w-6 h-6 bg-amber-100 dark:bg-amber-900/40 rounded-full">
            <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
        </div>
        <div class="flex items-center gap-4 flex-1">
            <div class="relative inline-flex items-center">
                <input type="checkbox" 
                        class="sr-only" 
                        id="bulkMessageImportant" 
                        name="bulkMessageImportant">
                <label for="bulkMessageImportant" class="relative inline-flex items-center cursor-pointer">
                    <div class="w-11 h-6 bg-amber-200 dark:bg-amber-800/50 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 dark:peer-checked:bg-amber-600 hover:bg-amber-300 dark:hover:bg-amber-700/60 peer-checked:hover:bg-amber-600 dark:peer-checked:hover:bg-amber-500"></div>
                </label>
            </div>
            <label class="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-200 cursor-pointer select-none" for="bulkMessageImportant">
                <span data-ar="رسالة هامة" data-en="Important Message">رسالة هامة</span>
                <span class="text-xs text-amber-600 dark:text-amber-400 font-normal" data-ar="(سيتم تمييز الرسالة كهامة)" data-en="(Message will be marked as important)">(سيتم تمييز الرسالة كهامة)</span>
            </label>
        </div>
    </div>
</div>

<!-- User Selection Section -->
<div class="space-y-4">

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3">
        <button type="button" 
                class="btn btn-sm btn-outline-primary flex items-center gap-2 px-4 py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                id="selectActiveUsersBtn" 
                aria-label="اختيار المستخدمين النشطين فقط"
                data-ar="اختيار المستخدمين النشطين فقط" 
                data-en="Select Active Users Only">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
            اختيار المستخدمين النشطين فقط
        </button>

        <button type="button" 
                class="btn btn-sm btn-outline-secondary flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:border-gray-500" 
                id="resetUserSelectionBtn" 
                aria-label="إعادة تعيين اختيار المستخدمين"
                data-ar="اختيار الكل" 
                data-en="Select All">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
            اختيار الكل
        </button>
    </div>

    <!-- Users Table -->
    <div class="table-responsive bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table class="table w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th class="px-4 py-3 text-center">
                        <div class="flex items-center justify-center">
                            <div class="relative inline-flex items-center">
                                <input class="sr-only" 
                                        type="checkbox" 
                                        id="selectAllUsers" 
                                        checked 
                                        aria-label="تحديد الكل">
                                <label for="selectAllUsers" class="relative inline-flex items-center cursor-pointer">
                                    <div class="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 hover:bg-gray-300 dark:hover:bg-gray-600 peer-checked:hover:bg-blue-700 dark:peer-checked:hover:bg-blue-400"></div>
                                </label>
                            </div>
                        </div>
                    </th>
                    <th scope="col" class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</th>
                    <th scope="col" class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300" data-ar="الاسم" data-en="Name">الاسم</th>
                    <th scope="col" class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300" data-ar="الحالة" data-en="Status">الحالة</th>
                </tr>
            </thead>
            <tbody id="bulkMessageUsersTable" class="divide-y divide-gray-200 dark:divide-gray-700">
                <!-- Users will be populated here by JavaScript -->
            </tbody>
        </table>
    </div>
</div>
</form>
</div>

<!-- Modal Footer -->
<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
<button data-bs-dismiss="modal" id="sendBulkMessageBtn" class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200" data-ar="إرسال الرسالة" data-en="Send">إرسال الرسالة</button>
</div>
</div>
</div>



        `;


        // نفترض أن جميع المستخدمين مسموح لهم بالدخول كمشرفين حاليًا
        this.showSuccess('تم تسجيل دخول المشرف بنجاح', 'Admin login successful');

        // Admin Logout Button
        const adminLogoutBtn = document.getElementById('adminLogoutBtn');
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', () => {
                this.signOut();
            });
        }

        // Add User Button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                // Reset form
                document.getElementById('newUserForm').reset();
                // Hide conditional fields
                document.getElementById('contactLinkContainer').classList.add('hidden');
                document.getElementById('blockReasonContainer').classList.add('hidden');
            });
        }

        // Status Change Event
        const statusSelect = document.getElementById('status');
        if (statusSelect) {
            statusSelect.addEventListener('change', () => {
                const selectedStatus = statusSelect.value;
                const contactLinkContainer = document.getElementById('contactLinkContainer');
                const blockReasonContainer = document.getElementById('blockReasonContainer');

                // Show/hide contact link field
                if (selectedStatus === 'pending' || selectedStatus === 'blocked') {
                    contactLinkContainer.classList.remove('hidden');
                } else {
                    contactLinkContainer.classList.add('hidden');
                }

                // Show/hide block reason field
                if (selectedStatus === 'blocked') {
                    blockReasonContainer.classList.remove('hidden');
                } else {
                    blockReasonContainer.classList.add('hidden');
                }
            });
        }

        // Save New User Button
        const saveNewUserBtn = document.getElementById('saveNewUserBtn');
        if (saveNewUserBtn) {
            saveNewUserBtn.addEventListener('click', () => {
                this.saveNewUser();
            });
        }


        // Bulk Message Button
        const bulkMessageBtn = document.getElementById('bulkMessageBtn');
        if (bulkMessageBtn) {
            bulkMessageBtn.addEventListener('click', () => {
                // Load users for bulk message
                this.loadUsersForBulkMessage();
                // Reset form fields
                document.getElementById('bulkMessageForm').reset();
            });
        }




        // Select Active Users Button
        const selectActiveUsersBtn = document.getElementById('selectActiveUsersBtn');
        if (selectActiveUsersBtn) {
            selectActiveUsersBtn.addEventListener('click', () => {
                this.selectOnlyActiveUsers();
            });
        }

        // Reset User Selection Button
        const resetUserSelectionBtn = document.getElementById('resetUserSelectionBtn');
        if (resetUserSelectionBtn) {
            resetUserSelectionBtn.addEventListener('click', () => {
                this.toggleSelectAllUsers(true);
            });
        }

        // Select All Users Checkbox
        const selectAllUsers = document.getElementById('selectAllUsers');
        if (selectAllUsers) {
            selectAllUsers.addEventListener('change', (e) => {
                this.toggleSelectAllUsers(e.target.checked);
            });
        }

        // Send Bulk Message Button
        const sendBulkMessageBtn = document.getElementById('sendBulkMessageBtn');
        if (sendBulkMessageBtn) {
            sendBulkMessageBtn.addEventListener('click', () => {
                this.sendBulkMessage();
            });
        }

        // Load users
        this.loadUsers();

        // Load admins for admin management section
        this.loadAdmins();

        const saveAdminBtn = document.getElementById('saveAdminBtn');
        if (saveAdminBtn) {
            saveAdminBtn.addEventListener('click', () => {
                this.saveAdmin();
            });
        }



        applyLanguageToNewElements(mainDash);
    }

    loadAdmins() {
        const adminsRef = ref(db, 'admins');
        onValue(adminsRef, (snapshot) => {
            const adminsTableBody = document.getElementById('AdminsTableBody');
            if (!adminsTableBody) return;

            adminsTableBody.innerHTML = '';

            if (snapshot.exists()) {
                const admins = snapshot.val();
                Object.keys(admins).forEach(emailKey => {
                    const email = emailKey.replace(/,/g, '.');
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-semibold">${email.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div class="ltr:ml-4 rtl:mr-4">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">${email}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400" data-ar="مسؤول النظام" data-en="System Administrator">مسؤول النظام</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div class="flex items-center justify-center space-x-2">
                            <button class="delete-admin-btn inline-flex items-center justify-center w-9 h-9 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1" data-email="${emailKey}" title="حذف المسؤول">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                    `;
                    adminsTableBody.appendChild(row);
                });

                // إضافة مستمعي الأحداث لأزرار الحذف
                this.setupAdminActionButtons();
            } else {
                adminsTableBody.innerHTML = `<tr><td colspan="2" class="text-center py-8"><div class="flex flex-col items-center justify-center space-y-3"><div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2"><svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg></div><p class="text-gray-500 dark:text-gray-400 font-medium" data-ar="لا يوجد مسؤولين" data-en="No administrators found">لا يوجد مسؤولين</p><p class="text-sm text-gray-400 dark:text-gray-500" data-ar="قم بإضافة مسؤول جديد لإدارة النظام" data-en="Add a new administrator to manage the system">قم بإضافة مسؤول جديد لإدارة النظام</p></div></td></tr>`;
            }
        });
    }

    setupAdminActionButtons() {
        // أزرار حذف المسؤول
        const deleteButtons = document.querySelectorAll('.delete-admin-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const emailKey = button.getAttribute('data-email');
                this.deleteAdmin(emailKey);
            });
        });
    }

    deleteAdmin(emailKey) {
        if (confirm(document.documentElement.getAttribute('data-lang') === 'ar' ? 
                   'هل أنت متأكد من حذف هذا المسؤول؟' : 
                   'Are you sure you want to delete this admin?')) {
            remove(ref(db, 'admins/' + emailKey))
                .then(() => {
                    this.showSuccess(
                        'تم حذف المسؤول بنجاح',
                        'Admin deleted successfully'
                    );

                    // إعادة تحميل قائمة المسؤولين
                    this.loadAdmins();
                })
                .catch((error) => {
                    console.error("Error deleting admin:", error);
                    this.showError(
                        'حدث خطأ أثناء حذف المسؤول',
                        'Error occurred while deleting admin'
                    );
                });
        }
    }

    // وظيفة حفظ المسؤول الجديد
    saveAdmin() {
        const email = document.getElementById('newAdminEmail').value;
        if (!email) {
            this.showError('الرجاء إدخال البريد الإلكتروني', 'Please enter email address', 'warning');
            return;
        }
        const firebaseEmail = email.replace(/\./g, ',');
        set(ref(db, 'admins/' + firebaseEmail), true)
        .then(() => {
            this.showSuccess('تم إضافة المسؤول بنجاح', 'Admin added successfully', 'success');
            document.getElementById('newAdminEmail').value = '';
            // إعادة تحميل قائمة المسؤولين
            this.loadAdmins();
        })
        .catch((error) => {
            console.error("Error adding admin:", error);
            this.showError('حدث خطأ أثناء إضافة المسؤول', 'Error occurred while adding admin', 'error');
        });

    }


    async showUserDashboard(user){
        try {
            // التحقق من وجود المستخدم في قاعدة البيانات
            const emailKey = user.email.replace(/\./g, ',');
            const userRef = ref(db, `users/${emailKey}`);

            // استخدام onValue بدلاً من get للحصول على تحديثات مباشرة
            onValue(userRef, (userSnapshot) => {
                if (userSnapshot.exists()) {
                    // المستخدم موجود في قاعدة البيانات
                    const userData = userSnapshot.val();

                // التحقق من حالة المستخدم
                if (userData.status === 'active') {
                    // المستخدم نشط - إنشاء صفحة فارغة
                    const mainDash = document.getElementById('dashboard-conetnt');

                    // إضافة صفحة المستخدم إلى العنصر الرئيسي (فارغة حاليًا كما طلب المستخدم)
                    mainDash.innerHTML = `

<div class="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 shadow-sm relative overflow-hidden">
<!-- Background Pattern -->
<div class="absolute inset-0 opacity-5 dark:opacity-10">
<svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
<defs>
<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
<path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"></path>
</pattern>
</defs>
<rect width="100" height="100" fill="url(#grid)" class="text-blue-600 dark:text-blue-400"></rect>
</svg>
</div>

<div class="relative z-10">
<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
<!-- Welcome Content -->
<div class="flex-1">
<div class="flex items-center mb-2 sm:mb-3">
<div class="h-2 w-2 bg-green-500 rounded-full ltr:mr-2 sm:ltr:mr-3 rtl:ml-2 sm:rtl:ml-3 animate-pulse"></div>
<span class="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400" data-ar="متصل الآن" data-en="Online Now">متصل الآن</span>
</div>
<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight"><span data-ar="أهلاً وسهلاً بك" data-en="Welcome Back">أهلاً وسهلاً بك</span><span id="welcomeUserName" class="inline-block mr-1 sm:mr-2 ltr:ml-1 sm:ltr:ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">${userData.username || user.displayName || 'المشتري'}</span>
</h1>
<p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed" data-ar="نحن سعداء لرؤيتك مرة أخرى. استمتع بإدارة محتواك وميزاتك المتقدمة بكل سهولة ومرونة" data-en="We're glad to see you again. Enjoy managing your content and advanced features with ease and flexibility">نحن سعداء لرؤيتك مرة أخرى. استمتع بإدارة محتواك وميزاتك المتقدمة بكل سهولة ومرونة</p>
<!-- Quick Stats -->
<div class="flex flex-wrap items-center gap-3 sm:gap-6">
<div class="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 rtl:ml-1.5 sm:rtl:ml-2 rtl:mr-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
</svg>
<span data-ar="آخر زيارة: اليوم" data-en="Last visit: Today">آخر زيارة: اليوم</span>
</div>
<div class="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 rtl:ml-1.5 sm:rtl:ml-2 rtl:mr-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
</svg>
<span data-ar="جميع الأنظمة تعمل" data-en="All systems operational">جميع الأنظمة تعمل</span>
</div>
</div>
</div>

<!-- Welcome Icon with Animation -->
<div class="flex-shrink-0 mt-1 sm:mt-0">
<div class="relative">
<div class="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transform hover:scale-105 transition-transform duration-200">
<svg class="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
</svg>
</div>
<div class="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
</div>
</div>
</div>

<!-- Separator Line -->
<div class="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent mb-4 sm:mb-6"></div>

<!-- Feature Highlights -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
<div class="flex items-center p-2 sm:p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
<div class="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-2 sm:mr-3 rtl:ml-2 sm:rtl:ml-3 rtl:mr-0">
<svg class="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
</svg>
</div>
<div>
<h4 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white" data-ar="أداء سريع" data-en="Fast Performance">أداء سريع</h4>
<p class="text-xs text-gray-500 dark:text-gray-400" data-ar="تحميل فوري" data-en="Instant loading">تحميل فوري</p>
</div>
</div>

<div class="flex items-center p-2 sm:p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30">
<div class="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 mr-2 sm:mr-3 rtl:ml-2 sm:rtl:ml-3 rtl:mr-0">
<svg class="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
</svg>
</div>
<div>
<h4 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white" data-ar="حماية متقدمة" data-en="Advanced Security">حماية متقدمة</h4>
<p class="text-xs text-gray-500 dark:text-gray-400" data-ar="بيانات آمنة" data-en="Secure data">بيانات آمنة</p>
</div>
</div>

<div class="flex items-center p-2 sm:p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
<div class="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-2 sm:mr-3 rtl:ml-2 sm:rtl:ml-3 rtl:mr-0">
<svg class="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6-4a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 12a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h2z"></path>
</svg>
</div>
<div>
<h4 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white" data-ar="تخصيص مرن" data-en="Flexible Customization">تخصيص مرن</h4>
<p class="text-xs text-gray-500 dark:text-gray-400" data-ar="تحكم كامل" data-en="Full control">تحكم كامل</p>
</div>
</div>
</div>
</div>
</div>
<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
<!-- User Info -->
<div class="flex items-center space-x-3 sm:space-x-5 w-full sm:w-auto">
<div class="relative">
<div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
<svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
</svg>
</div>
<div class="absolute -bottom-1 ltr:-left-1 rtl:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
</div>
<div class="space-y-0.5 sm:space-y-1 overflow-hidden">
<div class="flex flex-wrap items-center gap-2">
<h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]" id="userProfileName">${userData.username || user.displayName || 'المشتري'}</h3>
<span class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full" data-ar="متواجد" data-en="Present">متواجد</span>
</div>
<p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-[250px]" id="userEmail">${user.email || 'المشتري'}</p>
</div>
</div>

<!-- Notifications and Actions -->
<div class="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
<!-- Notifications Dropdown -->
<div class="dropdown relative m-0 sm:rtl:ml-2 sm:ltr:mr-2 order-1 sm:order-0">
<button id="notificationsBtn" type="button" class="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 group" data-bs-toggle="dropdown" aria-label="الإشعارات">
<svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 16 16">
<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"></path>
</svg>
<span id="unreadCount" class="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" style="display: none;">
0
</span>
</button>

<!-- Notifications Dropdown Menu -->
<div class="dropdown-menu absolute top-12 right-0 rtl:left-0 rtl:right-auto w-[280px] sm:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50 opacity-0 invisible transform scale-95 transition-all duration-300 ease-out" id="notificationsDropdown">
<!-- Dropdown Header -->
<div class="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-700/50 border-b border-gray-200/60 dark:border-gray-700/60">
<div class="flex items-center justify-between">
<div class="flex items-center">
<h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white" data-ar="الإشعارات" data-en="Notifications">الإشعارات</h2>
</div>
<button id="markAllReadBtn" type="button" class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 rounded-lg border border-blue-200 dark:border-blue-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30" aria-label="تعليم كل الرسائل كمقروءة" data-ar="تعليم الكل كمقروءة" data-en="Mark all read">تعليم الكل كمقروءة</button>
</div>
</div>

<!-- Notifications List -->
<div id="notificationsList" class="max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
<div class="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
  <div class="relative mb-3 sm:mb-4">
    <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
      <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
      </svg>
    </div>
    <div class="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
      <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  </div>
  <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2" data-ar="صندوق الوارد فارغ" data-en="Inbox Empty">صندوق الوارد فارغ</h3>
  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-1" data-ar="لا توجد إشعارات جديدة في الوقت الحالي" data-en="No new notifications at the moment">لا توجد إشعارات جديدة في الوقت الحالي</p>
  <p class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 text-center" data-ar="ستظهر التحديثات والرسائل الجديدة هنا" data-en="Updates and new messages will appear here">ستظهر التحديثات والرسائل الجديدة هنا</p>
</div>
</div>

<!-- Footer -->
<div class="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200/60 dark:border-gray-700/60">
<div class="flex items-center justify-center">
<span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500" data-ar="آخر تحديث: الآن" data-en="Last updated: Now">آخر تحديث: الآن</span>
</div>
</div>
</div>
</div>

<!-- Logout Button -->
<button id="logoutBtn" class="inline-flex items-center px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 group">
<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:ml-1.5 sm:rtl:ml-2 ltr:mr-1.5 sm:ltr:mr-2 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
</svg>
<span data-ar="تسجيل الخروج" data-en="Logout">تسجيل الخروج</span>
</button>
</div>
</div>
</div>

<!-- الأقسام الأصلية -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
<!-- Template Features Card -->
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
<div class="flex items-center mb-4">
<div class="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
<svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
</svg>
</div>
<h3 class="text-lg font-semibold text-gray-900 dark:text-white rtl:mr-3 ltr:ml-3" data-ar="ميزات القالب" data-en="Template Features">ميزات القالب</h3>
</div>
<p class="text-gray-600 dark:text-gray-300 text-sm" data-ar="استكشف جميع الميزات المتاحة في قالبك" data-en="Explore all available features in your template">استكشف جميع الميزات المتاحة في قالبك</p>
</div>

<!-- Support Card -->
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
<div class="flex items-center mb-4">
<div class="h-10 w-10 flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
<svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
</svg>
</div>
<h3 class="text-lg font-semibold text-gray-900 dark:text-white rtl:mr-3 ltr:ml-3" data-ar="الدعم الفني" data-en="Technical Support">الدعم الفني</h3>
</div>
<p class="text-gray-600 dark:text-gray-300 text-sm" data-ar="احصل على المساعدة عند الحاجة" data-en="Get help when you need it">احصل على المساعدة عند الحاجة</p>
</div>

<!-- Documentation Card -->
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
<div class="flex items-center mb-4">
<div class="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
<svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
</svg>
</div>
<h3 class="text-lg font-semibold text-gray-900 dark:text-white rtl:mr-3 ltr:ml-3" data-ar="التوثيق" data-en="Documentation">التوثيق</h3>
</div>
<p class="text-gray-600 dark:text-gray-300 text-sm" data-ar="اقرأ دليل الاستخدام والتوثيق" data-en="Read the user guide and documentation">اقرأ دليل الاستخدام والتوثيق</p>
</div>
</div>

<!-- تفاصيل المستخدم والشراء -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <!-- 1. تفاصيل الحساب -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- رأس القسم -->
        <div class="bg-blue-600 dark:bg-blue-700 p-4 relative">
            <h3 class="text-lg font-bold text-white flex items-center" data-ar="تفاصيل الحساب" data-en="Account Details">
                <svg class="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>تفاصيل الحساب</span>
            </h3>
        </div>

        <!-- محتوى القسم -->
        <div class="p-5">
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
                <div class="flex items-center py-4">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="تاريخ التسجيل" data-en="Registration Date">تاريخ التسجيل</h4>
<p class="text-base font-medium text-gray-900 dark:text-white mt-1" id="registrationDate">01/01/2023</p>
                    </div>
                </div>


                <div class="flex items-center py-4">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="حالة المستخدم" data-en="User Status">حالة المستخدم</h4>
                        <span class="inline-flex items-center px-2.5 py-0.5 mt-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full" id="userStatus" data-ar="نشط" data-en="Active">نشط</span>
                    </div>
                </div>

                <div class="flex items-center py-4">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="أيام الدعم المتبقية" data-en="Remaining Support Days">أيام الدعم المتبقية</h4>
                        <p class="text-base font-medium text-gray-900 dark:text-white mt-1" id="supportDaysLeft">30</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. تفاصيل الشراء -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- رأس القسم -->
        <div class="bg-emerald-600 dark:bg-emerald-700 p-4 relative">
            <h3 class="text-lg font-bold text-white flex items-center" data-ar="تفاصيل الشراء" data-en="Purchase Details">
                <svg class="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <span>تفاصيل الشراء</span>
            </h3>
        </div>

        <!-- محتوى القسم -->
        <div class="p-5">
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
                <div class="flex items-center py-4">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                        </svg>
                    </div>
                    <div class="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="الخطة المشتراة" data-en="Purchased Plan">الخطة المشتراة</h4>
                        <p class="text-base font-medium text-gray-900 dark:text-white mt-1" id="purchasedPlan">الخطة الأساسية</p>
                    </div>
                </div>

                <div class="flex items-center py-4">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div class="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="عدد التفعيلات المسموحة" data-en="Allowed Activations">عدد التفعيلات المسموحة</h4>
                        <p class="text-base font-medium text-gray-900 dark:text-white mt-1" id="allowedActivations">3</p>
                    </div>
                </div>

                <div class="flex items-center py-4">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="قيمة الشراء" data-en="Purchase Value">قيمة الشراء</h4>
                        <p class="text-base font-medium text-gray-900 dark:text-white mt-1" id="purchaseValue">$99</p>
                    </div>
                </div>

                <div class="flex items-center py-4" id="developerSignatureContainer">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                    </div>
                    <div class="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400" data-ar="توقيع المطور" data-en="Developer Signature">توقيع المطور</h4>
                        <span class="inline-flex items-center px-2.5 py-0.5 mt-2 text-xs font-medium rounded-full" id="developerSignature" data-ar="ظاهر" data-en="Visible"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 3. تفعيل مدونة جديدة -->
<div class="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
    <!-- رأس القسم -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 p-3 relative">
        <h3 class="text-base font-medium text-white flex items-center" data-ar="تفعيل مدونة جديدة" data-en="Activate New Blog">
            <svg class="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>تفعيل مدونة جديدة</span>
        </h3>
    </div>

    <!-- محتوى القسم -->
    <div class="p-4">
        <!-- عداد التفعيلات - نظام Grid -->
        <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-300">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-2 rtl:mr-2 rtl:ml-0">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-300" data-ar="التفعيلات المتبقية" data-en="Remaining Activations">التفعيلات المتبقية</h4>
                        <div class="mt-1">
                            <span class="text-lg font-medium text-gray-900 dark:text-white" id="remainingActivations">2</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-300">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-2 rtl:mr-2 rtl:ml-0">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-300" data-ar="إجمالي التفعيلات" data-en="Total Activations">إجمالي التفعيلات</h4>
                        <div class="mt-1">
                            <span class="text-lg font-medium text-gray-900 dark:text-white" id="totalActivations">3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- نموذج التفعيل -->
        <div class="relative">
            <div class="relative mb-3">
                <div class="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3 rtl:pl-0 rtl:pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                </div>
                <input type="text" id="blogUrl" placeholder="أدخل رابط المدونة (مثال: https://example.blogspot.com)" data-ar-placeholder="أدخل رابط المدونة (مثال: https://example.blogspot.com)" data-en-placeholder="Enter blog URL (example: https://example.blogspot.com)" class="w-full pl-10 rtl:pl-4 rtl:pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 transition-colors duration-200">
            </div>

            <button id="activateBlogBtn" class="w-full flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white font-medium rounded-md transition-colors duration-200">
                <svg class="w-4 h-4 rtl:ml-2 ltr:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span data-ar="تفعيل المدونة" data-en="Activate Blog">تفعيل المدونة</span>
            </button>
        </div>

            <div id="blogInfoMessage" class="hidden mt-3 p-2.5 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-xs rounded-md flex items-center border border-blue-100 dark:border-blue-800">
                <svg class="animate-spin h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span data-ar="جاري التحقق من المدونة..." data-en="Verifying blog...">جاري التحقق من المدونة...</span>
            </div>
        </div>
    </div>
</div>

<!-- 4. مدوناتك المفعلة -->
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
    <div class="flex items-center mb-6">
        <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
            <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white rtl:mr-3 ltr:ml-3" data-ar="مدوناتك المفعلة" data-en="Your Activated Blogs">مدوناتك المفعلة</h3>
    </div>

    <div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
                <tr>
                    <th class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" data-ar="اسم المدونة" data-en="Blog Name">اسم المدونة</th>
                    <th class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" data-ar="معرف المدونة" data-en="Blog ID">معرف المدونة</th>
                    <th class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" data-ar="رابط المدونة" data-en="Blog URL">رابط المدونة</th>
                    <th class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" data-ar="تاريخ التفعيل" data-en="Activation Date">تاريخ التفعيل</th>
                    <th class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right rtl:text-right ltr:text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" data-ar="الإجراء" data-en="Action">الإجراء</th>
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700" id="activatedBlogsTable">
                <!-- سيتم إضافة الصفوف ديناميكيًا هنا -->
                <tr class="text-center">
                    <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 16 16" class="text-gray-300 dark:text-gray-600 m-auto mb-2 w-[35px]">
<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path>
</svg>
<span class="text-gray-500 dark:text-gray-400" data-ar="لا توجد مدونات مفعلة حتى الآن" data-en="No activated blogs yet">لا توجد مدونات مفعلة حتى الآن</span>
                        </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- قسم تحميل إصدارات القالب -->
<div class="bg-white dark:bg-gray-800 rounded-xl border-t-4 border-t-blue-500 dark:border-t-blue-400 border border-gray-100 dark:border-gray-700 p-6 mb-8">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
            <div class="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/30">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white rtl:mr-4 ltr:ml-4" data-ar="تحميل إصدارات القالب" data-en="Template Version Downloads">تحميل إصدارات القالب</h3>
        </div>
        <div class="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800/30">
            <span data-ar="أحدث الإصدارات" data-en="Latest Versions">أحدث الإصدارات</span>
        </div>
    </div>

    <div id="template-versions-container" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- سيتم إضافة بطاقات الإصدارات هنا ديناميكيًا -->
        <div class="text-center py-10 col-span-full bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
            <svg class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-lg" data-ar="جاري تحميل إصدارات القالب..." data-en="Loading template versions...">جاري تحميل إصدارات القالب...</p>
        </div>
    </div>
</div>



                    `;

                    // إضافة مستمع حدث لزر تعليم جميع الرسائل كمقروءة
                    const markAllReadBtn = document.getElementById('markAllReadBtn');
                    if (markAllReadBtn) {
                        markAllReadBtn.addEventListener('click', () => this.markAllMessagesAsRead());
                    }

                    // التحقق من تسجيل الدخول وعرض رسالة الترحيب
                    const loginKey = `loginSuccess_${user.email}`;
                    const hasShownLoginMessage = localStorage.getItem(loginKey);

                    if (!hasShownLoginMessage) {
                        // عرض رسالة الترحيب لعملية تسجيل الدخول الناجحة
                        this.showSuccess('تم تسجيل الدخول بنجاح', 'Login successful');
                        // تسجيل أن الرسالة تم عرضها
                        localStorage.setItem(loginKey, 'true');
                    }

                    // تحديث بيانات المستخدم في الواجهة
                    this.updateUserDashboardData(userData, user);

                    // تهيئة وظائف تفعيل المدونة
                    this.initBlogActivation(userData, user);

                    // عرض المدونات المفعلة
                    this.loadActivatedBlogs(userData, user);

                    // تحميل وعرض الرسائل
                    this.loadUserMessages(user);

                    // تحميل إصدارات القالب للمشتري
                    this.loadBuyerTemplateVersions();

                    logoutBtn.addEventListener('click', () => {
                        this.signOut();
                    });
                    // تطبيق اللغة المحفوظة على العناصر الجديدة
                applyLanguageToNewElements(mainDash);
                } else if (userData.status === 'pending') {
        
                    // عرض رسالة الخطأ مع رابط التواصل
                    const contactLink = userData.contactLink || '#';
                    this.showError(
                        `يجب عليك إكمال عملية الدفع أولاً. للتواصل: <a href="${contactLink}" target="_blank" class="text-blue-600 dark:text-blue-400 underline">اضغط هنا</a>`,
                        `You need to complete the payment process first. To contact: <a href="${contactLink}" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Click here</a>`
                    );

                    // تسجيل الخروج بعد عرض الرسالة
                    setTimeout(() => {
                        this.signOut();
                    }, 5000);

                } else if (userData.status === 'blocked') {

                    // عرض رسالة الحظر مع السبب ورابط التواصل
                    const blockReason = userData.blockReason || 'سبب غير محدد';
                    const contactLink = userData.contactLink || '#';
                    this.showError(
                        `تم حظرك نهائياً من استخدام القالب. السبب: ${blockReason}. للتواصل: <a href="${contactLink}" target="_blank" class="text-blue-600 dark:text-blue-400 underline">اضغط هنا</a>`,
                        `You have been permanently blocked from using the template. Reason: ${blockReason}. To contact: <a href="${contactLink}" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Click here</a>`
                    );

                    // تسجيل الخروج بعد عرض الرسالة
                    setTimeout(() => {
                        this.signOut();
                    }, 5000);
                }

            } else {
                this.showError(
                    'البريد الإلكتروني غير مسجل في قاعدة البيانات',
                    'Email is not registered in the database'
                );

                // تسجيل الخروج
                setTimeout(() => {
                    this.signOut();
                }, 5000);
            }
        });

        } catch (error) {
            console.error('Error checking user status:', error);
            this.showError(
                'حدث خطأ أثناء التحقق من حالة المستخدم',
                'Error checking user status'
            );

            // تسجيل الخروج في حالة الخطأ
            setTimeout(() => {
                this.signOut();
            }, 5000);
        }
    }


    showError(messageAr, messageEn) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const currentLang = document.documentElement.getAttribute('data-lang') || 'ar';

        // استخدام innerHTML بدلاً من textContent لدعم الروابط HTML
        errorText.innerHTML = currentLang === 'ar' ? messageAr : messageEn;

        // إظهار رسالة الخطأ مع تأثير انتقالي
        errorDiv.classList.remove('hidden');
        // إضافة تأخير صغير قبل إضافة الفئات الانتقالية
        setTimeout(() => {
            errorDiv.classList.add('opacity-100');
            errorDiv.classList.remove('opacity-0', 'translate-y-[-20px]');
        }, 10);

        // إخفاء الرسالة بعد 5 ثوانٍ
        setTimeout(() => {
            // إضافة تأثير انتقالي للإخفاء
            errorDiv.classList.add('opacity-0', 'translate-y-[-20px]');
            errorDiv.classList.remove('opacity-100');

            // إخفاء العنصر بعد انتهاء التأثير الانتقالي
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 300);
        }, 5000);
    }

    showSuccess(messageAr, messageEn) {
        const successDiv = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        const currentLang = document.documentElement.getAttribute('data-lang') || 'ar';

        // استخدام innerHTML بدلاً من textContent لدعم الروابط HTML
        successText.innerHTML = currentLang === 'ar' ? messageAr : messageEn;

        // إظهار رسالة النجاح مع تأثير انتقالي
        successDiv.classList.remove('hidden');
        // إضافة تأخير صغير قبل إضافة الفئات الانتقالية
        setTimeout(() => {
            successDiv.classList.add('opacity-100');
            successDiv.classList.remove('opacity-0', 'translate-y-[-20px]');
        }, 10);

        // إخفاء الرسالة بعد 5 ثوانٍ
        setTimeout(() => {
            // إضافة تأثير انتقالي للإخفاء
            successDiv.classList.add('opacity-0', 'translate-y-[-20px]');
            successDiv.classList.remove('opacity-100');

            // إخفاء العنصر بعد انتهاء التأثير الانتقالي
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 300);
        }, 5000);
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('adminPassword');
        const eyeIcon = document.getElementById('eyeIcon');
        const eyeOffIcon = document.getElementById('eyeOffIcon');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeOffIcon.classList.remove('hidden');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeOffIcon.classList.add('hidden');
        }
    }

    async signOut() {
        try {
            // حذف localStorage الخاص برسالة تسجيل الدخول
            const currentUser = auth.currentUser;
            if (currentUser) {
                const loginKey = `loginSuccess_${currentUser.email}`;
                localStorage.removeItem(loginKey);
            }

            await signOut(auth);
            this.showLoginPage();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // تحميل إصدارات القالب للمشتري
    async loadBuyerTemplateVersions() {
        try {
            // الحصول على حاوية إصدارات القالب
            const versionsContainer = document.getElementById('template-versions-container');
            if (!versionsContainer) return;

            // الحصول على إصدارات القالب من قاعدة البيانات واستخدام onValue للاستماع للتغييرات
            const versionsRef = ref(db, 'templateVersions');

            // استخدام onValue للاستماع للتغييرات في الوقت الفعلي
            onValue(versionsRef, (versionsSnapshot) => {
                // مسح المحتوى الحالي
                versionsContainer.innerHTML = '';
                if (versionsSnapshot.exists()) {
                    const versionsData = versionsSnapshot.val();
                    const versions = [];

                    // تحويل البيانات إلى مصفوفة
                    for (const versionId in versionsData) {
                        versions.push({
                            id: versionId,
                            ...versionsData[versionId]
                        });
                    }

                    // ترتيب الإصدارات حسب رقم الإصدار (تصاعدي من الأقدم للأحدث)
                    versions.sort((a, b) => {
                        return this.compareVersions(a.versionNumber, b.versionNumber);
                    });

                // عرض الإصدارات في بطاقات
                if (versions.length === 0) {
                    // إذا لم تكن هناك إصدارات، عرض رسالة
                    versionsContainer.innerHTML = `
                        <div class="text-center py-10 col-span-full bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                            <div class="h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mb-4">
                                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2" data-ar="لا توجد إصدارات متاحة" data-en="No Versions Available">لا توجد إصدارات متاحة</h4>
                            <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto" data-ar="لا توجد إصدارات متاحة للتحميل حالياً، يرجى التحقق لاحقاً" data-en="There are no template versions available for download at the moment. Please check back later.">لا توجد إصدارات متاحة للتحميل حالياً، يرجى التحقق لاحقاً</p>
                        </div>
                    `;
                } else {
                    // إضافة الإصدارات إلى الحاوية
                    versions.forEach(version => {

                        // إنشاء بطاقة الإصدار
                        const versionCard = document.createElement('div');
                        versionCard.className = 'bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-5 group transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800/30';
                        versionCard.innerHTML = `
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center">
                                    <div class="h-8 w-8 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                                        <svg class="h-4 w-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-base font-semibold text-gray-900 dark:text-white rtl:mr-3 ltr:ml-3" data-ar="${version.title}" data-en="${version.titleEn}">${version.title}</h3>
                                </div>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                                    ${version.versionNumber}
                                </span>
                            </div>
                            <div class="h-16 overflow-hidden mb-4">
                                <p class="text-sm text-gray-600 dark:text-gray-400" data-ar="${version.description}" data-en="${version.descriptionEn}">${version.description}</p>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-500 dark:text-gray-500" data-ar="${new Date(version.createdAt || Date.now()).toLocaleDateString('ar-SA', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit',calendar: 'gregory'})}" data-en="${new Date(version.createdAt || Date.now()).toLocaleDateString('en-GB', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit',calendar: 'gregory'})}">${new Date(version.createdAt || Date.now()).toLocaleDateString('ar-SA', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit',calendar: 'gregory'})}</span>
                                <a href="${version.downloadLink}" target="_blank" class="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg border border-blue-100 dark:border-blue-800/30 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white group-hover:border-transparent dark:group-hover:border-transparent transition-colors">
                                    <svg class="w-4 h-4 rtl:ml-1.5 ltr:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                    </svg>
                                    <span data-ar="تحميل" data-en="Download">تحميل</span>
                                </a>
                            </div>
                        `;

                        versionsContainer.appendChild(versionCard);
                    });
                }


            } else {
                // إذا لم تكن هناك إصدارات، عرض رسالة
                versionsContainer.innerHTML = `
                    <div class="text-center py-10 col-span-full bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                        <div class="h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mb-4">
                            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2" data-ar="لا توجد إصدارات متاحة" data-en="No Versions Available">لا توجد إصدارات متاحة</h4>
                        <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto" data-ar="لا توجد إصدارات متاحة للتحميل حالياً، يرجى التحقق لاحقاً" data-en="There are no template versions available for download at the moment. Please check back later.">لا توجد إصدارات متاحة للتحميل حالياً، يرجى التحقق لاحقاً</p>
                    </div>
                `;
            }
            // تطبيق اللغة على العناصر الجديدة
                applyLanguageToNewElements(versionsContainer);
        });
        } catch (error) {
            console.error('Error loading template versions for buyer:', error);
            // عرض رسالة خطأ في حاوية الإصدارات
            const versionsContainer = document.getElementById('template-versions-container');
            if (versionsContainer) {
                versionsContainer.innerHTML = `
                    <div class="text-center py-10 col-span-full bg-red-50 dark:bg-red-900/10 rounded-lg border border-dashed border-red-200 dark:border-red-800/30">
                        <div class="h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800/30 mb-4">
                            <svg class="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <h4 class="text-lg font-medium text-red-700 dark:text-red-400 mb-2" data-ar="حدث خطأ أثناء التحميل" data-en="Error Loading Versions">حدث خطأ أثناء التحميل</h4>
                        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto" data-ar="حدث خطأ أثناء تحميل إصدارات القالب، يرجى تحديث الصفحة أو المحاولة لاحقاً" data-en="An error occurred while loading template versions. Please refresh the page or try again later.">حدث خطأ أثناء تحميل إصدارات القالب، يرجى تحديث الصفحة أو المحاولة لاحقاً</p>
                        <button class="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg border border-red-200 dark:border-red-800/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white hover:border-transparent dark:hover:border-transparent transition-colors" onclick="window.location.reload()" data-ar="تحديث الصفحة" data-en="Refresh Page">تحديث الصفحة</button>
                    </div>
                `;
            }
        }
    }

    // User Management Functions
    async saveNewUser() {
        try {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const plan = document.getElementById('plan').value;
            const activations = parseInt(document.getElementById('activations').value);
            const supportDays = parseInt(document.getElementById('supportDays').value);
            const purchaseValue = parseFloat(document.getElementById('purchaseValue').value);
            const status = document.getElementById('status').value;
            const notes = document.getElementById('notes').value;
            const contactLink = document.getElementById('contactLink').value;
            const blockReason = document.getElementById('blockReason').value;

            if (!username || !email || !plan || isNaN(activations) || isNaN(supportDays) || isNaN(purchaseValue)) {
                this.showError('يرجى ملء جميع الحقول المطلوبة', 'Please fill all required fields');
                return;
            }

            // التحقق من وجود رابط التواصل إذا كانت الحالة بانتظار الدفع أو محظور
            if ((status === 'pending' || status === 'blocked') && !contactLink) {
                this.showError('يرجى إضافة رابط للتواصل', 'Please add a contact link');
                return;
            }

            // التحقق من وجود سبب الحظر إذا كانت الحالة محظور
            if (status === 'blocked' && !blockReason) {
                this.showError('يرجى إضافة سبب الحظر', 'Please add a reason for blocking');
                return;
            }

            // تحويل البريد الإلكتروني إلى مفتاح صالح في قاعدة البيانات
            const emailKey = email.replace(/\./g, ',');

            // إنشاء كائن بيانات المستخدم
            const userData = {
                username,
                email,
                plan,
                activations,
                supportDays,
                purchaseValue,
                status,
                notes,
                createdAt: new Date().toISOString(),
                lastSupportUpdate: new Date().toISOString()
            };

            // إضافة رابط التواصل وسبب الحظر إذا كانت موجودة
            if (contactLink) {
                userData.contactLink = contactLink;
            }

            if (blockReason) {
                userData.blockReason = blockReason;
            }

            // حفظ البيانات في قاعدة البيانات
            await set(ref(db, `users/${emailKey}`), userData);


            this.showSuccess('تم إضافة المستخدم بنجاح', 'User added successfully');

            // إعادة تحميل قائمة المستخدمين
            this.loadUsers();

        } catch (error) {
            console.error('Error saving user:', error);
            this.showError('حدث خطأ أثناء حفظ بيانات المستخدم', 'Error saving user data');
        }
    }

    loadUsers() {
        try {
            const usersRef = ref(db, 'users');

            // استخدام onValue لمراقبة التغييرات في الوقت الفعلي
            // استخدام متغير عام لتخزين مرجع المستمع لإمكانية إلغائه عند الحاجة
            if (window.usersListener) {
                // إلغاء المستمع السابق لتجنب تكرار الاستدعاءات
                window.usersListener();
            }

            window.usersListener = onValue(usersRef, async (usersSnapshot) => {
                const usersTableBody = document.getElementById('usersTableBody');
                if (!usersTableBody) return;

                // مسح الجدول
                usersTableBody.innerHTML = '';

                if (usersSnapshot.exists()) {
                    const usersData = usersSnapshot.val();

                    // تحديث أيام الدعم لجميع المستخدمين
                    await this.updateSupportDays(usersData);

                    // استخدام البيانات المحدثة مباشرة
                    const updatedUsersData = usersData;

                    // عرض المستخدمين في الجدول
                for (const emailKey in updatedUsersData) {
                    const user = updatedUsersData[emailKey];
                    const row = document.createElement('tr');

                    // إضافة معلومات إضافية كسمات للصف حسب حالة المستخدم
                    if (user.status === 'pending' && user.contactLink) {
                        // إضافة رابط الاتصال فقط للمستخدمين بحالة انتظار الدفع
                        row.setAttribute('data-contact-link', user.contactLink);
                    } else if (user.status === 'blocked') {
                        // إضافة رابط الاتصال وسبب الحظر للمستخدمين المحظورين
                        if (user.contactLink) {
                            row.setAttribute('data-contact-link', user.contactLink);
                        }
                        if (user.blockReason) {
                            row.setAttribute('data-block-reason', user.blockReason);
                        }
                    }

                    // تحديد لون الحالة
                    let statusColor = '';
                    let statusText = '';

                    if (user.status === 'active') {
                        statusColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                        statusText = `<span class="px-2 py-1 text-xs font-medium ${statusColor} rounded-full" data-ar="نشط" data-en="Active">نشط</span>`;
                    } else if (user.status === 'pending') {
                        statusColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                        statusText = `<span class="px-2 py-1 text-xs font-medium ${statusColor} rounded-full" data-ar="بانتظار الدفع" data-en="Payment Pending">بانتظار الدفع</span>`;
                    } else if (user.status === 'blocked') {
                        statusColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                        statusText = `<span class="px-2 py-1 text-xs font-medium ${statusColor} rounded-full" data-ar="محظور" data-en="Blocked">محظور</span>`;
                    }

                    // تحديد نص الخطة
                    let planText = '';
                    if (user.plan === 'basic') {
                        planText = `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" data-ar="الأساسية" data-en="Basic">الأساسية</td>`;
                    } else if (user.plan === 'pro') {
                        planText = `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" data-ar="الإحترافية" data-en="Professional">الإحترافية</td>`;
                    } else if (user.plan === 'ultimate') {
                        planText = `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" data-ar="الخارقة" data-en="Ultimate">الخارقة</td>`;
                    }

                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${user.username}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${user.email}</td>
                        ${planText}
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${user.activatedBlogs ? Object.keys(user.activatedBlogs).length : 0} / ${user.activations}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${user.supportDays}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">$${user.purchaseValue}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            ${statusText}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex space-x-2">
                                <button data-bs-toggle="modal" data-bs-target="#editUserModal" class="edit-user-btn p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400" data-email="${user.email}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                                <button data-bs-toggle="modal" data-bs-target="#sendMessageToUserModal" class="message-user-btn p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600 dark:text-green-400" data-email="${user.email}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                    </svg>
                                </button>
                                <button class="delete-user-btn p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400" data-email="${user.email}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    `;

                    usersTableBody.appendChild(row);
                    applyLanguageToNewElements(usersTableBody);
                }

                    // إضافة مستمعي الأحداث لأزرار الإجراءات
                    this.setupUserActionButtons();
                }
            });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    async updateSupportDays(usersData) {
        try {
            const currentDate = new Date();
            const updates = {};

            for (const emailKey in usersData) {
                const user = usersData[emailKey];
                const lastUpdateDate = new Date(user.lastSupportUpdate || user.createdAt);

                // حساب عدد الأيام منذ آخر تحديث
                const daysDiff = Math.floor((currentDate - lastUpdateDate) / (1000 * 60 * 60 * 24));

                if (daysDiff > 0 && user.supportDays > 0) {
                    // تحديث عدد أيام الدعم المتبقية
                    const newSupportDays = Math.max(0, user.supportDays - daysDiff);

                    updates[`users/${emailKey}/supportDays`] = newSupportDays;
                    updates[`users/${emailKey}/lastSupportUpdate`] = currentDate.toISOString();
                }
            }

            // تطبيق التحديثات إذا كانت موجودة
            if (Object.keys(updates).length > 0) {
                await update(ref(db), updates);
            }
        } catch (error) {
            console.error('Error updating support days:', error);
        }
    }

    setupUserActionButtons() {
        // أزرار تعديل المستخدم
        const editButtons = document.querySelectorAll('.edit-user-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const email = button.getAttribute('data-email');
                this.loadUserDataForEdit(email);
            });
        });

        // أزرار إرسال رسالة للمستخدم
        const messageButtons = document.querySelectorAll('.message-user-btn');
        messageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const email = button.getAttribute('data-email');
                this.openSendMessageModal(email);
            });
        });

        // أزرار حذف المستخدم
        const deleteButtons = document.querySelectorAll('.delete-user-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const email = button.getAttribute('data-email');
                this.deleteUser(email);
            });
        });
    }

    async deleteUser(email) {
        try {
            if (confirm(document.documentElement.getAttribute('data-lang') === 'ar' ? 
                       'هل أنت متأكد من حذف هذا المستخدم؟' : 
                       'Are you sure you want to delete this user?')) {

                const emailKey = email.replace(/\./g, ',');
                await remove(ref(db, `users/${emailKey}`));

                this.showSuccess(
                    'تم حذف المستخدم بنجاح', 
                    'User deleted successfully'
                );

                // إعادة تحميل قائمة المستخدمين
                this.loadUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showError(
                'حدث خطأ أثناء حذف المستخدم', 
                'Error deleting user'
            );
        }
    }

    async loadUserDataForEdit(email) {
        try {
            // تحويل البريد الإلكتروني إلى مفتاح صالح في قاعدة البيانات
            const emailKey = email.replace(/\./g, ',');

            // الحصول على بيانات المستخدم
            const userSnapshot = await get(ref(db, `users/${emailKey}`));

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();

                // حفظ بيانات المستخدم الحالي للاستخدام لاحقًا
                window.currentEditingUser = userData;
                window.currentEditingUserKey = emailKey;

                // ملء النموذج ببيانات المستخدم
                document.getElementById('edit_username').value = userData.username || '';
                document.getElementById('edit_email').value = userData.email || '';
                document.getElementById('edit_plan').value = userData.plan || 'basic';
                document.getElementById('edit_activations').value = userData.activations || 1;
                document.getElementById('edit_supportDays').value = userData.supportDays || 0;
                document.getElementById('edit_purchaseValue').value = userData.purchaseValue || 0;
                document.getElementById('edit_status').value = userData.status || 'active';
                document.getElementById('edit_notes').value = userData.notes || '';

                // عرض حقول إضافية بناءً على الحالة
                const contactLinkContainer = document.getElementById('edit_contactLinkContainer');
                const blockReasonContainer = document.getElementById('edit_blockReasonContainer');

                if (userData.status === 'pending' || userData.status === 'blocked') {
                    contactLinkContainer.classList.remove('hidden');
                    document.getElementById('edit_contactLink').value = userData.contactLink || '';
                } else {
                    contactLinkContainer.classList.add('hidden');
                }

                if (userData.status === 'blocked') {
                    blockReasonContainer.classList.remove('hidden');
                    document.getElementById('edit_blockReason').value = userData.blockReason || '';
                } else {
                    blockReasonContainer.classList.add('hidden');
                }

                // عرض تاريخ التسجيل وآخر تحديث للبيانات
                const registrationDate = document.getElementById('edit_registrationDate');

                if (userData.createdAt) {
                    const createdDate = new Date(userData.createdAt);
                    const savedLanguage = localStorage.getItem('language') || 'ar';

                    if (savedLanguage === 'ar') {
                        registrationDate.textContent = createdDate.toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
calendar: 'gregory'

                        });
                    } else {
                        registrationDate.textContent = createdDate.toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
calendar: 'gregory'
                        });
                    }
                } else {
                    registrationDate.textContent = '-';
                }

                // تحميل بيانات المدونات المفعلة
                this.loadUserBlogs(userData);

                // إضافة مستمع الحدث لتغيير الحالة
                document.getElementById('edit_status').addEventListener('change', this.handleEditStatusChange);

                // إضافة مستمع الحدث لزر الحفظ
                document.getElementById('saveEditUserBtn').addEventListener('click', () => this.saveEditedUser());

            } else {
                this.showError(
                    'لم يتم العثور على بيانات المستخدم', 
                    'User data not found'
                );
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showError(
                'حدث خطأ أثناء تحميل بيانات المستخدم', 
                'Error loading user data'
            );
        }
    }

    handleEditStatusChange(event) {
        const status = event.target.value;
        const contactLinkContainer = document.getElementById('edit_contactLinkContainer');
        const blockReasonContainer = document.getElementById('edit_blockReasonContainer');

        if (status === 'pending' || status === 'blocked') {
            contactLinkContainer.classList.remove('hidden');
        } else {
            contactLinkContainer.classList.add('hidden');
        }

        if (status === 'blocked') {
            blockReasonContainer.classList.remove('hidden');
        } else {
            blockReasonContainer.classList.add('hidden');
        }
    }

    loadUserBlogs(userData) {
        const userBlogsTableBody = document.getElementById('userBlogsTableBody');
        const noBlogsMessage = document.getElementById('noBlogsMessage');

        // مسح الجدول
        userBlogsTableBody.innerHTML = '';

        // التحقق من وجود مدونات مفعلة
        if (userData.activatedBlogs && Object.keys(userData.activatedBlogs).length > 0) {
            noBlogsMessage.classList.add('hidden');

            // عرض المدونات في الجدول
            for (const blogKey in userData.activatedBlogs) {
                const blog = userData.activatedBlogs[blogKey];
                const row = document.createElement('tr');

                // تنسيق تاريخ التفعيل
                let activationDate = '-';
                if (blog.activationDate) {
                    const date = new Date(blog.activationDate);
                    const savedLanguage = localStorage.getItem('language') || 'ar';

                    if (savedLanguage === 'ar') {
                        activationDate = date.toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    } else {
                        activationDate = date.toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    }
                }

                // إنشاء زر إلغاء التفعيل
                const deactivateButton = `<button class="deactivate-blog-btn px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200" data-blog-id="${blogKey}" data-ar="إلغاء التفعيل" data-en="Deactivate">إلغاء التفعيل</button>`;

                // اسم المدونة (استخدام القيمة المخزنة أو استخدام 'غير محدد' إذا لم تكن موجودة)
                const blogName = blog.name || 'غير محدد';

                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${blogName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${blogKey}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <a href="${blog.url}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">${blog.url}</a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${activationDate}</td>
                    <td class="px-6 py-4 whitespace-nowrap ltr:text-left rtl:text-right text-sm font-medium">
                        ${deactivateButton}
                    </td>
                `;

                userBlogsTableBody.appendChild(row);
            }

            // إضافة مستمعي الأحداث لأزرار إلغاء التفعيل
            this.setupDeactivateButtons();

            // تطبيق اللغة على العناصر الجديدة
            applyLanguageToNewElements(userBlogsTableBody);
        } else {
            // عرض رسالة عدم وجود مدونات
            noBlogsMessage.classList.remove('hidden');
        }
    }

    setupDeactivateButtons() {
        const deactivateButtons = document.querySelectorAll('.deactivate-blog-btn');
        deactivateButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const blogId = button.getAttribute('data-blog-id');
                if (!blogId || !window.currentEditingUser || !window.currentEditingUserKey) return;

                // تأكيد إلغاء التفعيل
                const savedLanguage = localStorage.getItem('language') || 'ar';
                const confirmMessage = savedLanguage === 'ar' ? 
                    'هل أنت متأكد من رغبتك في إلغاء تفعيل هذه المدونة؟' : 
                    'Are you sure you want to deactivate this blog?';

                if (confirm(confirmMessage)) {
                    try {
                        // حذف المدونة من قائمة المدونات المفعلة للمستخدم
                        const userRef = ref(db, `users/${window.currentEditingUserKey}/activatedBlogs/${blogId}`);
                        await remove(userRef);

                        // تحديث بيانات المستخدم الحالية
                        delete window.currentEditingUser.activatedBlogs[blogId];

                        // إعادة تحميل جدول المدونات
                        this.loadUserBlogs(window.currentEditingUser);

                        // عرض رسالة نجاح
                        this.showSuccess(
                            'تم إلغاء تفعيل المدونة بنجاح',
                            'Blog deactivated successfully'
                        );
                    } catch (error) {
                        console.error('Error deactivating blog:', error);
                        this.showError(
                            'حدث خطأ أثناء إلغاء تفعيل المدونة',
                            'Error deactivating blog'
                        );
                    }
                }
            });
        });
    }

    async saveEditedUser() {
        try {
            if (!window.currentEditingUser || !window.currentEditingUserKey) {
                this.showError(
                    'لم يتم العثور على بيانات المستخدم', 
                    'User data not found'
                );
                return;
            }

            const username = document.getElementById('edit_username').value;
            const email = document.getElementById('edit_email').value;
            const plan = document.getElementById('edit_plan').value;
            const activations = parseInt(document.getElementById('edit_activations').value);
            const supportDays = parseInt(document.getElementById('edit_supportDays').value);
            const purchaseValue = parseFloat(document.getElementById('edit_purchaseValue').value);
            const status = document.getElementById('edit_status').value;
            const notes = document.getElementById('edit_notes').value;
            const contactLink = document.getElementById('edit_contactLink').value;
            const blockReason = document.getElementById('edit_blockReason').value;

            if (!username || !email || !plan || isNaN(activations) || isNaN(supportDays) || isNaN(purchaseValue)) {
                this.showError('يرجى ملء جميع الحقول المطلوبة', 'Please fill all required fields');
                return;
            }

            // التحقق من وجود رابط التواصل إذا كانت الحالة بانتظار الدفع أو محظور
            if ((status === 'pending' || status === 'blocked') && !contactLink) {
                this.showError('يرجى إضافة رابط للتواصل', 'Please add a contact link');
                return;
            }

            // التحقق من وجود سبب الحظر إذا كانت الحالة محظور
            if (status === 'blocked' && !blockReason) {
                this.showError('يرجى إضافة سبب الحظر', 'Please add a reason for blocking');
                return;
            }

            // إنشاء كائن بيانات المستخدم المحدثة
            const updatedUserData = {
                ...window.currentEditingUser,
                username,
                email,
                plan,
                activations,
                supportDays,
                purchaseValue,
                status,
                notes
            };

            // إضافة رابط التواصل وسبب الحظر إذا كانت موجودة
            if (contactLink) {
                updatedUserData.contactLink = contactLink;
            } else {
                delete updatedUserData.contactLink;
            }

            if (blockReason) {
                updatedUserData.blockReason = blockReason;
            } else {
                delete updatedUserData.blockReason;
            }

            // حفظ البيانات المحدثة في قاعدة البيانات
            await update(ref(db, `users/${window.currentEditingUserKey}`), updatedUserData);

            this.showSuccess('تم تحديث بيانات المستخدم بنجاح', 'User data updated successfully');

            // إعادة تحميل قائمة المستخدمين
            this.loadUsers();

        } catch (error) {
            console.error('Error saving user:', error);
            this.showError('حدث خطأ أثناء حفظ بيانات المستخدم', 'Error saving user data');
        }
    }


    // تحميل المستخدمين لنافذة الرسائل الجماعية
    async loadUsersForBulkMessage() {
        try {
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);

            const bulkMessageUsersTable = document.getElementById('bulkMessageUsersTable');
            if (!bulkMessageUsersTable) return;

            // مسح الجدول
            bulkMessageUsersTable.innerHTML = '';

            if (usersSnapshot.exists()) {
                const usersData = usersSnapshot.val();

                // عرض المستخدمين في الجدول
                for (const emailKey in usersData) {
                    const user = usersData[emailKey];
                    const row = document.createElement('tr');

                    // تحديد لون الحالة
                    let statusColor = '';
                    let statusText = '';

                    if (user.status === 'active') {
                        statusColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                        statusText = `<span class="px-2 py-1 text-xs font-medium ${statusColor} rounded-full" data-ar="نشط" data-en="Active">نشط</span>`;
                    } else if (user.status === 'pending') {
                        statusColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                        statusText = `<span class="px-2 py-1 text-xs font-medium ${statusColor} rounded-full" data-ar="بانتظار الدفع" data-en="Payment Pending">بانتظار الدفع</span>`;
                    } else if (user.status === 'blocked') {
                        statusColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                        statusText = `<span class="px-2 py-1 text-xs font-medium ${statusColor} rounded-full" data-ar="محظور" data-en="Blocked">محظور</span>`;
                    }

                    row.innerHTML = `
                        <td class="px-4 py-3 text-center">
                            <div class="flex items-center justify-center">
                                <div class="relative inline-flex items-center">
                                    <input class="sr-only user-checkbox" 
                                            type="checkbox" 
                                            id="user_${emailKey}" 
                                            data-email="${user.email}" 
                                            data-status="${user.status}" 
                                            checked 
                                            aria-label="تحديد المستخدم">
                                    <label for="user_${emailKey}" class="relative inline-flex items-center cursor-pointer">
                                        <div class="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 hover:bg-gray-300 dark:hover:bg-gray-600 peer-checked:hover:bg-blue-700 dark:peer-checked:hover:bg-blue-400"></div>
                                    </label>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">${user.email}</td>
                        <td class="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">${user.username}</td>
                        <td class="px-4 py-3 text-center">
                            ${statusText}
                        </td>
                    `;

                    bulkMessageUsersTable.appendChild(row);
                }

                // تطبيق اللغة المحفوظة على العناصر الجديدة
                applyLanguageToNewElements(bulkMessageUsersTable);
            }

        } catch (error) {
            console.error('Error loading users for bulk message:', error);
            this.showError(
                'حدث خطأ أثناء تحميل قائمة المستخدمين',
                'Error loading users list'
            );
        }
    }

    // تحديد/إلغاء تحديد جميع المستخدمين
    toggleSelectAllUsers(checked) {
        const userCheckboxes = document.querySelectorAll('#bulkMessageUsersTable .user-checkbox');
        userCheckboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });

        // تحديث حالة زر التحديد الرئيسي
        const selectAllUsers = document.getElementById('selectAllUsers');
        if (selectAllUsers) {
            selectAllUsers.checked = checked;
        }
    }

    // تحديد المستخدمين النشطين فقط
    selectOnlyActiveUsers() {
        const userCheckboxes = document.querySelectorAll('#bulkMessageUsersTable .user-checkbox');
        userCheckboxes.forEach(checkbox => {
            const status = checkbox.getAttribute('data-status');
            checkbox.checked = (status === 'active');
        });

        // تحديث حالة زر التحديد الرئيسي
        const selectAllUsers = document.getElementById('selectAllUsers');
        if (selectAllUsers) {
            selectAllUsers.checked = false;
        }
    }

    // إرسال رسالة جماعية للمستخدمين المحددين
    async sendBulkMessage() {
        try {
            // الحصول على بيانات الرسالة
            const subjectAr = document.getElementById('bulkMessageSubject').value;
            const subjectEn = document.getElementById('bulkMessageSubjectEn').value;
            const messageType = document.getElementById('bulkMessageType').value;
            const contentAr = document.getElementById('bulkMessageContent').value;
            const contentEn = document.getElementById('bulkMessageContentEn').value;
            const isImportant = document.getElementById('bulkMessageImportant').checked;

            // التحقق من وجود العنوان والمحتوى
            if (!subjectAr || !subjectEn || !contentAr || !contentEn || !messageType) {
                this.showError(
                    'يرجى ملء جميع حقول الرسالة المطلوبة',
                    'Please fill all required message fields'
                );
                return;
            }

            // الحصول على المستخدمين المحددين
            const selectedUsers = [];
            const userCheckboxes = document.querySelectorAll('#bulkMessageUsersTable .user-checkbox:checked');

            userCheckboxes.forEach(checkbox => {
                const email = checkbox.getAttribute('data-email');
                if (email) {
                    selectedUsers.push(email);
                }
            });

            // التحقق من وجود مستخدمين محددين
            if (selectedUsers.length === 0) {
                this.showError(
                    'يرجى تحديد مستخدم واحد على الأقل',
                    'Please select at least one user'
                );
                return;
            }

            // إنشاء كائن الرسالة
            const messageData = {
                subject: {
                    ar: subjectAr,
                    en: subjectEn
                },
                content: {
                    ar: contentAr,
                    en: contentEn
                },
                type: messageType,
                isImportant: isImportant,
                isRead: false,
                createdAt: new Date().toISOString(),
                sender: 'admin'
            };

            // إرسال الرسالة لكل مستخدم محدد
            let successCount = 0;
            let errorCount = 0;

            for (const email of selectedUsers) {
                try {
                    // تحويل البريد الإلكتروني إلى مفتاح صالح في قاعدة البيانات
                    const emailKey = email.replace(/\./g, ',');

                    // حفظ الرسالة في قاعدة البيانات
                    const messagesRef = ref(db, `users/${emailKey}/messages`);
                    const newMessageRef = push(messagesRef);
                    await set(newMessageRef, messageData);

                    successCount++;
                } catch (error) {
                    console.error(`Error sending message to ${email}:`, error);
                    errorCount++;
                }
            }


            if (errorCount === 0) {
                this.showSuccess(
                    `تم إرسال الرسالة بنجاح إلى ${successCount} مستخدم`,
                    `Message sent successfully to ${successCount} users`
                );
            } else {
                this.showSuccess(
                    `تم إرسال الرسالة بنجاح إلى ${successCount} مستخدم، وفشل الإرسال إلى ${errorCount} مستخدم`,
                    `Message sent successfully to ${successCount} users, and failed to send to ${errorCount} users`
                );
            }

        } catch (error) {
            console.error('Error sending bulk message:', error);
            this.showError(
                'حدث خطأ أثناء إرسال الرسالة الجماعية',
                'Error sending bulk message'
            );
        }
    }
    // فتح نافذة إرسال رسالة للمستخدم
    async openSendMessageModal(email) {
        try {
            // تحويل البريد الإلكتروني إلى مفتاح صالح في قاعدة البيانات
            const emailKey = email.replace(/\./g, ',');

            // حفظ معلومات المستخدم المستهدف للرسالة
            window.currentMessageTargetEmail = email;
            window.currentMessageTargetKey = emailKey;

            // الحصول على اسم المستخدم من قاعدة البيانات
            try {
                const userRef = ref(db, `users/${emailKey}`);
                const userSnapshot = await get(userRef);
                const userData = userSnapshot.val();
                const userName = userData?.username || userData?.name || 'المستخدم';

                // تحديث اسم المستخدم في العنوان
                const userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = userName;
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // في حالة الخطأ، استخدم النص الافتراضي
                const userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = 'المستخدم';
                }
            }

            // إعادة تعيين حقول النموذج
            document.getElementById('messageSubject').value = '';
            document.getElementById('messageSubjectEn').value = '';
            document.getElementById('messageType').value = 'normal';
            document.getElementById('messageContent').value = '';
            document.getElementById('messageContentEn').value = '';
            document.getElementById('messageImportant').checked = false;

            // تعيين البريد الإلكتروني للمستلم في الحقل المخفي
            document.getElementById('messageRecipientEmail').value = email;

            // إضافة مستمع الحدث لزر الإرسال إذا لم يكن موجودًا
            const sendMessageBtn = document.getElementById('sendMessageBtn');
            if (!sendMessageBtn._hasClickListener) {
                sendMessageBtn.addEventListener('click', () => this.sendMessageToUser());
                sendMessageBtn._hasClickListener = true;
            }
        } catch (error) {
            console.error('Error opening message modal:', error);
            this.showError(
                'حدث خطأ أثناء فتح نافذة الرسائل',
                'Error opening message modal'
            );
        }
    }

    // إرسال رسالة للمستخدم
    async sendMessageToUser() {
        try {
            // الحصول على البريد الإلكتروني للمستلم
            const recipientEmail = document.getElementById('messageRecipientEmail').value;
            if (!recipientEmail) {
                this.showError(
                    'لم يتم تحديد المستخدم المستهدف',
                    'Target user not specified'
                );
                return;
            }

            // تحويل البريد الإلكتروني إلى مفتاح صالح في قاعدة البيانات
            const emailKey = recipientEmail.replace(/\./g, ',');

            // الحصول على بيانات الرسالة
            const subjectAr = document.getElementById('messageSubject').value;
            const subjectEn = document.getElementById('messageSubjectEn').value;
            const messageType = document.getElementById('messageType').value;
            const contentAr = document.getElementById('messageContent').value;
            const contentEn = document.getElementById('messageContentEn').value;
            const isImportant = document.getElementById('messageImportant').checked;

            // التحقق من وجود العنوان والمحتوى
            if (!subjectAr || !subjectEn || !contentAr || !contentEn) {
                this.showError(
                    'يرجى ملء جميع حقول الرسالة المطلوبة',
                    'Please fill all required message fields'
                );
                return;
            }

            // إنشاء كائن الرسالة
            const messageData = {
                subject: {
                    ar: subjectAr,
                    en: subjectEn
                },
                content: {
                    ar: contentAr,
                    en: contentEn
                },
                type: messageType,
                isImportant: isImportant,
                isRead: false,
                createdAt: new Date().toISOString(),
                sender: 'admin'
            };

            // حفظ الرسالة في قاعدة البيانات
            const messagesRef = ref(db, `users/${emailKey}/messages`);
            const newMessageRef = push(messagesRef);
            await set(newMessageRef, messageData);

            this.showSuccess(
                'تم إرسال الرسالة بنجاح',
                'Message sent successfully'
            );

        } catch (error) {
            console.error('Error sending message:', error);
            this.showError(
                'حدث خطأ أثناء إرسال الرسالة',
                'Error sending message'
            );
        }
    }

    // تحميل وعرض رسائل المستخدم
    async loadUserMessages(user) {
        try {
            const emailKey = user.email.replace(/\./g, ',');
            const messagesRef = ref(db, `users/${emailKey}/messages`);

            // الاستماع للتغييرات في الرسائل
            let isFirstLoad = true;
            onValue(messagesRef, (snapshot) => {
                const messages = snapshot.val();

                // إذا لم تكن هذه المرة الأولى لتحميل الرسائل، فهذا يعني وجود رسالة جديدة
                if (!isFirstLoad && messages) {
                    // التحقق من وجود رسائل غير مقروءة جديدة
                    const unreadMessages = Object.values(messages).filter(msg => !msg.isRead);
                    if (unreadMessages.length > 0) {
                        this.showSuccess('تم استلام رسالة جديدة من الإدارة', 'New message received from administration');
                    }
                }

                this.displayUserMessages(messages);
                this.updateUnreadCount(messages);

                // تعيين أن التحميل الأول قد انتهى
                isFirstLoad = false;
            });

        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    // عرض الرسائل في واجهة المستخدم
    displayUserMessages(messages) {
        const notificationsList = document.getElementById('notificationsList');
        const currentLangMsg = localStorage.getItem('language') || 'ar';

        // إذا لم تكن هناك رسائل، عرض رسالة فارغة
        if (!messages || Object.keys(messages).length === 0) {
            notificationsList.innerHTML = `
                <div class="p-6 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg class="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 text-sm text-center leading-relaxed mb-1" data-ar="لا توجد إشعارات جديدة في الوقت الحالي" data-en="No new notifications at the moment">${currentLangMsg === 'ar' ? 'لا توجد إشعارات جديدة في الوقت الحالي' : 'No new notifications at the moment'}</p>
                    <p class="text-gray-400 dark:text-gray-500 text-xs text-center" data-ar="ستظهر التحديثات والرسائل الجديدة هنا" data-en="Updates and new messages will appear here">${currentLangMsg === 'ar' ? 'ستظهر التحديثات والرسائل الجديدة هنا' : 'Updates and new messages will appear here'}</p>
                </div>
            `;
            return;
        }

        // تحويل الرسائل إلى مصفوفة وترتيبها حسب التاريخ
        const messagesArray = Object.entries(messages).map(([id, message]) => ({
            id,
            ...message
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // إنشاء HTML للرسائل
        let messagesHTML = '';
        messagesArray.forEach(message => {
            const isUnread = !message.isRead;
            const isImportant = message.isImportant;
            let messageDateAr,messageDateEn;

            // تحديد نوع الرسالة ولونها وأيقونتها
            let typeConfig = {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                icon: `<svg class="w-5 h-5" fill="#3b82f6" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`,
                text: { ar: 'إشعار', en: 'Notification' }
            };

            // تعيين نصوص وأيقونات حسب نوع الرسالة
            switch(message.type) {
                case 'warning':
                    typeConfig = {
                        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
                        icon: `<svg class="w-5 h-5" fill="#f59e0b" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`,
                        text: { ar: 'تحذير', en: 'Warning' }
                    };
                    break;
                case 'error':
                    typeConfig = {
                        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                        icon: `<svg class="w-5 h-5" fill="#ef4444" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`,
                        text: { ar: 'خطأ', en: 'Error' }
                    };
                    break;
                case 'success':
                    typeConfig = {
                        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                        icon: `<svg class="w-5 h-5" fill="#22c55e" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`,
                        text: { ar: 'نجاح', en: 'Success' }
                    };
                    break;
                case 'thanks':
                    typeConfig = {
                        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                        icon: `<svg class="w-5 h-5" fill="#a855f7" viewBox="0 0 24 24">
  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
`,
                        text: { ar: 'شكر', en: 'Thanks' }
                    };
                    break;
                case 'gift':
                    typeConfig = {
                        color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
                        icon: `<svg class="w-5 h-5" fill="#ec4899" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17A3 3 0 015 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd"></path><path d="M9 11H3v5a2 2 0 002 2h4v-7zm2 7h4a2 2 0 002-2v-5h-6v7z"></path></svg>`,
                        text: { ar: 'هدية', en: 'Gift' }
                    };
                    break;
                default:
                    // استخدام القيم الافتراضية المحددة مسبقًا
                    break;
            }

            // نصوص تعليم الرسالة كمقروءة
            const markAsReadText = {
                ar: isUnread ? 'تعليم كمقروءة' : 'مقروءة',
                en: isUnread ? 'Mark as read' : 'Read'
            };

            // تنسيق التاريخ
            messageDateAr = new Date(message.createdAt).toLocaleDateString('ar-SA',{
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                calendar: 'gregory'
            });
            messageDateEn = new Date(message.createdAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                calendar: 'gregory'
            });
            // إنشاء عنصر الرسالة
            messagesHTML += `
                <div class="message-item border-b border-gray-100 dark:border-gray-700/50 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200 cursor-pointer ${isUnread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}" data-message-id="${message.id}">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 rounded-xl ${typeConfig.color.split(' ')[0]} dark:${typeConfig.color.split(' ')[2]} flex items-center justify-center">
                                ${typeConfig.icon}
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-1">
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate" data-ar="${message.subject.ar}" data-en="${message.subject.en}">${message.subject.ar}</h4>
                                <div class="flex items-center space-x-2">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}" data-ar="${typeConfig.text.ar}" data-en="${typeConfig.text.en}">
                                        ${typeConfig.text.ar}
                                    </span>
                                    ${isImportant ? 
                                        `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" data-ar="هام" data-en="HOT">
                                            هام
                                        </span>` : ''
                                    }
                                    ${isUnread ? '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>' : ''}
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 mt-3" data-ar="${message.content.ar}" data-en="${message.content.en}">${currentLangMsg === 'ar' ? message.content.ar : message.content.en}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-gray-500 dark:text-gray-500" data-ar="${messageDateAr}" data-en="${messageDateEn}">${messageDateAr}</span>
                                <button class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium" onclick="authManager.markMessageAsRead('${message.id}')" data-ar="${markAsReadText.ar}" data-en="${markAsReadText.en}">
                                    ${markAsReadText.ar}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        notificationsList.innerHTML = messagesHTML;

        // إضافة مستمع الأحداث لتعليم الرسائل غير المقروءة كمقروءة عند النقر
        notificationsList.addEventListener('click', (e) => {
            const messageItem = e.target.closest('.message-item');
            if (messageItem) {
                // التحقق مما إذا كانت الرسالة غير مقروءة (تحتوي على النقطة الزرقاء)
                const hasUnreadIndicator = messageItem.querySelector('.bg-blue-500.rounded-full');
                // التحقق مما إذا كانت الرسالة تحتوي على خلفية زرقاء (غير مقروءة)
                const isUnread = messageItem.classList.contains('bg-blue-50/30') || messageItem.classList.contains('dark:bg-blue-900/10');

                if (hasUnreadIndicator || isUnread) {
                    const messageId = messageItem.dataset.messageId;
                    this.markMessageAsRead(messageId);
                }
            }
        });
    }

    // تحديث عداد الرسائل غير المقروءة
    updateUnreadCount(messages) {
        const unreadCountElement = document.getElementById('unreadCount');

        if (!messages) {
            unreadCountElement.style.display = 'none';
            return;
        }

        const unreadCount = Object.values(messages).filter(message => !message.isRead).length;

        if (unreadCount > 0) {
            unreadCountElement.textContent = unreadCount;
            unreadCountElement.style.display = 'inline-flex';
        } else {
            unreadCountElement.style.display = 'none';
        }
    }

    // تعليم رسالة كمقروءة
    async markMessageAsRead(messageId) {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const emailKey = user.email.replace(/\./g, ',');
            const messageRef = ref(db, `users/${emailKey}/messages/${messageId}/isRead`);

            await set(messageRef, true);

            // عرض رسالة تأكيد مناسبة
            this.showSuccess('تم تعليم الرسالة كمقروءة', 'Message marked as read');

        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    }

    // تعليم جميع الرسائل كمقروءة
    async markAllMessagesAsRead() {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const emailKey = user.email.replace(/\./g, ',');
            const messagesRef = ref(db, `users/${emailKey}/messages`);

            const snapshot = await get(messagesRef);
            const messages = snapshot.val();

            if (messages) {
                const updates = {};
                Object.keys(messages).forEach(messageId => {
                    updates[`${messageId}/isRead`] = true;
                });

                await update(messagesRef, updates);
                this.showSuccess('تم تعليم جميع الرسائل كمقروءة', 'All messages marked as read');
            }

        } catch (error) {
            console.error('Error marking all messages as read:', error);
            this.showError('حدث خطأ أثناء تعليم الرسائل', 'Error marking messages as read');
        }
    }

    setupUserActionButtons() {
        // أزرار تعديل المستخدم
        const editButtons = document.querySelectorAll('.edit-user-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const email = button.getAttribute('data-email');
                this.loadUserDataForEdit(email);
            });
        });

        // أزرار إرسال رسالة للمستخدم
        const messageButtons = document.querySelectorAll('.message-user-btn');
        messageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const email = button.getAttribute('data-email');
                this.openSendMessageModal(email);
            });
        });

        // أزرار حذف المستخدم
        const deleteButtons = document.querySelectorAll('.delete-user-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const email = button.getAttribute('data-email');
                this.deleteUser(email);
            });
        });

        // إعداد أزرار التبويبات
        this.setupTabButtons();

        // إعداد أزرار إدارة الإصدارات
        this.setupVersionActionButtons();
    }


    setupTabButtons() {
        // التبديل بين تبويبات لوحة التحكم
        const tabButtons = document.querySelectorAll('[role="tab"]');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة الحالة النشطة من جميع الأزرار
                tabButtons.forEach(btn => {
                    btn.classList.remove('text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400');
                    btn.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                    btn.setAttribute('aria-selected', 'false');
                });

                // إضافة الحالة النشطة للزر المحدد
                button.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                button.classList.add('text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400');
                button.setAttribute('aria-selected', 'true');

                // إخفاء جميع المحتويات
                const tabPanels = document.querySelectorAll('[role="tabpanel"]');
                tabPanels.forEach(panel => {
                    panel.classList.add('hidden');
                });

                // إظهار المحتوى المرتبط بالزر المحدد
                const targetId = button.getAttribute('aria-controls');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.remove('hidden');

                    // تحميل إصدارات القالب عند فتح تبويب الإصدارات
                    if (targetId === 'template-versions' && !targetPanel.querySelector('#versionsTableBody tr')) {
                        this.loadTemplateVersions();
                    }
                }
            });
        });

        // إعداد زر إضافة إصدار جديد
        const addVersionBtn = document.getElementById('addVersionBtn');
        if (addVersionBtn) {
            addVersionBtn.addEventListener('click', () => {
                // إعادة تعيين نموذج إضافة الإصدار
                document.getElementById('newVersionForm').reset();

                // تغيير عنوان المودال إلى إضافة إصدار جديد
                const modalTitle = document.querySelector('#addVersionModal h2');
                if (modalTitle) {
                    modalTitle.setAttribute('data-ar', 'إضافة إصدار جديد');
                    modalTitle.setAttribute('data-en', 'Add New Version');
                    modalTitle.textContent = document.documentElement.getAttribute('data-lang') === 'ar' ? 'إضافة إصدار جديد' : 'Add New Version';
                }

                // إزالة معرف الإصدار من زر الحفظ
                document.getElementById('saveVersionBtn').removeAttribute('data-version-id');

           });
        }

        // إعداد زر حفظ الإصدار
        const saveVersionBtn = document.getElementById('saveVersionBtn');
        if (saveVersionBtn) {
            // إزالة مستمعات الأحداث السابقة لتجنب التكرار
            saveVersionBtn.removeEventListener('click', this.saveTemplateVersion.bind(this));
            saveVersionBtn.addEventListener('click', () => {
                this.saveTemplateVersion();
            });
        }
    }

    setupVersionActionButtons() {

        // أزرار تعديل الإصدار
        const editVersionButtons = document.querySelectorAll('.edit-version-btn');
        editVersionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const versionId = button.getAttribute('data-version-id');
                this.editTemplateVersion(versionId);
            });
        });

        // أزرار حذف الإصدار
        const deleteVersionButtons = document.querySelectorAll('.delete-version-btn');
        deleteVersionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const versionId = button.getAttribute('data-version-id');
                this.deleteTemplateVersion(versionId);
            });
        });
    }

    async loadTemplateVersions() {
        try {
            // الحصول على إصدارات القالب من قاعدة البيانات
            const versionsRef = ref(db, 'templateVersions');
            const versionsSnapshot = await get(versionsRef);

            if (versionsSnapshot.exists()) {
                this.templateVersions = [];
                const versionsData = versionsSnapshot.val();

                // تحويل البيانات إلى مصفوفة
                for (const versionId in versionsData) {
                    this.templateVersions.push({
                        id: versionId,
                        ...versionsData[versionId]
                    });
                }

                // ترتيب الإصدارات حسب رقم الإصدار (تنازلي)
                this.templateVersions.sort((a, b) => {
                    return this.compareVersions(b.versionNumber, a.versionNumber);
                });
            }

            // عرض الإصدارات في الجدول
            this.displayTemplateVersions();

        } catch (error) {
            console.error('Error loading template versions:', error);
            this.showError(
                'حدث خطأ أثناء تحميل إصدارات القالب',
                'Error loading template versions'
            );
        }
    }

    compareVersions(v1, v2) {
        // تقسيم أرقام الإصدار إلى أجزاء (مثال: 1.0.0 -> [1, 0, 0])
        const v1Parts = v1.split('.').map(Number);
        const v2Parts = v2.split('.').map(Number);

        // مقارنة كل جزء
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;

            if (v1Part > v2Part) return 1;
            if (v1Part < v2Part) return -1;
        }

        return 0; // الإصدارات متساوية
    }

    displayTemplateVersions() {
        const versionsTableBody = document.getElementById('versionsTableBody');
        if (!versionsTableBody) return;

        // مسح المحتوى الحالي
        versionsTableBody.innerHTML = '';

        if (this.templateVersions.length === 0) {
            // إذا لم تكن هناك إصدارات، عرض رسالة
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400" data-ar="لا توجد إصدارات متاحة" data-en="No versions available">لا توجد إصدارات متاحة</td>
            `;
            versionsTableBody.appendChild(emptyRow);
            applyLanguageToNewElements(versionsTableBody);
            return;
        }

        // إضافة الإصدارات إلى الجدول
        this.templateVersions.forEach(version => {
            const row = document.createElement('tr');

            // تقصير الوصف إذا كان طويلاً
            let shortDescription = version.description;
            if (shortDescription.length > 50) {
                shortDescription = shortDescription.substring(0, 50) + '...';
            }
            // تقصير الوصف إذا كان طويلاً
            let shortDescriptionEn = version.descriptionEn;
            if (shortDescriptionEn.length > 50) {
                shortDescriptionEn = shortDescriptionEn.substring(0, 50) + '...';
            }

            // تحديد اللغة الحالية
            const currentLang = document.documentElement.getAttribute('data-lang') || 'ar';

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${version.versionNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" data-ar="${version.title}" data-en="${version.titleEn}">${version.title}</td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" data-ar="${shortDescription}" data-en="${shortDescriptionEn}">${shortDescription}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <a href="${version.downloadLink}" target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline" data-ar="رابط التحميل" data-en="Download Link">رابط التحميل</a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button data-bs-toggle="modal" data-bs-target="#addVersionModal" class="edit-version-btn p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400" data-version-id="${version.id}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button class="delete-version-btn p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400" data-version-id="${version.id}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            `;

            versionsTableBody.appendChild(row);
        });

        // تطبيق اللغة على العناصر الجديدة
        applyLanguageToNewElements(versionsTableBody);

        // إعداد أزرار الإجراءات
        this.setupVersionActionButtons();
    }

    async saveTemplateVersion() {
        try {
            // الحصول على بيانات النموذج
            const versionNumber = document.getElementById('versionNumber').value.trim();
            const title = document.getElementById('versionTitle').value.trim();
            const titleEn = document.getElementById('versionTitleEn').value.trim();
            const description = document.getElementById('versionDescription').value.trim();
            const descriptionEn = document.getElementById('versionDescriptionEn').value.trim();
            const downloadLink = document.getElementById('downloadLink').value.trim();

            // التحقق من صحة البيانات
            if (!versionNumber || !title || !titleEn || !description || !descriptionEn || !downloadLink) {
                this.showError(
                    'يرجى ملء جميع الحقول المطلوبة',
                    'Please fill all required fields'
                );
                return;
            }

            // التحقق من صحة رابط التحميل
            try {
                new URL(downloadLink);
            } catch (e) {
                this.showError(
                    'يرجى إدخال رابط تحميل صالح',
                    'Please enter a valid download link'
                );
                return;
            }

            // إنشاء كائن الإصدار
            const versionData = {
                versionNumber,
                title,
                titleEn,
                description,
                descriptionEn,
                downloadLink,
                createdAt: new Date().toISOString()
            };

            // الحصول على معرف الإصدار الحالي (إذا كان موجودًا)
            const currentVersionId = document.getElementById('saveVersionBtn').getAttribute('data-version-id');

            if (currentVersionId) {
                // تحديث إصدار موجود
                await update(ref(db, `templateVersions/${currentVersionId}`), versionData);
                this.showSuccess(
                    'تم تحديث الإصدار بنجاح',
                    'Version updated successfully'
                );
            } else {
                // إضافة إصدار جديد
                const newVersionRef = push(ref(db, 'templateVersions'));
                await set(newVersionRef, versionData);
                this.showSuccess(
                    'تم إضافة الإصدار بنجاح',
                    'Version added successfully'
                );
            }

            // إعادة تعيين معرف الإصدار
            document.getElementById('saveVersionBtn').removeAttribute('data-version-id');

            // إعادة تحميل الإصدارات
            this.loadTemplateVersions();

        } catch (error) {
            console.error('Error saving template version:', error);
            this.showError(
                'حدث خطأ أثناء حفظ الإصدار',
                'Error saving version'
            );
        }
    }

    editTemplateVersion(versionId) {
        // البحث عن الإصدار في المصفوفة
        const version = this.templateVersions.find(v => v.id === versionId);
        if (!version) return;

        // ملء النموذج ببيانات الإصدار
        document.getElementById('versionNumber').value = version.versionNumber || '';
        document.getElementById('versionTitle').value = version.title || '';
        document.getElementById('versionTitleEn').value = version.titleEn || '';
        document.getElementById('versionDescription').value = version.description || '';
        document.getElementById('versionDescriptionEn').value = version.descriptionEn || '';
        document.getElementById('downloadLink').value = version.downloadLink || '';

        // تعيين معرف الإصدار لزر الحفظ
        document.getElementById('saveVersionBtn').setAttribute('data-version-id', versionId);

        // تغيير عنوان المودال
        const modalTitle = document.querySelector('#addVersionModal h2');
        if (modalTitle) {
            modalTitle.setAttribute('data-ar', 'تعديل الإصدار');
            modalTitle.setAttribute('data-en', 'Edit Version');
            modalTitle.textContent = document.documentElement.getAttribute('data-lang') === 'ar' ? 'تعديل الإصدار' : 'Edit Version';
        }

    }

    resetVersionForm() {
        // مسح جميع الحقول
        document.getElementById('versionNumber').value = '';
        document.getElementById('versionTitle').value = '';
        document.getElementById('versionTitleEn').value = '';
        document.getElementById('versionDescription').value = '';
        document.getElementById('versionDescriptionEn').value = '';
        document.getElementById('downloadLink').value = '';

        // إعادة تعيين عنوان المودال
        const modalTitle = document.querySelector('#addVersionModal h2');
        if (modalTitle) {
            modalTitle.setAttribute('data-ar', 'إضافة إصدار جديد');
            modalTitle.setAttribute('data-en', 'Add New Version');
            modalTitle.textContent = document.documentElement.getAttribute('data-lang') === 'ar' ? 'إضافة إصدار جديد' : 'Add New Version';
        }

        // إزالة معرف الإصدار من زر الحفظ
        document.getElementById('saveVersionBtn').removeAttribute('data-version-id');
    }


    async deleteTemplateVersion(versionId) {
        try {
            if (confirm(document.documentElement.getAttribute('data-lang') === 'ar' ? 
                       'هل أنت متأكد من حذف هذا الإصدار؟' : 
                       'Are you sure you want to delete this version?')) {

                // حذف الإصدار من قاعدة البيانات
                await remove(ref(db, `templateVersions/${versionId}`));

                this.showSuccess(
                    'تم حذف الإصدار بنجاح', 
                    'Version deleted successfully'
                );

                // إعادة تحميل الإصدارات
                this.loadTemplateVersions();
            }
        } catch (error) {
            console.error('Error deleting version:', error);
            this.showError(
                'حدث خطأ أثناء حذف الإصدار', 
                'Error deleting version'
            );
        }
    }
}

// Initialize Auth Manager
window.authManager = new AuthManager();