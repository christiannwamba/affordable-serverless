module.exports = async function(context, myTimer) {
  var timeStamp = new Date().toISOString();

  if (myTimer.IsPastDue) {
    context.log('JavaScript is running late!');
  }

  const msg = `JavaScript timer trigger function ran! at ${timeStamp}`;

  const email = {
    personalizations: [{ to: [{ email: 'nwambachristian@gmail.com' }] }],
    from: { email: 'chris@codebeast.dev' },
    subject: 'Affordable Cloud News',
    content: [
      {
        type: 'text/plain',
        value: msg
      }
    ]
  };

  context.log(msg);
  return email;
};
