// Additional Posts Code Generator
document.addEventListener('DOMContentLoaded', function() {
    const additionalLayouts = document.querySelectorAll('.additional-layout');
    const selectedAdditionalLayoutInput = document.getElementById('selectedAdditionalLayout');
    const additionalPostSource = document.getElementById('additionalPostSource');
    const additionalCustomCategoryContainer = document.getElementById('additionalCustomCategoryContainer');
    const additionalCustomCategory = document.getElementById('additionalCustomCategory');
    const additionalPostCount = document.getElementById('additionalPostCount');
    const generateAdditionalPosts = document.getElementById('generateAdditionalPosts');
    const additionalPostsCodeContainer = document.getElementById('additionalPostsCodeContainer');
    const additionalPostsCode = document.getElementById('additionalPostsCode');
    
    // Create error alert element if it doesn't exist
    let additionalPostsAlert = document.getElementById('additionalPostsAlert');
    if (!additionalPostsAlert) {
        additionalPostsAlert = document.createElement('div');
        additionalPostsAlert.id = 'additionalPostsAlert';
        additionalPostsAlert.className = 'mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm hidden';
        generateAdditionalPosts.parentNode.appendChild(additionalPostsAlert);
    }

    // Handle layout selection
    if (additionalLayouts) {
        additionalLayouts.forEach(layout => {
            layout.addEventListener('click', function() {
                // Remove active class from all layouts
                additionalLayouts.forEach(l => l.classList.remove('ring-2', 'ring-purple-500'));
                // Add active class to selected layout
                this.classList.add('ring-2', 'ring-purple-500');
                // Update input value
                const layoutName = this.getAttribute('data-layout');
                selectedAdditionalLayoutInput.value = layoutName;
                
                // Update post count options based on selected layout
                if (layoutName === 'splide-show') {
                    // For splide-show, minimum is 5
                    if (parseInt(additionalPostCount.value) < 5) {
                        additionalPostCount.value = 5;
                    }
                    // Disable options 1-4 for splide-show
                    for (let i = 0; i < additionalPostCount.options.length; i++) {
                        const option = additionalPostCount.options[i];
                        if (parseInt(option.value) < 5) {
                            option.disabled = true;
                        } else {
                            option.disabled = false;
                        }
                    }
                } else {
                    // For other layouts, enable all options
                    for (let i = 0; i < additionalPostCount.options.length; i++) {
                        additionalPostCount.options[i].disabled = false;
                    }
                }
            });
        });
    }
    
    // Handle post count change validation
    if (additionalPostCount) {
        additionalPostCount.addEventListener('change', function() {
            const selectedLayout = selectedAdditionalLayoutInput.value;
            
            // Ensure minimum value for splide-show layout
            if (selectedLayout === 'splide-show' && parseInt(this.value) < 5) {
                this.value = 5;
            }
        });
    }

    // Show/hide custom category input based on selection
    if (additionalPostSource) {
        additionalPostSource.addEventListener('change', function() {
            if (this.value === 'custom') {
                additionalCustomCategoryContainer.classList.remove('hidden');
            } else {
                additionalCustomCategoryContainer.classList.add('hidden');
            }
        });
    }

    // Generate additional posts code
    if (generateAdditionalPosts) {
        generateAdditionalPosts.addEventListener('click', function() {
            // Hide previous alerts and code
            additionalPostsAlert.classList.add('hidden');
            additionalPostsCodeContainer.classList.add('hidden');

            // Validate inputs
            let isValid = true;
            let messageAr = '';
            let messageEn = '';

            if (!selectedAdditionalLayoutInput.value) {
                isValid = false;
                messageAr = 'يرجى اختيار شكل التدوينات الإضافية.';
                messageEn = 'Please select an additional posts layout.';
            } else if (!additionalPostSource.value) {
                isValid = false;
                messageAr = 'يرجى اختيار مصدر المقالات.';
                messageEn = 'Please select a posts source.';
            } else if (additionalPostSource.value === 'custom' && !additionalCustomCategory.value.trim()) {
                isValid = false;
                messageAr = 'يرجى إدخال اسم القسم المخصص.';
                messageEn = 'Please enter a custom category name.';
            }

            const postCount = parseInt(additionalPostCount.value);
            const selectedLayout = selectedAdditionalLayoutInput.value;
            const minCount = selectedLayout === 'splide-show' ? 5 : 1;
            
            if (isNaN(postCount) || postCount < minCount || postCount > 20) {
                isValid = false;
                if (selectedLayout === 'splide-show') {
                    messageAr = 'يرجى إدخال عدد مقالات صحيح بين 5 و 20 للشكل التاسع.';
                    messageEn = 'Please enter a valid number of posts between 5 and 20 for Layout 9.';
                } else {
                    messageAr = 'يرجى إدخال عدد مقالات صحيح بين 1 و 20.';
                    messageEn = 'Please enter a valid number of posts between 1 and 20.';
                }
            }

            // Show error if validation fails
            if (!isValid) {
                additionalPostsAlert.classList.remove('hidden');
                additionalPostsAlert.textContent = document.documentElement.lang === 'ar' ? messageAr : messageEn;
                additionalPostsAlert.setAttribute('data-ar', messageAr);
                additionalPostsAlert.setAttribute('data-en', messageEn);
                return;
            }
            
            // Hide error message if visible
            additionalPostsAlert.classList.add('hidden');

            // Generate code
            let source = additionalPostSource.value;
            if (source === 'custom') {
                source = additionalCustomCategory.value.trim();
            }

            const layoutType = selectedAdditionalLayoutInput.value;
            const generatedCode = `<i class='posts-from' data-index='1' data-number='${postCount}' data-type='${layoutType}' data-label='${source}'/></i>`;

            // Display the generated code
            additionalPostsCode.textContent = generatedCode;
            additionalPostsCodeContainer.classList.remove('hidden');
        });
    }
});

