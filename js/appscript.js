function extractValueFromBody(label, body) {
    if (!body) {
      Logger.log("Error: Email body is undefined.");
      return "";
    }
  
    var htmlBody = body.indexOf("<html>") !== -1;
  
    if (htmlBody) {
      var startIndex = body.indexOf(label);
      if (startIndex !== -1) {
        startIndex += label.length;
        var endIndex = body.indexOf("<br>", startIndex);
        if (endIndex !== -1) {
          return body.substring(startIndex, endIndex).trim();
        }
      }
    } else {
      var startIndex = body.indexOf(label);
      if (startIndex !== -1) {
        startIndex += label.length;
        var endIndex = body.indexOf("\n", startIndex);
        if (endIndex !== -1) {
          return body.substring(startIndex, endIndex).trim();
        }
      }
    }
    return "";
  }
  
  function checkUnrespondedEmails() {
    var threads = GmailApp.search('is:unread -label:complete');
    Logger.log("Found " + threads.length + " unresponded emails.");
  
    var databaseUrl = "https://lostandfound-215d8-default-rtdb.asia-southeast1.firebasedatabase.app/";
  
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      Logger.log("Processing thread " + i + " with " + messages.length + " messages.");
  
      for (var j = 0; j < messages.length; j++) {
        var message = messages[j];
        var subject = message.getSubject();
        var body = message.getPlainBody();
        Logger.log("Processing message " + j + " with subject: " + subject);
  
        if (subject.toLowerCase().indexOf("claim lost item") !== -1) {
          Logger.log("Processing a lost item claim request email.");
  
          var itemName = extractValueFromBody("Item Name:", body);
          var description = extractValueFromBody("Description:", body);
          var type = extractValueFromBody("Type:", body);
          var dateFound = extractValueFromBody("Date Found:", body);
  
          if (isItemAvailable(itemName, databaseUrl)) {
            var claimCode = generateClaimCode();
            Logger.log("Generated claim code: " + claimCode);
  
            var userEmail = message.getFrom();
            Logger.log("User's email: " + userEmail);
  
            var replySubject = "Lost Item Claim Information";
            var replyBody = "Hi " + userEmail + "!\n\n";
            replyBody += "We have received the details of your lost item as below:\n\n";
            replyBody += "Item Name: " + itemName + "\n";
            replyBody += "Description: " + description + "\n";
            replyBody += "Type: " + type + "\n";
            replyBody += "Date Found: " + dateFound + "\n\n";
            replyBody += "Please use claim code: " + claimCode + " at the Lost and Found, in the DINING HALL, to claim your item. \n\n";
            replyBody += "Thank you,\n";
            replyBody += "FindersKeepers Assistant";
  
            Logger.log("Reply email body: " + replyBody);
  
            GmailApp.sendEmail(userEmail, replySubject, replyBody);
  
            threads[i].addLabel(GmailApp.getUserLabelByName("complete"));
            Logger.log("Added 'complete' label to the thread.");
          } else {
            var replySubject = "Lost Item Claim Information";
            var replyBody = "Hi " + userEmail + "!\n\n";
            replyBody += "We're sorry, but the item you claimed (" + itemName + ") has already been claimed by someone else.\n\n";
            replyBody += "If you wish to escalate the matter, please click the escalate button on the claims page.";
            Logger.log("Reply email body: " + replyBody);
  
            GmailApp.sendEmail(userEmail, replySubject, replyBody);
  
            threads[i].addLabel(GmailApp.getUserLabelByName("complete"));
            Logger.log("Added 'complete' label to the thread.");
          }
        } else if (subject.toLowerCase().indexOf("admin add item") !== -1) {
          Logger.log("Processing an admin add item request email.");
  
          var itemName = extractValueFromBody("Item Name:", body);
          var description = extractValueFromBody("Description:", body);
          var type = extractValueFromBody("Type:", body);
          var dateFound = extractValueFromBody("Date Found:", body);
  
          addItemToDatabase(itemName, description, type, dateFound, databaseUrl);
  
          var adminEmail = message.getFrom();
          Logger.log("Admin's email: " + adminEmail);
  
          var replySubject = "Item Added to Database";
          var replyBody = "Hi " + adminEmail + "!\n\n";
          replyBody += "The item has been successfully added to the database with the following details:\n\n";
          replyBody += "Item Name: " + itemName + "\n";
          replyBody += "Description: " + description + "\n";
          replyBody += "Type: " + type + "\n";
          replyBody += "Date Found: " + dateFound + "\n\n";
          replyBody += "Thank you for keeping our Lost and Found up-to-date.\n\n";
          replyBody += "FindersKeepers Assistant";
  
          Logger.log("Reply email body: " + replyBody);
  
          GmailApp.sendEmail(adminEmail, replySubject, replyBody);
  
          threads[i].addLabel(GmailApp.getUserLabelByName("complete"));
          Logger.log("Added 'complete' label to the thread.");
        } else {
          var userEmail = message.getFrom();
          var replySubject = "General Query";
          var replyBody = "Hi " + userEmail + "!\n\n";
          replyBody += "We received your email, but we're not sure how to help with your request. Please make sure your email subject is correct and try again.\n\n";
          replyBody += "If you need further assistance, please contact our support team.\n\n";
          replyBody += "Thank you,\n";
          replyBody += "FindersKeepers Assistant";
  
          Logger.log("Reply email body: " + replyBody);
  
          GmailApp.sendEmail(userEmail, replySubject, replyBody);
  
          threads[i].addLabel(GmailApp.getUserLabelByName("complete"));
          Logger.log("Added 'complete' label to the thread.");
        }
      }
    }
  }
  
  function isItemAvailable(itemName, databaseUrl) {
    var url = databaseUrl + "/lostItems.json";
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
    for (var key in data) {
      if (data[key].itemName === itemName) {
        return true;
      }
    }
    return false;
  }
  
  function generateClaimCode() {
    var lastClaimCode = PropertiesService.getScriptProperties().getProperty('lastClaimCode');
    var nextClaimCode = (lastClaimCode ? parseInt(lastClaimCode) : 0) + 1;
    PropertiesService.getScriptProperties().setProperty('lastClaimCode', nextClaimCode);
    return nextClaimCode;
  }
  
  function addItemToDatabase(itemName, description, type, dateFound, databaseUrl) {
    var url = databaseUrl + "/lostItems.json";
    var payload = {
      itemName: itemName,
      description: description,
      type: type,
      dateFound: dateFound
    };
    var options = {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    };
    UrlFetchApp.fetch(url, options);
  }
  