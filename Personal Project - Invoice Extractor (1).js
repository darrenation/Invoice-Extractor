var receipients = ["ufmojobs@gmail.com", "darrenseah5530@gmail.com", "controller@ufmo.asia", "cs1@ufmo.asia", "rita@ufmo.asia", "gai.ufmo@gmail.com", "ufmocs@gmail.com"];

function nextMonthOpsSheet() {
  // Today's date
  var today = new Date();
  var currentMth = today.getMonth();
  var currentYr = today.getFullYear();
  
  // Get the first day of the following month
  var nxtMth = currentMth + 1;
  var nxtYr = currentYr;
  if (nxtMth > 11) {
    nxtMth = 0; // reset to Jan
    nxtYr++;
  }
  var nxtMthFirstDay = new Date(nxtYr, nxtMth, 1);
  var nxtMthLastDay = new Date(nxtYr, nxtMth + 1, 0);
  
  // Open template spreadsheet
  var templateSS = SpreadsheetApp.openById("1KQVCRY7WbEP_RqG8vXKYPtCozxj-VRUXm6gL30zBwTo");
  
  // Create new spreadsheet and set name
  var nxtMthName = (Utilities.formatDate(nxtMthFirstDay, Session.getScriptTimeZone(), "MMMM yyyy") + " OPS").toUpperCase();
  var nxtMthSS = SpreadsheetApp.create(nxtMthName);
  
  var templateSheet = templateSS.getSheets()[0];
  var targetSheet = nxtMthSS.getActiveSheet();
  targetSheet.setName('Template');

  // Get values from the source sheet
  var range = templateSheet.getDataRange();
  var values = range.getValues();
  
  // Set values to the target sheet
  targetSheet.getRange(1, 1, values.length, values[0].length).setValues(values);

  // Formatting adjustments
  var rangesToFormat = [
    { range: 'A1:M1', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A3:M3', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A5:M5', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A7:M7', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A9:M9', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A13:M13', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A21:M21', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A30:M30', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A38:M38', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A53:M53', bold: true, horizontalAlignment: 'center', backgroundColor: 'ACCENT3' },
    { range: 'A12:M12', bold: true, horizontalAlignment: 'center', backgroundColor: '#ffff00', mergeAcross: true },
    { range: 'A20:M20', bold: true, horizontalAlignment: 'center', backgroundColor: '#ffff00', mergeAcross: true },
    { range: 'A29:M29', bold: true, horizontalAlignment: 'center', backgroundColor: '#ffff00', mergeAcross: true },
    { range: 'A37:M37', bold: true, horizontalAlignment: 'center', backgroundColor: '#ffff00', mergeAcross: true },
    { range: 'A52:M52', bold: true, horizontalAlignment: 'center', backgroundColor: '#ffff00', mergeAcross: true }
  ];

  rangesToFormat.forEach(function(item) {
    var range = targetSheet.getRange(item.range);
    range.setFontWeight(item.bold ? 'bold' : null);
    range.setHorizontalAlignment(item.horizontalAlignment);
    range.setBackground(item.backgroundColor);
    if (item.mergeAcross) {
      range.mergeAcross();
    }
  });

  targetSheet.getRange('1:150').activate();
  targetSheet.setRowHeights(1, 150, 38);
  targetSheet.getActiveRangeList().setVerticalAlignment('middle');

  targetSheet.getRangeList(['A19:M19', 'A12:M12', 'A28:M28', 'A36:M36', 'A51:M51']).activate();
  targetSheet.getActiveRangeList().setBackground('#000000');
  
  // Making copies of template
  var templateRange = targetSheet.getDataRange();
  for (var day = 1; day <= nxtMthLastDay.getDate(); day++) {
    var sheetName = Utilities.formatDate(new Date(nxtYr, nxtMth, day), Session.getScriptTimeZone(), "ddMM");
    var newSheet = nxtMthSS.insertSheet(sheetName);
    
    // Copy values and formatting from the template to the new sheet
    var newSheetRange = newSheet.getRange(1, 1, templateRange.getNumRows(), templateRange.getNumColumns());
    templateRange.copyTo(newSheetRange, { contentsOnly: false });
  }
  setColumnWidthsForAllSheets(nxtMthSS.getId());
  receipients.forEach(function(email) {nxtMthSS.addEditor(email);});
  sendEmail(nxtMthSS.getUrl());
  file = DriveApp.getFileById(ss.getId());
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
}


// Set column size
function setColumnWidthsForAllSheets(id) {
  var spreadsheetId = id;
  var columnWidths = [112, 105, 102, 201, 65, 75, 368, 350, 265, 280, 167];

  // Open the spreadsheet
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  // Get all sheets in the spreadsheet
  var sheets = spreadsheet.getSheets();

  // Loop through each sheet
  sheets.forEach(function(sheet) {
    // Loop through each column index and set its width
    columnWidths.forEach(function(width, index) {
      sheet.setColumnWidth(index + 1, width); // Adjust index by 1 since column index starts from 1
    });
  });
}


// Mass send email
function sendEmail(link) {
  var subject = "Creation of next month ops sheet";
  var body = "Dear all,<br><br>As part of system automation, ops sheet for next month will be created every 20th:<br><br>" + link + "<br><br>Access will be shared to all of you.<br><br><i>This is an automated message. Cheers!</i>";
  
  receipients.forEach(function(receipient) {
    GmailApp.sendEmail(receipient, subject, "", {htmlBody: body});
  });
}