// Latest Comments Code Generator
document.addEventListener('DOMContentLoaded', function() {
    const commentsCount = document.getElementById('commentsCount');
    const generateCommentsCode = document.getElementById('generateCommentsCode');
    const commentsCodeContainer = document.getElementById('commentsCodeContainer');
    const commentsCode = document.getElementById('commentsCode');
    
    // Create error alert element if it doesn't exist
    let commentsAlert = document.getElementById('commentsAlert');
    if (commentsAlert) {
        commentsAlert.className = 'mb-5 mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm hidden';
    }

    // Generate comments code
    if (generateCommentsCode) {
        generateCommentsCode.addEventListener('click', function() {
            // Hide previous alerts and code
            commentsAlert.classList.add('hidden');
            commentsCodeContainer.classList.add('hidden');

            // Validate inputs
            let isValid = true;
            let messageAr = '';
            let messageEn = '';

            if (!commentsCount.value) {
                isValid = false;
                messageAr = 'يرجى اختيار عدد التعليقات.';
                messageEn = 'Please select number of comments.';
            }

            const count = parseInt(commentsCount.value);
            
            if (isNaN(count) || count < 1 || count > 20) {
                isValid = false;
                messageAr = 'يرجى إدخال عدد تعليقات صحيح بين 1 و 20.';
                messageEn = 'Please enter a valid number of comments between 1 and 20.';
            }

            // Show error if validation fails
            if (!isValid) {
                commentsAlert.classList.remove('hidden');
                commentsAlert.textContent = document.documentElement.lang === 'ar' ? messageAr : messageEn;
                commentsAlert.setAttribute('data-ar', messageAr);
                commentsAlert.setAttribute('data-en', messageEn);
                return;
            }
            
            // Hide error message if visible
            commentsAlert.classList.add('hidden');

            // Generate code
            const generatedCode = `<div class='LastComments' data-num='${count}'></div>`;

            // Display the generated code
            commentsCode.textContent = generatedCode;
            commentsCodeContainer.classList.remove('hidden');
        });
    }
});

// Ad Generator Code Generator
document.addEventListener('DOMContentLoaded', function() {
    const adLocation = document.getElementById('adLocation');
    const adNumber = document.getElementById('adNumber');
    const adNumberContainer = document.getElementById('adNumberContainer');
    const generateAdCode = document.getElementById('generateAdCode');
    const adCodeContainer = document.getElementById('adCodeContainer');
    const adCode = document.getElementById('adCode');
    
    // Create error alert element if it doesn't exist
    let adAlert = document.getElementById('adAlert');
    if (!adAlert) {
        adAlert = document.createElement('div');
        adAlert.id = 'adAlert';
        adAlert.className = 'mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm hidden';
        generateAdCode.parentNode.appendChild(adAlert);
    }

    // Show/hide number selector based on ad location selection
    if (adLocation) {
        adLocation.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue.startsWith('topic-ad-')) {
                adNumberContainer.classList.remove('hidden');
            } else {
                adNumberContainer.classList.add('hidden');
            }
        });
    }

    // Generate ad code
    if (generateAdCode) {
        generateAdCode.addEventListener('click', function() {
            // Hide previous alerts and code
            adAlert.classList.add('hidden');
            adCodeContainer.classList.add('hidden');

            // Validate inputs
            let isValid = true;
            let messageAr = '';
            let messageEn = '';

            if (!adLocation.value) {
                isValid = false;
                messageAr = 'يرجى اختيار موقع الإعلان.';
                messageEn = 'Please select an ad location.';
            }

            const selectedLocation = adLocation.value;
            let generatedCode = '';
            
            // Check if number is required for topic-ad options
            if (selectedLocation.startsWith('topic-ad-')) {
                const number = parseInt(adNumber.value);
                
                if (isNaN(number) || number < 1 || number > 10) {
                    isValid = false;
                    messageAr = 'يرجى اختيار رقم صحيح بين 1 و 10.';
                    messageEn = 'Please select a valid number between 1 and 10.';
                } else {
                    generatedCode = selectedLocation + number;
                }
            } else {
                generatedCode = selectedLocation;
            }

            // Show error if validation fails
            if (!isValid) {
                adAlert.classList.remove('hidden');
                adAlert.textContent = document.documentElement.lang === 'ar' ? messageAr : messageEn;
                adAlert.setAttribute('data-ar', messageAr);
                adAlert.setAttribute('data-en', messageEn);
                return;
            }
            
            // Hide error message if visible
            adAlert.classList.add('hidden');

            // Display the generated code
            adCode.textContent = generatedCode;
            adCodeContainer.classList.remove('hidden');
        });
    }
});

