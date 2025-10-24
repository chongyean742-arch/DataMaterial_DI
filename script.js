document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------------------------
    // !! សំខាន់ !!
    // បិទភ្ជាប់ (Paste) Web App URL របស់អ្នកនៅទីនេះ
    // -----------------------------------------------------------------
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCWaUspcXIf91oJCOjEMYSDnidnlAUnw2CjjKxbeRnsL7owWuGy6OGeAD378QWEeTe/exec';
    // -----------------------------------------------------------------


    const loader = document.getElementById('loader-container');
    const dashboard = document.getElementById('dashboard-grid');

    /**
     * ✅ កូដកែតម្រូវ និងកែលម្អ (Fixed and Improved Function)
     * អនុគមន៍នេះដោះស្រាយបញ្ហាពេលតម្លៃស្មើ 0 
     * និងធ្វើឱ្យ Animation រលូនជាងមុន
     */
    function animateCountUp(element, endValue) {
        // បើទិន្នន័យស្មើ 0, បង្ហាញ 0 ភ្លាម ហើយចេញ
        if (endValue === 0) {
            element.textContent = 0;
            return;
        }

        const duration = 1500; // 1.5 វិនាទី
        const startTime = Date.now();

        function update() {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;

            if (elapsedTime >= duration) {
                // Animation បញ្ចប់, ដាក់តម្លៃចុងក្រោយ
                element.textContent = endValue;
                return;
            }

            // គណនាតម្លៃបច្ចុប្បន្ន
            const progress = elapsedTime / duration;
            const currentValue = Math.floor(progress * endValue);

            element.textContent = currentValue;
            
            // បន្ត animation
            requestAnimationFrame(update);
        }

        // ចាប់ផ្តើម animation
        requestAnimationFrame(update);
    }
    
    // អនុគមន៍សម្រាប់ Update តម្លៃនៅក្នុង Card
    function updateCategory(categoryPrefix, categoryData) {
        for (const itemKey in categoryData) {
            const elementId = `${categoryPrefix}-${itemKey}`;
            const element = document.getElementById(elementId);
            
            if (element) {
                // ប្រើ parseInt និង || 0 ដើម្បីធានាថាវាជាលេខ
                const value = parseInt(categoryData[itemKey], 10) || 0; 
                animateCountUp(element, value); // ហៅអនុគមន៍ Animation ថ្មី
            } else {
                console.warn(`Element with ID "${elementId}" not found.`);
            }
        }
    }

    // ចាប់ផ្តើមទាញទិន្នន័យ
    fetch(SCRIPT_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(`Apps Script Error: ${data.error}`);
            }

            // លាក់ Loader និងបង្ហាញ Dashboard
            loader.classList.add('hidden');
            dashboard.classList.remove('hidden');

            // បញ្ជូនទិន្នន័យទៅអនុគមន៍នីមួយៗ
            updateCategory('total', data.total);
            updateCategory('damaged', data.damaged);
            updateCategory('repairing', data.repairing);
            updateCategory('in_use', data.in_use);
            updateCategory('unused', data.unused);
            updateCategory('removed', data.removed);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loader.innerHTML = `<p style="color: red;">Error: ${error.message}<br>សូមពិនិត្យ SCRIPT_URL នៅក្នុង script.js និងការអនុញ្ញាត (Permissions) របស់អ្នក។</p>`;
        });
});
