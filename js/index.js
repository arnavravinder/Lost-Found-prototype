const form = document.getElementById("contact-form");
      
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  try {
    await fetch("https://formspree.io/f/myyqyqok", {
      method: "POST",
      body: JSON.stringify(formObject),
      headers: {
        "Content-Type": "application/json"
      }
    });
    showPopup('Form Submitted Successfully');
    form.reset();
  } catch (error) {
    console.error('Error submitting form:', error);
    showPopup('Error Submitting Form');
  }
});

document.getElementById("navigation-hide-button").addEventListener("click", function() {
    let navigateItems = document.querySelectorAll(".navigate-items-mobile");
    navigateItems.forEach(function(item) {
        item.classList.toggle("hidden");
    });

    let hideButton = document.getElementById("navigation-hide-button");
    hideButton.classList.toggle("navigation-button-highlight");
});
const userChevrons = document.querySelectorAll('.user-chevron');
    const userSettingsNavBar = document.querySelector('.user-settings-nav-bar');

    userChevrons.forEach(chevron => {
    chevron.addEventListener('click', () => {
        chevron.classList.toggle('rotated');
        userSettingsNavBar.classList.toggle('hidden');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const box = document.querySelector('.box');
    const navBar = document.querySelector('.nav-bar');
    const closeNavBarIcon = document.querySelector('.close-nav-bar-icon');

    box.addEventListener('click', function() {
        navBar.classList.add('nav-bar-visible');
        box.classList.add('box-hidden');
    });

    closeNavBarIcon.addEventListener('click', function() {
        navBar.classList.remove('nav-bar-visible');
        box.classList.remove('box-hidden');
    });
});