// Highlight active section in table of contents
const sections = document.querySelectorAll('.content-section');
const tocLinks = document.querySelectorAll('.toc-item');

function highlightActiveSection() {
let current = '';
sections.forEach(section => {
const sectionTop = section.offsetTop - 100;
if (window.pageYOffset >= sectionTop) {
current = section.getAttribute('id');
}
});

tocLinks.forEach(link => {
link.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600', 'dark:text-primary-400');
if (link.getAttribute('href') === '#' + current) {
link.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600', 'dark:text-primary-400');
}
});
}
window.addEventListener('scroll', highlightActiveSection);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
highlightActiveSection();
});

// Enhanced Flexible Copy Function for All Devices
function copyToClipboard(elementId, messageId) {
const element = document.getElementById(elementId);
const text = element.innerText || element.textContent;

// Visual selection of the text before copying
if (window.getSelection && document.createRange) {
const selection = window.getSelection();
const range = document.createRange();

// Clear any existing selection
selection.removeAllRanges();

// Select the content of the element
range.selectNodeContents(element);
selection.addRange(range);

// Add visual feedback with highlight effect
element.style.transition = 'background-color 0.3s ease';
element.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';

// Remove selection and highlight after a short delay
setTimeout(() => {
selection.removeAllRanges();
element.style.backgroundColor = '';
}, 500);
}

// For mobile devices and browsers that support clipboard API
if (navigator.clipboard && window.isSecureContext) {
navigator.clipboard.writeText(text).then(() => {
showCopyMessage(messageId);
}).catch(err => {
console.error('Could not copy text: ', err);
// Fallback for clipboard API failure
fallbackCopyTextToClipboard(text, messageId);
});
} else {
// Fallback for browsers without clipboard API support
fallbackCopyTextToClipboard(text, messageId);
}
}

// Fallback copy method for older browsers and mobile devices
function fallbackCopyTextToClipboard(text, messageId) {
// Create temporary textarea element
const textArea = document.createElement('textarea');
textArea.value = text;

// Make the textarea out of viewport
textArea.style.position = 'fixed';
textArea.style.cssText = 'position: fixed; left: -999999px; right: -999999px; top: -999999px;';
textArea.style.top = '-999999px';
document.body.appendChild(textArea);

// Focus and select the text
textArea.focus();
textArea.select();

let success = false;
try {
// Execute the copy command
success = document.execCommand('copy');
} catch (err) {
console.error('Fallback: Oops, unable to copy', err);
}

// Remove the temporary element
document.body.removeChild(textArea);

if (success) {
showCopyMessage(messageId);
}
}

