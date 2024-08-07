function galIPdf(body) {
  var text = getTextFromPDF();
  var custRef = galICustRef(text);
  var qty = galIQty(text);
  var address = galIAddress(text);
  var date = galIDate(text);
  var vessel = galIVessel(text);
  var carrier = galICarrier(text);
  var container = galIContainer(text);
  var obl = galIObl(text); 
  var remarks = galIRemark(text);

  var data = [custRef, qty, address, date, vessel, carrier, container, obl, remarks];
  return data;
}


function galICustRef(text) {
  var startIdx = text.indexOf('Ref');
  var endIdx = startIdx + 22;
  if (startIdx !== -1 && endIdx !== -1) {
    var custRef = text.substring(startIdx + 6, endIdx).trim();
    return custRef;
  } else {return "NULL";}
}


function galIQty(text) {
  var startIdx = text.indexOf("20'/40'/40HC") + 1;
  if (startIdx !== -1) {
    var endIdx = startIdx + 22;
    var qty = text.substring(startIdx + 16, endIdx).trim();
    return qty;
  } else {return "NULL";}
}


function galIAddress(text) {
  var startSeekingIndex = text.indexOf('ADDRESS:-');
  var endSeekingIndex = text.indexOf('SINGAPORE');
  if (startSeekingIndex !== -1 && endSeekingIndex !== -1) {
    var nextCharIndex = startSeekingIndex + 8;
    var nextChar = text.charAt(nextCharIndex);
    var startIndex = nextChar === ' ' ? startSeekingIndex + 10 : startSeekingIndex + 9;
    var endIndex = endSeekingIndex + 16;
    var address = text.substring(startIndex, endIndex).trim();
    return address.replace(/\s+/g, ' '); 
  }
  return "NULL";
}


function galIDate(text) {
  var dates = text.match(/\b\d{1,2}\/\w{3}\/\d{4}\b/g); 
  if (dates && dates.length > 0) {
    return dates[dates.length - 1]; 
  } else {return "NULL";}
}


function galIVessel(text) {
  var startIdx = text.indexOf("VESSEL/VOYAGE") + 15;
  var endIdx = text.indexOf("ETD");
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText;
}


function galICarrier(text) {
  var startIdx = text.indexOf("CARRIER");
  if (startIdx !== -1) {
    var endIdx = text.indexOf("20'/40'/40HC");
    var carrier = text.substring(startIdx + 16, endIdx).trim();
    return carrier;
  } else {return "NULL";}
}


function galIContainer(text) {
  var pattern = /CONTAINER\s+:/; 
  var match = text.match(pattern);
  if (match) {
    var startIdx = text.indexOf(match[0]);
    var endIdx = startIdx + 25;
    var container = text.substring(startIdx + 11, endIdx).trim();
    return container;
  } else {return "NULL";}
}


function galIObl(text) {
  var pattern = /OBL\s*NO\.\s*:\s*([A-Z0-9]+)/;
  var match = text.match(pattern);
  
  if (match) {
    var oblNum = match[1].trim();
    return oblNum; 
  } else {
    pattern = /([A-Z0-9]+)\s*:\s*OBL NO./;
    match = text.match(pattern);
    if (match) {
      var oblNum = match[1].trim();
      return oblNum;
    }
  }
  return "NULL";
}


function galIRemark(text) {
  var startIdx = text.indexOf("REMARK") + 9;
  var endIdx = text.indexOf("THANKS");
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText;
}




function galEPdf(body) {
  var text = getTextFromPDF();
  var custRef = galECustRef(text);
  var qty = galEQty(text);
  var address = galEAddress(text);
  var date = galEDate(address);
  var vessel = galEVessel(text);
  var carrier = galECarrier(text);
  var container = "TBD";
  var obl = "TBD"; 
  var remarks = "Refer to email";
  
  var data = [custRef, qty, address, date, vessel, carrier, container, obl, remarks];
  return data;
}


function galECustRef(text) {
  var startIdx = text.indexOf('JOB NO.') + 8;
  var endIdx = startIdx + 15;
  var extractedText = text.substring(startIdx, endIdx);
  // Logger.log(extractedText);
  return extractedText.trim();
}


