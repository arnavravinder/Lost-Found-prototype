// Firebase configuration
var firebaseConfig = {
    // Your Firebase project configuration
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize ChatGPT
const chatGPT = new OpenAI.ChatCompletion({
    model: "gpt-3.5-turbo",
    apiKey: "YOUR_OPENAI_API_KEY"
});

// DOM elements
const addItemForm = document.getElementById("addItemForm");
const itemNameInput = document.getElementById("item-name");
const descriptionTextarea = document.getElementById("description");
const itemTypeSelect = document.getElementById("item-type");
const othersOption = document.getElementById("others-option");
const othersInput = document.getElementById("others-input");
const imageFileInput = document.getElementById("image-file");

// Show/hide 'Others' input based on item type selection
itemTypeSelect.addEventListener('change', function() {
    if (itemTypeSelect.value === 'others') {
        othersOption.style.display = 'block';
    } else {
        othersOption.style.display = 'none';
    }
});

// Form submission handling
addItemForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const itemName = itemNameInput.value.trim();
    const description = descriptionTextarea.value.trim();
    const itemType = itemTypeSelect.value;
    const specifiedType = (itemType === 'others') ? othersInput.value.trim() : itemType;

    // Enlarge description using ChatGPT
    chatGPT.complete(description, { max_tokens: 150 })
        .then((response) => {
            const enlargedDescription = response.data.choices[0].text.trim();

            // Firebase references
            const database = firebase.database();
            const storage = firebase.storage();
            const storageRef = storage.ref();
            const imageFile = imageFileInput.files[0];

            if (!imageFile) {
                alert("Please select an image file.");
                return;
            }

            // Upload image to Firebase Storage
            const imageId = Date.now().toString();
            const imageRef = storageRef.child("images/" + imageId);

            imageRef.put(imageFile)
                .then((snapshot) => snapshot.ref.getDownloadURL())
                .then((downloadURL) => {
                    // Prepare data for database
                    const postData = {
                        itemName: itemName,
                        description: enlargedDescription,
                        itemType: specifiedType,
                        dateAdded: new Date().toISOString(),
                        found: true,
                        imageUrl: downloadURL
                    };

                    // Save data to Firebase Database
                    database.ref("lostItems").push(postData)
                        .then(() => {
                            alert("Item added successfully!");
                            addItemForm.reset();
                        })
                        .catch((error) => {
                            console.error("Error adding item:", error);
                            alert("An error occurred while adding the item. Please try again.");
                        });
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                    alert("An error occurred while uploading the image. Please try again.");
                });
        })
        .catch((error) => {
            console.error("Error expanding description:", error);
            alert("An error occurred while expanding the description. Please try again.");
        });
});
