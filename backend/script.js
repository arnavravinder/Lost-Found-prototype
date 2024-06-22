var firebaseConfig = {
    // Your Firebase configuration
};

firebase.initializeApp(firebaseConfig);

const chatGPT = new OpenAI.ChatCompletion({
    model: "gpt-3.5-turbo",
    apiKey: "YOUR_OPENAI_API_KEY"
});

const itemTypeSelect = document.getElementById('item-type');
const othersOption = document.getElementById('others-option');

itemTypeSelect.addEventListener('change', function() {
    if (itemTypeSelect.value === 'others') {
        othersOption.style.display = 'block';
    } else {
        othersOption.style.display = 'none';
    }
});

document.getElementById("addItemForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var itemName = document.getElementById("item-name").value;
    var description = document.getElementById("description").value;
    var itemType = document.getElementById("item-type").value;
    var othersInput = document.getElementById("others-input").value;

    chatGPT.complete(description, { max_tokens: 150 })
        .then((response) => {
            const enlargedDescription = response.data.choices[0].text.trim();

            var database = firebase.database();
            var storage = firebase.storage();
            var storageRef = storage.ref();
            var fileInput = document.getElementById("image-file");

            if (fileInput.files[0]) {
                var imageFile = fileInput.files[0];
                var imageId = Date.now().toString();
                var imageRef = storageRef.child("images/" + imageId);

                imageRef.put(imageFile).then(function(snapshot) {
                    return snapshot.ref.getDownloadURL();
                }).then(function(downloadURL) {
                    var postData = {
                        itemName: itemName,
                        description: enlargedDescription,
                        itemType: itemType === "others" ? othersInput : itemType,
                        dateAdded: new Date().toISOString(),
                        found: true,
                        imageUrl: downloadURL
                    };

                    var newPostRef = database.ref("lostItems").push();
                    newPostRef.set(postData)
                        .then(function() {
                            alert("Item added successfully!");
                            document.getElementById("addItemForm").reset();
                        })
                        .catch(function(error) {
                            console.error("Error adding item:", error);
                            alert("An error occurred while adding the item. Please try again.");
                        });
                }).catch(function(error) {
                    console.error("Error uploading image:", error);
                    alert("An error occurred while uploading the image. Please try again.");
                });
            } else {
                alert("Please select an image file.");
            }
        })
        .catch((error) => {
            console.error("Error expanding description:", error);
            alert("An error occurred while expanding the description. Please try again.");
        });
});
