// KM Home Improvement — lead capture (Google Apps Script)
// Receives quote-form submissions from the website, adds a row to the "KM Leads"
// sheet, and emails the business a copy.
const SHEET_ID = '1avs9EmxQJgjdAPX4vgCflGL2Q3U9BqL-3-3vexiKgak';
const NOTIFY_EMAIL = 'kmhomeimprovement@hotmail.com,kevinsantiii13@gmail.com'; // comma-separated

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const clean = v => String(v || '').slice(0, 2000).replace(/^[=+\-@]/, "'$&"); // stop sheet formula injection
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.appendRow([new Date(), clean(d.name), clean(d.phone), clean(d.email), clean(d.town),
                     clean(d.project), clean(d.details), clean(d.page), 'New', '']);
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New website lead: ' + clean(d.project) + ' — ' + clean(d.name),
      body: ['Name: ' + clean(d.name), 'Phone: ' + clean(d.phone), 'Email: ' + clean(d.email),
             'Town: ' + clean(d.town), 'Project: ' + clean(d.project), '', clean(d.details)].join('\n'),
      replyTo: d.email && /^\S+@\S+$/.test(d.email) ? d.email : NOTIFY_EMAIL
    });
    return ContentService.createTextOutput('ok');
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput('error: ' + err);
  }
}

// Open the web app URL in a browser to check it is live.
function doGet() { return ContentService.createTextOutput('KM lead capture is live'); }

// Run this once from the editor (Run button) to grant permissions and send a test lead.
function testLead() {
  const out = doPost({ postData: { contents: JSON.stringify({
    name: 'TEST Lead', phone: '000-000-0000', email: '', town: 'Test',
    project: 'Painting', details: 'Test lead - delete me', page: '/test' }) } });
  Logger.log(out.getContent());
}