// Enhanced floating notification for copy success with toast animation only
function showCopyMessage(messageId) {
// Hide the original message element completely
const originalMessage = document.getElementById(messageId);
if (originalMessage) {
originalMessage.classList.add('hidden');
}

// Check if floating notification container exists, if not create it
let notificationContainer = document.getElementById('floatingNotifications');
if (!notificationContainer) {
notificationContainer = document.createElement('div');
notificationContainer.id = 'floatingNotifications';
notificationContainer.className = 'fixed bottom-5 ltr:right-5 rtl:left-5 z-[9999] flex flex-col gap-2.5 max-h-[80vh] overflow-hidden';
document.body.appendChild(notificationContainer);
}

// Create a new toast notification
const notification = document.createElement('div');
notification.className = 'toast-notification';

// Set toast notification content and style with improved design
notification.innerHTML = `
<div class="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
px-5 py-3 rounded-xl shadow-xl border border-blue-400">
<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<span class="font-medium" data-ar="تم نسخ الكود بنجاح!" data-en="Code copied successfully!">${document.documentElement.lang === 'ar' ? 'تم نسخ الكود بنجاح!' : 'Code copied successfully!'}</span>
</div>
`;

// Calculate position based on existing notifications
const existingNotifications = notificationContainer.querySelectorAll('.toast-notification');
const notificationHeight = 60; // Approximate height of notification

// Add to container
notificationContainer.appendChild(notification);

// Animate in with improved smooth effect
notification.style.cssText = 'transform: translateY(20px); opacity: 0; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); margin-top: 10px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);';
setTimeout(() => {
notification.style.transform = 'translateY(0)';
notification.style.opacity = '1';
}, 10);

// Animate out with twist effect
setTimeout(() => {
notification.style.transform = 'translateY(-20px)';
notification.style.opacity = '0';
setTimeout(() => {
notification.remove();
// Remove container if empty
if (notificationContainer.children.length === 0) {
notificationContainer.remove();
} else {
// Reposition remaining notifications
const remainingNotifications = notificationContainer.querySelectorAll('.toast-notification');
remainingNotifications.forEach((toast, index) => {
toast.style.transform = 'translateY(0) rotate(0deg)';
});
}
}, 300);
}, 2000);
}

// Enhanced functionality for all pre and code elements
document.addEventListener('DOMContentLoaded', function() {
// Find all pre and code elements
const codeBlocks = document.querySelectorAll('pre, code');

// Add enhanced functionality to each element
codeBlocks.forEach(block => {
// Set direction to LTR for all pre elements
if (block.tagName.toLowerCase() === 'pre') {
block.style.direction = 'ltr';
block.style.textAlign = 'left'; // لا نحتاج لتغيير هذا لأن كتل الكود يجب أن تكون دائمًا من اليسار إلى اليمين
}

// Add click event to each element
block.addEventListener('click', function(e) {
// Don't copy if clicking on a button inside the pre/code
if (e.target.tagName.toLowerCase() === 'button' || 
e.target.closest('button') || 
e.target.tagName.toLowerCase() === 'svg' || 
e.target.tagName.toLowerCase() === 'path') {
return;
}

// Only proceed if not already selecting text
if (window.getSelection().toString() === '') {
// Select all text in the element
const range = document.createRange();
range.selectNodeContents(this);
const selection = window.getSelection();
selection.removeAllRanges();
selection.addRange(range);

// For pre elements, also copy to clipboard on single click
if (this.tagName.toLowerCase() === 'pre') {
const text = this.innerText || this.textContent;
// Find the closest copy message element
let messageId = 'copyMessage';
const copyButton = this.querySelector('button') || this.nextElementSibling;
if (copyButton && copyButton.id && copyButton.id.startsWith('copy')) {
messageId = copyButton.id.replace('copy', 'copyMessage');
}

// Copy the text
if (navigator.clipboard && window.isSecureContext) {
navigator.clipboard.writeText(text).then(() => {
showCopyMessage(messageId);
}).catch(err => {
console.error('Could not copy text: ', err);
fallbackCopyTextToClipboard(text, messageId);
});
} else {
fallbackCopyTextToClipboard(text, messageId);
}
}
}
});
});

// Add functionality to copy buttons to select code when clicked
const copyButtons = document.querySelectorAll('button[id^="copy"]');
copyButtons.forEach(button => {
button.addEventListener('click', function() {
// Find the associated pre/code element
const preElement = this.closest('.relative')?.querySelector('pre') || 
this.previousElementSibling;

if (preElement) {
// Select all text in the pre element
const range = document.createRange();
range.selectNodeContents(preElement);
const selection = window.getSelection();
selection.removeAllRanges();
selection.addRange(range);
}
});
});
});

// Flexible Code Generator System

