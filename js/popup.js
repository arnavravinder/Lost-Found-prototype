function showPopup(message) {
    var popup = document.getElementById('popup');
    var popupMessage = document.getElementById('popup-message');
  
    popupMessage.textContent = message;
    popup.style.display = 'flex';
  }
  
  function hidePopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
  }
    
