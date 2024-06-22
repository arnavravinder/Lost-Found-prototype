// Function to show the popup
function showInputPopup(message, callback) {
  const popupContainer = document.getElementById('inputPopup');
  const popupMessage = document.getElementById('popupMessagei');
  const popupInput = document.getElementById('popupInput');
  const popupSubmit = document.getElementById('popupSubmit');

  popupMessage.textContent = message;
  popupInput.value = '';

  popupSubmit.onclick = () => {
    const inputValue = popupInput.value;
    hideInputPopup();
    if (callback) {
      callback(inputValue);
    }
  };

  popupContainer.style.display = 'flex';
}

// Function to hide the popup
function hideInputPopup() {
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.style.display = 'none';
}

// Function to show input popup
function showInputPopup(message, callback) {
  showPopup(message, callback);
}

// Function to handle the getCurrentUserDisplayName logic
function getCurrentUserDisplayName() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;
      db.collection('users').doc(userId).get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const displayName = userData.name;
            const username = userData.name;
            console.log(username);
            document.getElementById('profileName').textContent = displayName;
            document.getElementById('displayName').textContent = displayName;
          } else {
            showInputPopup("Please enter your name:", (name) => {
              if (name && name.trim() !== "") {
                saveUserName(userId, name);
                document.getElementById('displayName').textContent = name;
                document.getElementById('profileName').textContent = name;

              }

            });
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    } else {
      // User not signed in, handle this if needed
      console.log("User not signed in!");
    }
  });
}

  // Function to save the user's name to Firestore
  function saveUserName(userId, name) {
    db.collection('users').doc(userId).set({
      name: name
    })
    .then(() => {
      // Name saved successfully
      console.log("Name saved successfully!");
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
  }
  
  getCurrentUserDisplayName();
  
    
  
      // Add an event listener to the button with id "navigation-hide-button"
      document.getElementById("navigation-hide-button").addEventListener("click", function() {
        // Get all elements with class "navigate-items-mobile"
        let navigateItems = document.querySelectorAll(".navigate-items-mobile");
        // Loop through each element and toggle the "hidden" class
        navigateItems.forEach(function(item) {
            item.classList.toggle("hidden");
        });
    
        // Toggle the "navigation-button-highlight" class on the button
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
  
  document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("loggedIn")) {
        // User is logged in
        document.querySelectorAll(".navigation, .hello-user, .contact-us-form").forEach(item => {
            item.classList.remove("blur");
        });
        
        document.querySelector("body").removeAttribute("id");
        
        document.querySelector(".hidden-pop-up").classList.add("hidden")
    } else {
        // User is not logged in
        document.querySelectorAll(".navigation, .hello-user, .contact-us-form").forEach(item => {
            item.classList.add("blur");
        });
        
        document.querySelector("body").setAttribute("id", "body-close");
        
        document.querySelector(".hidden-pop-up").classList.remove("hidden")
    }
  });
  
  var maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() - 3);
  
  document.addEventListener("DOMContentLoaded", function() {
      flatpickr("#date-lost", {
          dateFormat: "d-m-Y", 
          theme: "dark",
          disableMobile: "true",
          allowInput: true,
          maxDate: "today", 
          minDate: maxDate,
          
          onValueUpdate: function(selectedDates, dateStr, instance) {
              document.getElementById("date-lost-label").value = dateStr;
          }
      });
  });
  
  document.getElementById("searchForm").addEventListener("submit", function(event) {
      event.preventDefault();
  
      var searchQuery = document.getElementById("item-name").value;
      var inputDateStr = document.getElementById("date-lost").value;
  
      // Transform input date format from "DD-MM-YYYY" to "YYYY-MM-DD"
      var parts = inputDateStr.split("-");
      var transformedDateStr = parts[2] + "-" + parts[1] + "-" + parts[0];
  
      // Create a new Date object from the transformed input date string
      var inputDate = new Date(transformedDateStr);
  
      // Check if inputDate is a valid date
      if (isNaN(inputDate)) {
          showPopup("Invalid input date");
          return;
      }
  
      // Calculate the start and end dates of the two-week period
      var startDate = new Date(inputDate);
      startDate.setDate(inputDate.getDate() - 14); // Two weeks before input date
  
      var endDate = new Date(inputDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of the day
  
      // Function to search items within the specified date range
      function searchItemsWithDateRange(query, startDate, endDate) {
          query = query.toLowerCase();
  
          var database = firebase.database();
  
          var searchResults = [];
  
          // Perform the search
          database.ref("lostItems").once("value")
              .then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {
                      var itemData = childSnapshot.val();
                      var itemDate = new Date(itemData.dateAdded);
  
                      // Check if itemDate is within the date range
                      if (itemDate >= startDate && itemDate <= endDate) {
                          if (
                              itemData.itemName.toLowerCase().includes(query) ||
                              itemData.description.toLowerCase().includes(query)
                          ) {
                              searchResults.push(itemData);
                          }
                      }
                  });
  
                  // Save to local storage
                  localStorage.setItem("searchResults", JSON.stringify(searchResults));
                  if (searchResults.length > 0) {
                      window.location.href = "results.html";
                  } else {
                      window.location.href = "results.html";
                  }
              })
              .catch(function(error) {
                  console.error("Error searching for items:", error);
              });
      }
  
// search date range. for normal, remove startDate and endDate
      searchItemsWithDateRange(searchQuery, startDate, endDate);
  });
  
  
  function dateWeeksAgo(weeks) {
      const today = new Date();
      const weeksAgo = new Date(today.getTime() - (weeks * 7 * 24 * 60 * 60 * 1000));
      return weeksAgo.toISOString();
  }
  
  function signOut() {
      firebase.auth().signOut().then(function() {
          localStorage.removeItem('loggedIn');
          window.location.href = "index.html"; 
      }).catch(function(error) {
          console.log(error);
      });
          }