// Main Slider Code Generator
document.addEventListener('DOMContentLoaded', function() {
    const sliderPostSource = document.getElementById('sliderPostSource');
    const customCategoryContainer = document.getElementById('customCategoryContainer');
    const customCategory = document.getElementById('customCategory');
    const sliderPostCount = document.getElementById('sliderPostCount');
    const generateMainSliderCode = document.getElementById('generateMainSliderCode');
    const mainSliderCodeContainer = document.getElementById('mainSliderCodeContainer');
    const mainSliderCode = document.getElementById('mainSliderCode');
    
    // Create error alert element if it doesn't exist
    let mainSliderAlert = document.getElementById('mainSliderAlert');
    if (mainSliderAlert) {
        mainSliderAlert.className = 'mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm hidden';
    }

    // Show/hide custom category input based on selection
    if (sliderPostSource) {
        sliderPostSource.addEventListener('change', function() {
            if (this.value === 'custom') {
                customCategoryContainer.classList.remove('hidden');
            } else {
                customCategoryContainer.classList.add('hidden');
            }
        });
    }

    // Generate main slider code
    if (generateMainSliderCode) {
        generateMainSliderCode.addEventListener('click', function() {
            // Hide previous alerts and code
            mainSliderAlert.classList.add('hidden');
            mainSliderCodeContainer.classList.add('hidden');

            // Validate inputs
            let isValid = true;
            let errorMessage = '';

            if (!sliderPostSource.value) {
                isValid = false;
                errorMessage = html.getAttribute('dir') === 'rtl' ? 
                    'يرجى اختيار مصدر المقالات.' : 
                    'Please select a posts source.';
            } else if (sliderPostSource.value === 'custom' && !customCategory.value.trim()) {
                isValid = false;
                errorMessage = html.getAttribute('dir') === 'rtl' ? 
                    'يرجى إدخال اسم القسم المخصص.' : 
                    'Please enter a custom category name.';
            }

            const postCount = parseInt(sliderPostCount.value);
            if (isNaN(postCount) || postCount < 5 || postCount > 15) {
                isValid = false;
                errorMessage = html.getAttribute('dir') === 'rtl' ? 
                    'يرجى إدخال عدد مقالات صحيح بين 5 و 15.' : 
                    'Please enter a valid number of posts between 5 and 15.';
            }

            // Show error if validation fails
            if (!isValid) {
                mainSliderAlert.classList.remove('hidden');
                
                let messageAr = '';
                let messageEn = '';
                
                if (!sliderPostSource.value) {
                    messageAr = 'يرجى اختيار مصدر المقالات.';
                    messageEn = 'Please select a posts source.';
                } else if (sliderPostSource.value === 'custom' && !customCategory.value.trim()) {
                    messageAr = 'يرجى إدخال اسم القسم المخصص.';
                    messageEn = 'Please enter a custom category name.';
                } else {
                    messageAr = 'يرجى إدخال عدد مقالات صحيح بين 5 و 15.';
                    messageEn = 'Please enter a valid number of posts between 5 and 15.';
                }
                
                mainSliderAlert.textContent = document.documentElement.lang === 'ar' ? messageAr : messageEn;
                mainSliderAlert.setAttribute('data-ar', messageAr);
                mainSliderAlert.setAttribute('data-en', messageEn);
                return;
            }
            
            // Hide error message if visible
            mainSliderAlert.classList.add('hidden');

            // Generate code
            let source = sliderPostSource.value;
            if (source === 'custom') {
                source = customCategory.value.trim();
            }

            const generatedCode = `<i class='posts-from' data-index='1' data-number='${postCount}' data-type='slider' data-label='${source}'/></i>`;

            // Display the generated code
            mainSliderCode.textContent = generatedCode;
            mainSliderCodeContainer.classList.remove('hidden');
        });
    }
});

