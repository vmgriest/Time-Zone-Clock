// Initialize dayjs with plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');
const currentTimezoneElement = document.getElementById('current-timezone');
const timezoneSelect = document.getElementById('timezone-select');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const modal = document.getElementById('timezone-modal');
const modalOverlay = document.getElementById('modal-overlay');

let selectedTimezone = 'local';

function openModal() {
    console.log('Opening modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    timezoneSelect.value = selectedTimezone;
    
    modal.classList.add('success');
    setTimeout(() => modal.classList.remove('success'), 500);
}

function closeModal() {
    console.log('Closing modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function updateClock() {
    try {
        let now;
        
        if (selectedTimezone === 'local') {
            now = dayjs();
            currentTimezoneElement.innerHTML = `
                <i class="fas fa-location-dot"></i>
                <span>Local Time</span>
            `;
        } else {
            now = dayjs().tz(selectedTimezone);
            const timezoneName = selectedTimezone.split('/').pop().replace(/_/g, ' ');
            const flagEmoji = getTimezoneFlag(selectedTimezone);
            
            currentTimezoneElement.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span>${flagEmoji} ${timezoneName}</span>
            `;
        }
        
        const timeString = now.format('HH:mm:ss');
        currentTimeElement.textContent = timeString;
        
        const dateString = now.format('dddd, MMMM D, YYYY');
        currentDateElement.textContent = dateString;
        
        currentTimeElement.classList.add('success');
        setTimeout(() => currentTimeElement.classList.remove('success'), 300);
        
    } catch (error) {
        console.error('Error updating clock:', error);
        currentTimeElement.textContent = 'Error';
        currentDateElement.textContent = 'Check console for details';
    }
}

function getTimezoneFlag(timezone) {
    const flagMap = {
        'America/': '🇺🇸',
        'Europe/London': '🇬🇧',
        'Europe/Paris': '🇫🇷',
        'Europe/Berlin': '🇩🇪',
        'Asia/Tokyo': '🇯🇵',
        'Asia/Shanghai': '🇨🇳',
        'Asia/Dubai': '🇦🇪',
        'Asia/Kolkata': '🇮🇳',
        'Australia/': '🇦🇺',
        'Pacific/': '🇳🇿',
        'Canada/': '🇨🇦'
    };
    
    for (const [prefix, flag] of Object.entries(flagMap)) {
        if (timezone.startsWith(prefix)) {
            return flag;
        }
    }
    
    return '🌍';
}

function handleTimezoneChange() {
    console.log('Changing timezone to:', timezoneSelect.value);
    selectedTimezone = timezoneSelect.value;
    
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    confirmBtn.disabled = true;
    
    setTimeout(() => {
        updateClock();
        closeModal();
        
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Updated!';
        confirmBtn.classList.add('success');

        setTimeout(() => {
            confirmBtn.innerHTML = '<i class="fas fa-check"></i> Update Timezone';
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('success');
        }, 1500);
        
        showNotification(`Timezone updated to ${selectedTimezone.split('/').pop()}`);
    }, 500);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        z-index: 2000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
confirmBtn.addEventListener('click', handleTimezoneChange);

modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

timezoneSelect.addEventListener('change', function() {
    if (this.value !== selectedTimezone) {
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Update Timezone';
    } else {
        confirmBtn.innerHTML = '<i class="fas fa-times"></i> Keep Current';
    }
});

document.documentElement.style.setProperty('--primary', '#6366f1');
document.documentElement.style.setProperty('--primary-dark', '#4f46e5');
document.documentElement.style.setProperty('--secondary', '#8b5cf6');

updateClock();
const clockInterval = setInterval(updateClock, 1000);

console.log('🎉 World Clock initialized successfully!');
console.log('📅 DayJS version:', dayjs.version);
console.log('🌐 Timezone support:', !!dayjs.tz);
console.log('⏰ Update interval:', clockInterval);