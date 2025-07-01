const streakGrid = document.getElementById('streakGrid');
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); 
const daysInMonth = new Date(year, month + 1, 0).getDate();
const monthName = document.getElementById('month-name');
const currentMonth = new Date().toLocaleString('default', { month: 'long' });
const hour = new Date().getHours();
const userName = "Batsile"  // Placeholder for user's name, will be dynamically set later
const greetingElement = document.getElementById("greeting");
const input = document.getElementById('search-input');
const label = document.querySelector('.placeholder');



let timeGreeting = "Hello";

if (hour < 12) {
  timeGreeting = "Good morning";
} else if (hour < 17) {
  timeGreeting = "Good afternoon";
} else {
  timeGreeting = "Good evening";
}

if (greetingElement) {
  greetingElement.textContent = `${timeGreeting}, ${userName}`;
}

for (let day = 1; day <= daysInMonth; day++) {
  const box = document.createElement('div');
  box.classList.add('streak-day');
  box.textContent = day; 
  streakGrid.appendChild(box);
}

monthName.textContent = `${currentMonth} Streak`;

input.addEventListener('input', () => {
  if (input.value) {
    label.style.opacity = '0';
    label.style.transform = 'translateY(-150%)';
  } else {
    label.style.opacity = '1';
    label.style.transform = 'translateY(-50%)';
  }
});