class CodeGenerator {
constructor(options) {
this.options = Object.assign({
// Default options
generatorId: '',                 // ID of the generator button
inputFields: [],                 // Array of input field IDs and their labels
outputContainerId: '',           // ID of the container to show/hide
outputElementId: '',            // ID of the element to put generated code
copyButtonId: '',               // ID of the copy button
copyMessageId: '',              // ID of the copy success message
alertId: 'fieldsAlert',         // ID for the alert element
generateTemplate: () => '',     // Function that returns the generated code
onBeforeGenerate: () => true,   // Hook before generation
onAfterGenerate: () => {}       // Hook after generation
}, options);

this.init();
}

init() {
const generatorButton = document.getElementById(this.options.generatorId);
if (!generatorButton) return;

generatorButton.addEventListener('click', () => this.generateCode());

// Set up copy button if provided
if (this.options.copyButtonId) {
const copyButton = document.getElementById(this.options.copyButtonId);
if (copyButton) {
copyButton.addEventListener('click', () => {
copyToClipboard(this.options.outputElementId, this.options.copyMessageId);
});
}
}
}

getInputValues() {
const values = {};
const emptyFieldsAr = [];
const emptyFieldsEn = [];

this.options.inputFields.forEach(field => {
const input = document.getElementById(field.id);
if (!input) return;

const value = input.value.trim();
values[field.id] = value;

// Validate if field is required
if (field.required !== false && !value) {
emptyFieldsAr.push(field.labelAr);
emptyFieldsEn.push(field.labelEn);
input.classList.add('border-red-500');
} else {
input.classList.remove('border-red-500');
}
});

return { values, emptyFieldsAr, emptyFieldsEn };
}

showAlert(emptyFieldsAr, emptyFieldsEn) {
// Create or update alert element
let alertElement = document.getElementById(this.options.alertId);
if (!alertElement) {
alertElement = document.createElement('div');
alertElement.id = this.options.alertId;
alertElement.className = 'mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm';
document.getElementById(this.options.generatorId).parentNode.appendChild(alertElement);
}

// Update alert text
const fieldsListAr = emptyFieldsAr.join('، ');
const fieldsListEn = emptyFieldsEn.join(', ');
alertElement.textContent = document.documentElement.lang === 'ar' ? `يرجى ملء الحقول التالية: ${fieldsListAr}` : `Please fill in the following fields: ${fieldsListEn}`;
alertElement.setAttribute('data-ar', `يرجى ملء الحقول التالية: ${fieldsListAr}`);
alertElement.setAttribute('data-en', `Please fill in the following fields: ${fieldsListEn}`);

// Hide output container if visible
if (this.options.outputContainerId) {
const container = document.getElementById(this.options.outputContainerId);
if (container) container.classList.add('hidden');
}
}

removeAlert() {
const alertElement = document.getElementById(this.options.alertId);
if (alertElement) alertElement.remove();
}

generateCode() {
// Get input values and validate
const { values, emptyFieldsAr, emptyFieldsEn } = this.getInputValues();

// Show alert if there are empty required fields
if (emptyFieldsAr.length > 0) {
this.showAlert(emptyFieldsAr, emptyFieldsEn);
return;
}

// Remove alert if exists
this.removeAlert();

// Run before generate hook
if (this.options.onBeforeGenerate && !this.options.onBeforeGenerate(values)) {
return;
}

// Generate code using template function
const generatedCode = this.options.generateTemplate(values);

// Update output element
const outputElement = document.getElementById(this.options.outputElementId);
if (outputElement) outputElement.textContent = generatedCode;

// Show output container
if (this.options.outputContainerId) {
const container = document.getElementById(this.options.outputContainerId);
if (container) container.classList.remove('hidden');
}

// Run after generate hook
if (this.options.onAfterGenerate) {
this.options.onAfterGenerate(values, generatedCode);
}
}
}

// Accordion functionality for customization section
function toggleAccordion(button) {
const content = button.nextElementSibling;
const icon = button.querySelector('.accordion-icon');

// Toggle content visibility
if (content.classList.contains('hidden')) {
content.classList.remove('hidden');
if(icon){icon.style.transform = 'rotate(180deg)';}
} else {
content.classList.add('hidden');
if(icon){icon.style.transform = 'rotate(0)';}
}
}

// Initialize Meta Code Generator
// Meta Code Generator
const metaCodeGenerator = new CodeGenerator({
generatorId: 'generateMetaCode',
inputFields: [
{ id: 'fbAppId', labelAr: 'معرف تطبيق الفيس بوك', labelEn: 'Facebook App ID', required: true },
{ id: 'twitterSite', labelAr: 'معرف صفحة تويتر', labelEn: 'Twitter Site ID', required: true },
{ id: 'twitterCreator', labelAr: 'معرف حساب الادمن على تويتر', labelEn: 'Twitter Creator ID', required: true }
],
outputContainerId: 'metaCodeContainer',
outputElementId: 'metaCodeOutput',
copyButtonId: 'copyMetaCode',
copyMessageId: 'copyMetaMessage',
generateTemplate: (values) => {
return `    <!-- Required -->
<meta content='${values.fbAppId}' property='fb:app_id'/>
<meta content='${values.twitterSite}' name='twitter:site'/>
<meta content='${values.twitterCreator}' name='twitter:creator'/>`;
}
});

