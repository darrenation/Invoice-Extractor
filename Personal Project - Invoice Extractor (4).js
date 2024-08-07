// 1. Format email address readability
function extractSenderEmail(sender) {
  var email = sender.match(/<([^>]*)>/);
  return email ? email[1].trim() : sender.trim();
}


// 2. Extract Text from PDF
// Folder to store PDF attachment and the temporary Google Doc for copying
var folderId = '139iVzrFOszBj3wJc0Oor7OH1jjMrlziT';
var fileId; // Global variable for file ID


function getFileId() {
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles(); 
  
  if (files.hasNext()) {
    var file = files.next(); 
    fileId = file.getId();
    return fileId;
  }
}


function getTextFromPDF() {
  var fileId = getFileId();
  if (!fileId) {return;}
  
  // Convert PDF to Google Doc
  var file = DriveApp.getFileById(fileId);
  var blob = file.getBlob();
  var resource = {
    title: file.getName(),
    mimeType: 'application/vnd.google-apps.document',
    parents: [{id: folderId}] // Specify the parent folder ID
  };
  var docFile = Drive.Files.insert(resource, blob);
  
  // Open the Google Doc and get the text
  var doc = DocumentApp.openById(docFile.id);
  var text = doc.getBody().getText();
  
  Drive.Files.remove(docFile.id); // Delete after extracting text
  return text;
}


// 3. Format date to "DDMMYY HHMMSS" format
function formatDate(date) {
  var dd = ("0" + date.getDate()).slice(-2);
  var mm = ("0" + (date.getMonth() + 1)).slice(-2);
  var yy = date.getFullYear().toString().substr(-2);
  var hh = ("0" + date.getHours()).slice(-2);
  var min = ("0" + date.getMinutes()).slice(-2);
  var ss = ("0" + date.getSeconds()).slice(-2);
  return dd + " / " + mm + " / " + yy + " " + hh + ":" + min + ":" + ss;
}


// 4. Decide function to execute after parsing through attachments
function chooseFunc1(domain, attachment, body) {
  var attachmentName1 = attachment.getName();
  
  var myDict = {
    "gmail.com" : { // dummy test
      
    },

    "globalalliancelog.com" : {
      "HAULIER INSTRUCTION" : "galIPdf",
      "PICKUP INSTRUCTION" : "galEPdf"
    },

    "tollgroup.com" : {
      "Cartage Advice With Receipt" : "tollIPdf"
    },

    "rhenus.com" : {
      "Delivery Order Receipt" : "rhenusIPdf",
      "Arrival Notice" : "rhenusIPdf"
    },

    "kuehne-nagel.com" : {
      "DELIVERY NOTE" : "knIPdf",
      // "ARRIVAL NOTICE" : "knIPdf",
      "PICKUP NOTE" : "knEPdf"
    },

    "alliedfreight.com.sg" : {
      "JOB INSTRUCTION" : "aflIPdf",
      "AFL IMP" : "aflIPdf",
      "HAULIER INSTRUCTION -  UFMO" : "aflEPdf"
    }
  };

  var matched = false;
  var dataList = null;
  if (domain in myDict) {
    // Logger.log("Domain found");
    var funcDict = myDict[domain];
    for (var key1 in funcDict) {
      if (attachmentName1.includes(key1)) {
        var funcName = funcDict[key1];
        Logger.log("Function found: " + funcName);
        var folder = DriveApp.getFolderById(folderId);
        var file = folder.createFile(attachment);
        var func = eval(funcName); // Dynamically evaluate function name
        if (func) {
          dataList = func(body);
          file.setTrashed(true);
          matched = true;
          break;
        } 
      }
    }
  }
  if (!matched) {return null;}
  return dataList;
}