function galEQty(text) {
  var startIdx = text.indexOf("NO. OF CONTAINER") + 19;
  var endIdx = text.indexOf("WEIGHT / VOLUME");
  var extractedText = text.substring(startIdx, endIdx);
  // Logger.log(extractedText);
  return extractedText.trim();
}


function galEAddress(text) {
  var startIdx = text.indexOf("COLLECT FROM") + 18;
  var endIdx = text.indexOf("VESSEL/ VOYAGE");
  var extractedText = text.substring(startIdx, endIdx);
  Logger.log(extractedText);
  return extractedText.trim();
}


function galEDate(text) {
  var extractedText = text.substring(text.lastIndexOf('\n') + 2);
  // Logger.log(extractedText);
  return extractedText.trim();
}


function galEVessel(text) {
  var startIdx = text.indexOf("VESSEL/ VOYAGE") + 17;
  var endIdx = text.indexOf("ETA SIN");
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText;
}


function galECarrier(text) {
  var startIdx = text.indexOf("CARRIER") + 10;
  var endIdx = text.indexOf("CARRIER REF");
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText;
}




function tollIPdf(body) {
  var text = getTextFromPDF();
  var custRef = tollICustRef(text);
  var qty = tollIQty(text);
  var address = tollIAddress(text);
  var date = "TBD";
  var vessel = tollIVessel(text);
  var carrier = tollICarrier(text);
  var container = tollIContainer(text);
  var obl = tollIObl(text);
  var remarks = "Refer to email!";
  var data = [custRef, qty, address, date, vessel, carrier, container, obl, remarks];
  return data;
}


function tollICustRef(text) {
  var startIdx = text.indexOf('SHIPMENT') + 8;
  var endIdx = startIdx + 12;
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function tollIQty(text) {
  var startIdx = text.indexOf('TYPE / MODE') + 13;
  if (startIdx === -1) {startIdx = text.indexOf('PACKAGES') + 10;}
  var endIdx = text.indexOf('TARE WEIGHT');
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/(\r\n|\n|\r)/gm, '');
  return extractedText;
}


function tollIAddress(text) {
  var startIdx = text.indexOf('DELIVER TO ') + 10;
  var endIdx = text.indexOf('JOURNEY TWO');
  if (endIdx === -1) {endIdx = text.indexOf('ROUTING INFORMATION ');}
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/(\r\n|\n|\r)/gm, '');
  if (extractedText.includes('FULL') && extractedText.indexOf('FULL') === 1) {
    extractedText = extractedText.substring(6);
  }
  return extractedText.trim();
}


function tollIVessel(text) {
  var startIdx = text.indexOf('ETD ETA') + 8;
  var endIdx = text.indexOf('SGSIN');
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.substring(0, extractedText.indexOf('/', extractedText.indexOf('/') + 1));
  return extractedText.trim();
}


function tollICarrier(text) {
  var startIdx = text.indexOf('CARRIER') + 9;
  var endIdx = text.indexOf('GOODS DESCRIPTION');
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/(\r\n|\n|\r)/gm, '');
  extractedText = extractedText.substring(0, extractedText.indexOf('/'));
  return extractedText.trim();
}


function tollIContainer(text) {
  var startIdx = text.indexOf('CONTAINER NUMBER') + 16;
  var endIdx = text.indexOf('SHIPMENT');
  if (endIdx === -1) {endIdx = text.indexOf('PACKAGES');}
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/(\r\n|\n|\r)/gm, '');
  extractedText = extractedText.substring(0, 12)
  return extractedText.trim();
}


function tollIObl(text) {
  var startIdx = text.indexOf('OCEAN BILL OF LADING ') + 20;
  var endIdx = text.indexOf('HOUSE');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}