document.addEventListener('DOMContentLoaded', function() {
// Select elements
const layouts = document.querySelectorAll('.mega-layout');
const selectedLayoutInput = document.getElementById('selectedLayout');
const postsSourceInput = document.getElementById('postsSource');
const generateButton = document.getElementById('generateMegaMenu');
const codeDisplay = document.getElementById('generatedMegaMenuCode');
const codeOutput = document.getElementById('megaMenuCodeOutput');
const copyButton = document.getElementById('copyMegaMenuCode');

// Add click event to layouts
layouts.forEach(layout => {
layout.addEventListener('click', function() {
// Remove active class from all layouts
layouts.forEach(l => l.classList.remove('ring-2', 'ring-purple-500'));
// Add active class to clicked layout
this.classList.add('ring-2', 'ring-purple-500');
// Set selected layout value
selectedLayoutInput.value = this.getAttribute('data-layout');
});
});

// Create error alert element if it doesn't exist
let megaMenuAlert = document.getElementById('megaMenuAlert');
if (!megaMenuAlert) {
  megaMenuAlert = document.createElement('div');
  megaMenuAlert.id = 'megaMenuAlert';
  megaMenuAlert.className = 'mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm hidden';
  generateButton.parentNode.appendChild(megaMenuAlert);
}

// Generate code button click event
generateButton.addEventListener('click', function() {
const selectedLayout = selectedLayoutInput.value;
const postsSource = postsSourceInput.value;

// Validate inputs
if (!selectedLayout || !postsSource) {
  // Show error message
  megaMenuAlert.classList.remove('hidden');
  
  let messageAr = '';
  let messageEn = '';
  
  if (!selectedLayout && !postsSource) {
    messageAr = 'الرجاء اختيار شكل للميجا مينيو وإدخال مصدر التدوينات';
    messageEn = 'Please select a Mega Menu style and enter posts source';
  } else if (!selectedLayout) {
    messageAr = 'الرجاء اختيار شكل للميجا مينيو';
    messageEn = 'Please select a Mega Menu style';
  } else {
    messageAr = 'الرجاء إدخال مصدر التدوينات';
    messageEn = 'Please enter posts source';
  }
  
  megaMenuAlert.textContent = document.documentElement.lang === 'ar' ? messageAr : messageEn;
  megaMenuAlert.setAttribute('data-ar', messageAr);
  megaMenuAlert.setAttribute('data-en', messageEn);
  
  // Hide code display if visible
  codeDisplay.classList.add('hidden');
  return;
}

// Hide error message if visible
megaMenuAlert.classList.add('hidden');

// Generate code using CodeGenerator function
const generatedCode = CodeGenerator({mgstyle: selectedLayout,mglabel: postsSource});

// Display generated code
codeOutput.textContent = JSON.stringify({mgstyle: selectedLayout,mglabel: postsSource}, null, 2);

// Show code display
codeDisplay.classList.remove('hidden');
});

// Copy button click event
copyButton.addEventListener('click', function() {
copyToClipboard('megaMenuCodeOutput', 'copy-message');
});

// Mock CodeGenerator function (replace with actual implementation)
function CodeGenerator(params) {
return params;
}
});

    // Comments System Generator
    document.addEventListener('DOMContentLoaded', () => {
        const commentsGenSystemType = document.getElementById('commentsGenSystemType');
        const commentsGenOrderContainer = document.getElementById('commentsGenOrderContainer');
        const commentsGenOrder = document.getElementById('commentsGenOrder');
        const commentsGenInputFields = document.getElementById('commentsGenInputFields');
        const generateCommentsGenSystem = document.getElementById('generateCommentsGenSystem');
        const commentsGenCodeContainer = document.getElementById('commentsGenCodeContainer');
        const commentsGenCode = document.getElementById('commentsGenCode');
        const commentsGenErrorAlert = document.getElementById('commentsGenErrorAlert');
        const commentsGenErrorText = document.getElementById('commentsGenErrorText');

        function generateRandomOrders(options) {
            const permutations = [];
            const generatePermutations = (arr, n) => {
                if (n === 1) {
                    permutations.push([...arr]);
                    return;
                }
                for (let i = 0; i < n; i++) {
                    generatePermutations(arr, n - 1);
                    const j = n % 2 === 0 ? i : 0;
                    [arr[n - 1], arr[j]] = [arr[j], arr[n - 1]];
                }
            };
            generatePermutations(options, options.length);
            return permutations.map(order => order.join('-'));
        }

        function showError(message) {
            commentsGenErrorText.textContent = message;
            commentsGenErrorAlert.classList.remove('hidden');
        }

        function hideError() {
            commentsGenErrorAlert.classList.add('hidden');
        }

        commentsGenSystemType.addEventListener('change', function() {
            const selectedValue = this.value;
            const options = selectedValue.split('-');
            
            // Clear previous inputs
            commentsGenInputFields.innerHTML = '';
            commentsGenOrderContainer.classList.add('hidden');
            commentsGenOrder.innerHTML = '<option value="" data-ar="اختر الترتيب..." data-en="Select order..." class="text-gray-500 dark:text-gray-400">اختر الترتيب...</option>';
            
            if (options.length > 1) {
                const orders = generateRandomOrders(options);
                orders.forEach(order => {
                    const option = document.createElement('option');
                    option.value = order;
                    option.textContent = order;
                    option.className = 'text-gray-900 dark:text-gray-100';
                    commentsGenOrder.appendChild(option);
                });
                commentsGenOrderContainer.classList.remove('hidden');
            }

            // Add input fields based on selected systems
            if (selectedValue.includes('facebook')) {
                const facebookDiv = document.createElement('div');
                facebookDiv.innerHTML = `
                    <label for="commentsGenFacebookId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" data-ar="معرف Facebook:" data-en="Facebook ID:">معرف Facebook:</label>
                    <input type="text" id="commentsGenFacebookId" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-primary-500 dark:focus:border-primary-600 text-gray-900 dark:text-gray-100 transition-colors" data-ar-placeholder="أدخل معرف Facebook" data-en-placeholder="Enter your Facebook ID" placeholder="أدخل معرف Facebook">
                `;
                commentsGenInputFields.appendChild(facebookDiv);
            }
            
            if (selectedValue.includes('disqus')) {
                const disqusDiv = document.createElement('div');
                disqusDiv.innerHTML = `
                    <label for="commentsGenDisqusId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" data-ar="معرف Disqus:" data-en="Disqus ID:">معرف Disqus:</label>
                    <input type="text" id="commentsGenDisqusId" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-primary-500 dark:focus:border-primary-600 text-gray-900 dark:text-gray-100 transition-colors" data-ar-placeholder="أدخل معرف Disqus" data-en-placeholder="Enter your Disqus ID" placeholder="أدخل معرف Disqus">
                `;
                commentsGenInputFields.appendChild(disqusDiv);
            }
        });

        generateCommentsGenSystem.addEventListener('click', function() {
            hideError();
            
            const selectedValue = commentsGenSystemType.value;
            const selectedOrder = commentsGenOrder.value || selectedValue;
            const facebookIdEl = document.getElementById('commentsGenFacebookId');
            const disqusIdEl = document.getElementById('commentsGenDisqusId');
            const facebookId = facebookIdEl ? facebookIdEl.value.trim() : '';
            const disqusId = disqusIdEl ? disqusIdEl.value.trim() : '';
            
            // Validation
            if (!selectedValue) {
                showError('برجاء اختيار نوع نظام التعليقات');
                return;
            }
            
            if (selectedOrder && 
                ((selectedOrder.includes('facebook') && facebookId === '') || 
                 (selectedOrder.includes('disqus') && disqusId === ''))) {
                showError('برجاء ملء جميع الحقول المطلوبة');
                return;
            }
            
            // Generate code
            let generatedCode = selectedOrder;
            if (selectedOrder.includes('facebook') && facebookId) {
                generatedCode = generatedCode.replace('facebook', `facebook[${facebookId}]`);
            }
            if (selectedOrder.includes('disqus') && disqusId) {
                generatedCode = generatedCode.replace('disqus', `disqus[${disqusId}]`);
            }
            
            commentsGenCode.textContent = generatedCode;
            commentsGenCodeContainer.classList.remove('hidden');
        });
    });

