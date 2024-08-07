var ss = SpreadsheetApp.openById("16tmHsWQ8d4ybEqH03-9Z5Djp9Cfcni42lcqgIdKZK7I");

function bringEmails() {
  var mailSheet = ss.getSheetByName("OTHERS");
  var threads = GmailApp.getInboxThreads().splice(0, 10); 
  
  threads.forEach(thread => {
    var messages = thread.getMessages().slice(-1);
    messages.forEach(msg => {
      var msgDate = msg.getDate();
      var msgDateStr = formatDate(msgDate);
      var msgSender = msg.getFrom();
      Logger.log(msgSender);
      var senderEmail = extractSenderEmail(msgSender);
      var domain = senderEmail.substring(senderEmail.lastIndexOf("@") + 1);

      // Determine which sheet to append to, check if it already exists
      var sheet = (domain in domainSheet) ? ss.getSheetByName(domainSheet[domain]) : mailSheet;
      var mailDates = sheet.getRange("A2:A").getValues().flat();

      if (!mailDates.includes(msgDateStr)) {
        var msgSbj = msg.getSubject();
        var body = msg.getPlainBody();
        var attachments = msg.getAttachments();
        var dataList;

        // Ignoring certain messages
        if (senderEmail === "joey@alliedfreight.com.sg") {
          dataList = ["Sent by Joey.", "", "Can't run code. Pls manually chk."];
        } 
        
        else if (domain === "ufmo.asia" || 
        domain === "matchboxexchange.com" || 
        domain === "haulio.io" || 
        domain === "copierpc.com.sg" || 
        domain === "accounts.google.com" || 
        domain === "google.com") {
          return; 
        } 
        
        else {
          for (var i = 0; i < attachments.length; i++) {
            var attachment = attachments[i];
            dataList = chooseFunc1(domain, attachment, body);
            if (dataList) {break;}
          }
        }

        // Append data after function is ran
        // Insert checkboxes in the third column
        var rowData = [msgDateStr, msgDate, "", senderEmail, msgSbj].concat(dataList);
        var rowRange = sheet.getRange(sheet.getLastRow() + 1, 1, 1, rowData.length);
        rowRange.setValues([rowData]);
        var checkboxRange = sheet.getRange(sheet.getLastRow(), 3, 1, 1);
        checkboxRange.insertCheckboxes();
      }
    });
  });
}


// Moving ticked boxes away to "DONE" spreadsheet
function checkDone() {
  var sheets = ss.getSheets(); // Get all sheets in the spreadsheet
  var doneSheet = ss.getSheetByName("DONE");
  
  sheets.forEach(sheet => {
    if (sheet.getName() !== "DONE") {
      var lastRow = sheet.getLastRow();
      var range = sheet.getRange("C2:C" + lastRow);
      var values = range.getValues();

      for (var i = values.length - 1; i >= 0; i--) {
        if (values[i][0] === true) {
          var rowIndex = i + 2; // 
          var rowValues = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0]; 
          doneSheet.appendRow(rowValues); 
          sheet.deleteRow(rowIndex); 
        }
      }
    }
  });
}


// Checking for office hours to avoid user rate limit
function emailTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var currentTime = new Date();
  var currentHour = currentTime.getHours();
  
  if (currentHour >= 8 && currentHour <= 19) {
    var bringEmailsTriggerExists = triggers.some(trigger => trigger.getHandlerFunction() === 'bringEmails');
    var checkDoneTriggerExists = triggers.some(trigger => trigger.getHandlerFunction() === 'checkDone');
    if (!bringEmailsTriggerExists) {createTrigger('bringEmails', 5);}
    if (!checkDoneTriggerExists) {createTrigger('checkDone', 60);}
  } 
  
  if (currentHour > 20 ) {
    deleteTrigger('bringEmails');
    deleteTrigger('checkDone');
  }
}


function createTrigger(functionName, intervalMinutes) {
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyMinutes(intervalMinutes)
    .create();
}


function deleteTrigger(functionName) {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}