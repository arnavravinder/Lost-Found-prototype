function redirectToApp() {
  window.location.href = "dashboard.html";
}

function register() {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.updateProfile({
      });
    })
    .then(() => {
      const user = firebase.auth().currentUser;
    })
    .then(() => {
      localStorage.setItem('loggedIn', 'true');
      showPopup("Success! Redirecting")
      redirectToApp();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showPopup(errorMessage);
    });
}

function signInWithEmailAndPassword() {
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      showPopup('Success! Redirecting...');
      localStorage.setItem('loggedIn', 'true');
      redirectToApp();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showPopup(errorMessage);
    });
}

function signInWithTwitter() {
  firebase.auth().signInWithPopup(twitterProvider)
    .then((result) => {
      const user = result.user;
      if (result.additionalUserInfo.isNewUser) {
        const displayName = user.displayName;
        const email = user.email;
        // db.collection('users').doc(user.uid).set({
        //   displayName: displayName,
          // email: email,
        // });
      }
      localStorage.setItem('loggedIn', 'true');
      redirectToApp();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showPopup(errorMessage);
    });
}


// gsignin
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      localStorage.setItem('loggedIn', 'true');
      redirectToApp()
    });
}


document.getElementById('forgotPasswordLink').addEventListener('click', forgotPassword);

function showInputPopup() {
  const inputPopup = document.getElementById('inputPopup');
  inputPopup.style.display = 'flex';
}

function hideInputPopup() {
  const inputPopup = document.getElementById('inputPopup');
  inputPopup.style.display = 'none';
}

function forgotPassword() {
  showInputPopup();

  const confirmInput = document.getElementById('input-popup-button');
  const popupInput = document.getElementById('popup-input');
  const popupMessage = document.getElementById('popup-message');

  confirmInput.addEventListener('click', async () => {
    const email = popupInput.value;

    if (email) {
      try {
        // Call the Firebase method to send a password reset email
        await firebase.auth().sendPasswordResetEmail(email);
        showPopup(`A password reset email has been sent to ${email}. Please check your inbox.`);
      } catch (error) {
        const errorMessage = error.message;
        popupMessage.textContent = errorMessage;
      }
    } else {
      popupMessage.textContent = 'Please enter your email address.';
    }

    hideInputPopup();
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');

  forgotPasswordLink.addEventListener('click', () => {
    forgotPassword();
  });
});


function applesoon() {
showPopup("This feature is coming soon!");
}

document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.getItem("loggedIn")) {
    showPopup('You Are Logged In! Redirecting...');
    window.location.href = "dashboard.html";
  }
});