// Video Code Generator
document.addEventListener('DOMContentLoaded', function() {
    const videoSource = document.getElementById('videoSource');
    const generateVideoCode = document.getElementById('generateVideoCode');
    const videoCodeContainer = document.getElementById('videoCodeContainer');
    const videoCode = document.getElementById('videoCode');
    
    // Create error alert element if it doesn't exist
    let videoAlert = document.getElementById('videoAlert');
    if (videoAlert) {
        videoAlert.className = 'mb-5 mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm hidden';
    }

    // Generate video code
    if (generateVideoCode) {
        generateVideoCode.addEventListener('click', function() {
            // Hide previous alerts and code
            videoAlert.classList.add('hidden');
            videoCodeContainer.classList.add('hidden');

            // Validate inputs
            let isValid = true;
            let messageAr = '';
            let messageEn = '';

            if (!videoSource.value.trim()) {
                isValid = false;
                messageAr = 'يرجى إدخال كود الفيديو.';
                messageEn = 'Please enter the video code.';
            }

            // Show error if validation fails
            if (!isValid) {
                videoAlert.classList.remove('hidden');
                videoAlert.textContent = document.documentElement.lang === 'ar' ? messageAr : messageEn;
                videoAlert.setAttribute('data-ar', messageAr);
                videoAlert.setAttribute('data-en', messageEn);
                return;
            }
            
            // Hide error message if visible
            videoAlert.classList.add('hidden');

            // Generate code
            const generatedCode = `<!--video${videoSource.value.trim()}-->`;

            // Display the generated code
            videoCode.textContent = generatedCode;
            videoCodeContainer.classList.remove('hidden');
        });
    }
});