function rhenusIPdf (body) {
  text = getTextFromPDF();
  // Logger.log(text);
  body = body.replace(/<[^>]+>/g, '');
  custRef = rhenusICustRef(text);
  qty = rhenusIQty(text);
  address = rhenusIAddress(body);
  date = "TBD";
  vessel = rhenusIVessel(text);
  container = qty.slice(0,11);
  obl = rhenusIObl(text);
  remarks = rhenusIRemark(text);
  carrier = rhenusICarrier(remarks); // might need to refer to remarks
  var data = [custRef, qty, address, date, vessel, carrier, container, obl, remarks];
  return data;
}


function rhenusICustRef(text) {
  var startIdx = text.indexOf('Job Number') + 12;
  var endIdx = text.indexOf('MBL');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function rhenusIQty(text) {
  var startIdx = text.indexOf('-----------------------');
  var endIdx = startIdx + 65;
  var extractedText = text.substring(startIdx + 24, endIdx);
  if (startIdx === -1) {extractedText = "NULL / MULTIPLE"}
  return extractedText.trim();
}


function rhenusIAddress(body) {
  var startIdx = body.indexOf('Delivery Address');
  if (startIdx === -1) {startIdx = body.indexOf("deliver to :")}
  var endIdx = body.indexOf('Best regards');
  if (endIdx === -1) {endIdx = body.indexOf('Please note that our email addresses at');}
  if (endIdx === -1) {endIdx = body.indexOf('Thank you');}
  if (startIdx === -1 || endIdx === -1) { return rhenusIAddress2(text)}
  var extractedText = body.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/(\r\n|\n|\r)/gm, "");
  return extractedText.trim();
}


function rhenusIAddress2(text) {
  var startIdx = text.indexOf("Consignee");
  var endIdx = text.indexOf("Job Number");
  var extractedText = text.substring(startIdx + 17, endIdx);
  if (startIdx === -1 || endIdx === -1) {return "ERROR, check invoice";}
  return extractedText;
}


function rhenusIVessel(text) {
  var startIdx1 = text.indexOf('Vessel') + 8;
  var endIdx1 = startIdx1 + 15;
  var extractedText1 = text.substring(startIdx1, endIdx1);
  var startIdx2 = text.indexOf('Voyage') + 8;
  var endIdx2 = startIdx2 + 8;
  var extractedText2 = text.substring(startIdx2, endIdx2);
  extractedText1 = extractedText1.concat(" ", extractedText2);
  return extractedText1.trim();
}


function rhenusIObl(text) {
  var startIdx = text.indexOf('MBL') + 5;
  var endIdx = text.indexOf('HBL');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function rhenusIRemark(text) {
  var startIdx = text.indexOf('remarks') + 8;
  var endIdx = text.indexOf('All business');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}

function rhenusICarrier(remarks) {
  if (remarks.includes("CARRIER")) {
    var startIdx = remarks.indexOf("CARRIER");
    var endIdx = remarks.indexOf("PLACE");
    var extractedText = remarks.substring(startIdx + 10, endIdx);
    return extractedText;
  }
  return "TBD / See email"
}




function knIPdf(body) {
  text = getTextFromPDF();
  custRef = knICustRef(text);
  qty = knIQty(text);
  address = knIAddress(body);
  date = "TBD / See email";
  vessel = knIVessel(text);
  carrier = knICarrier(text);
  container = "TBD";
  obl = "TBD"
  var data = [custRef, qty, address, date, vessel, carrier, container, obl];
  return data;
}


function knICustRef(text) {
  var startIdx = text.indexOf('KN ACCOUNTING NO.') + 18;
  var endIdx = startIdx + 16;
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function knIQty(text) {
  var startIdx = text.indexOf('MARKS & NOS QTY TYPE DESCRIPTION OF GOODS WGHT VOL  ') + 50;
  var endIdx = text.indexOf('B/L / SWB NO.: ');
  if (endIdx === -1) {endIdx = text.indexOf('NUMBER AND SIZE OF CONTAINERS :');}
  if (endIdx === -1) {endIdx = text.indexOf("AS PER ATTACHED");}
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function knIAddress(body) {
  var startIdx = body.indexOf('Delivery address :') + 18;
  if (startIdx === -1) {startIdx = body.indexOf('Pick Up Address');}
  if (startIdx === -1) {startIdx = body.indexOf('Quote') + 7;}
  var endIdx = body.indexOf('Best Regards');
  if (endIdx === -1) {endIdx = body.indexOf('Thanks')}
  if (endIdx === -1) {endIdx = body.indexOf(' Unquote ');}
  var extractedText = body.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/\*/g, "");
  extractedText = extractedText.replace(/\n/g, "");
  if (extractedText.includes('Quote')) {
    extractedText = extractedText.substring(extractedText.indexOf('Quote'));
  }
  return extractedText.trim();
}


function knIVessel(text) {
  var startIdx = text.indexOf('VESSEL NAME :') + 14;
  var endIdx = text.indexOf('P. OF LOADING :');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function knICarrier(text) {
  var startIdx = text.indexOf('CARRIER NAME :') + 15;
  var endIdx = text.indexOf('VESSEL NAME');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}




function knEPdf(body) {
  text = getTextFromPDF();
 //  Logger.log(text);
  custRef = knECustRef(text);
  qty = knEQty(text);
  address = knEAddress(body);
  date = "TBD / See email";
  vessel = knEVessel(text);
  carrier = "See email";
  container = "TBD";
  obl = "TBD / See email"
  var data = [custRef, qty, address, date, vessel, carrier, container, obl];
  return data;
}


function knECustRef(text) {
  var startIdx = text.indexOf('KN ACCOUNTING NO.') + 17;
  var endIdx = startIdx + 16;
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function knEQty(text) {
  var startIdx = text.indexOf('INSURAN. STATUS : NOT ARRANGED BY KN \nMARKS & NOS QTY TYPE DESCRIPTION OF GOODS WGHT VOL') + 90;
  var endIdx = text.indexOf('SHIPPINE LINE:');
  if (endIdx === -1) {endIdx = text.indexOf('NUMBER AND SIZE OF CONTAINERS :');}
  if (endIdx === -1) {endIdx = text.indexOf('**TELEX RELEASED**');}
  var extractedText = text.substring(startIdx, endIdx);
  var subIdx = extractedText.indexOf("AS PER ATTACHED");
  extractedText = extractedText.substring(0, subIdx).trim();
  return extractedText.trim();
}


function knEAddress(body) {
  var startIdx = body.indexOf('Delivery address :');
  if (startIdx === -1) {startIdx = body.indexOf('Pick Up Address');}
  var endIdx = body.indexOf('Best Regards');
  if (endIdx === -1) {endIdx = body.indexOf('Thanks')}
  if (startIdx === -1 || endIdx === -1) {return knEAddress2(text)}
  var extractedText = body.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/\*/g, "");
  extractedText = extractedText.replace(/\n/g, "");
  return extractedText.trim();
}


function knEAddress2(text) {
  var startIdx = text.indexOf('PICKUP ADDRESS') + 16;
  var endIdx = text.indexOf('FEEDER VESSEL');
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/\n/g, "");
  return extractedText.trim();
}


function knEVessel(text) {
  var startIdx1 = text.indexOf('FEEDER VESSEL') + 16;
  if (startIdx1 === -1) {startIdx1 = text.indexOf('NOTIFY');}
  var endIdx1 = text.indexOf('MOTHER VESSEL');
  if (endIdx1 === -1) {endIdx1 = text.indexOf('PL. OF RECEIPT');}
  var extractedText1 = text.substring(startIdx1, endIdx1);
  
  var startIdx2 = text.indexOf('VOYAGE') + 9;
  var endIdx2 = text.indexOf('MOVEMENT TYPE');
  var extractedText2 = text.substring(startIdx2, endIdx2);

  extractedText1 = extractedText1.concat(" ", extractedText2);
  return extractedText1.trim();
}



function aflIPdf(body) {
  var text = getTextFromPDF();
  var custRef = aflICustRef(text);
  var qty = aflIQty(text);
  var address = aflIAddress(text);
  var date = aflIDate(text);
  var vessel = aflIVessel(text);
  var carrier = aflICarrier(text);
  var container = aflIContainer(text);
  var obl = aflIObl(text);
  var remarks = aflIRemarks(text);
  var data = [custRef, qty, address, date, vessel, carrier, container, obl, remarks];
  return data;
}


function aflICustRef(text) {
  var startIdx = text.indexOf('JOB REF') + 8;
  var endIdx = startIdx + 18;
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function aflIQty(text) {
  var regex = /\b\d+\s*X\s*\d+\b/g;
  var match = regex.exec(text); 
  if (match) {return match[0];} 
  else {return "NULL";}
}


function aflIAddress(text) {
  var startIdx = text.indexOf('DELIVER TO') + 13;
  var endIdx = text.indexOf('PLEASE ARRANGE');
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/\r?\n|\r/g, "");
  return extractedText.trim();
}


function aflIDate(text) {
  var regex = /\b\d{2}\.\d{2}\.\d{4}\b/g;
  var matches = text.match(regex);

  if (matches && matches.length >= 2) {
    var secondMatch = matches[1]; 
    return secondMatch;
  } else {return "";}
}


function aflIVessel(text) {
  var startIdx = text.indexOf('VESSEL / VOY') + 15;
  var endIdx = text.indexOf('ETA SIN');
  if (endIdx === -1) {endIdx = text.indexOf('E.T.A SIN');}
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/\r?\n|\r/g, "");
  return extractedText.trim();
}


function aflICarrier(text) {
  var startIdx = text.indexOf('CARRIER') + 10;
  var endIdx = text.indexOf('BL NO.');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText;
}


function aflIContainer(text) {
  var startIdx = text.indexOf('CTNR NO.') + 11;
  var endIdx = text.indexOf('PORT OF LOADING');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function aflIObl(text) {
  var startIdx = text.indexOf('BL NO.') + 9;
  var endIdx = text.indexOf('NO. OF');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText;
}


function aflIRemarks(text) {
  var startIdx = text.indexOf('PLEASE ARRANGE DELIVERY') + 15;
  if (startIdx === -1) {startIdx = text.indexOf('PLEASE ARRANGE TRUCKING/DELIVERY') + 24;}
  var endIdx = text.indexOf('THANKS & WARMEST');
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/\r?\n|\r/g, "");
  return extractedText.trim();
}





function aflEPdf(body) {
  var text = getTextFromPDF();
  var custRef = aflECustRef(text);
  var qty = aflEQty(text);
  var address = aflEAddress(text);
  var date = aflEDate(text);
  var vessel = aflEVessel(text);
  var carrier = aflECarrier(text);
  var container = "TBD";
  var obl = "TBD";
  var remarks = aflERemarks(text);
  var data = [custRef, qty, address, date, vessel, carrier, container, obl, remarks];
  return data;
}


function aflECustRef(text) {
  var startIdx = text.indexOf('BKG REF NO') + 13;
  var endIdx = text.indexOf('CARRIER');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function aflEQty(text) {
  var startIdx = text.indexOf('PACKAGES') + 11;
  var endIdx = text.indexOf('GROSS WEIGHT');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function aflEAddress(text) {
  var startIdx = text.indexOf('DELIVERY TO :') + 14;
  var endIdx = text.indexOf('THANKS & REGARDS');
  var extractedText = text.substring(startIdx, endIdx);
  extractedText = extractedText.replace(/\r?\n|\r/g, "");
  return extractedText.trim();
}


function aflEDate(text) {
  var startIdx = text.indexOf('ETA SIN') + 10;
  var endIdx = text.indexOf('POL : SINGAPORE');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function aflEVessel(text) {
  var startIdx = text.indexOf('VESSEL / VOY') + 15;
  var endIdx = text.indexOf('ETA SIN');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}


function aflECarrier(text) {
  var startIdx = text.indexOf('CARRIER') + 10;
  var endIdx = text.indexOf('VESSEL / VOY');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText;
}


function aflERemarks(text) {
  var startIdx = text.indexOf('REMARKS') + 10;
  var endIdx = text.indexOf('PICK UP FROM');
  var extractedText = text.substring(startIdx, endIdx);
  return extractedText.trim();
}