

var dbox  = require("dbox"),
    stdin = process.stdin,
    stdout = process.stdout;

var app_key = "ly7wj2y5woa6hxp"
  , app_secret = "2oez04swwobjik9";

var app = dbox.app({ 'app_key': app_key, 'app_secret': app_secret });
app.requesttoken(function(status, request_token){
  if(request_token){
    console.log('Please visit ', request_token.authorize_url, ' to authorize your app.');
    ask('Is this done? (yes)', /^yes$/, function(answer) {

      app.accesstoken(request_token, function(status, access_token){
        console.log('app_key: ' + app_key);
        console.log('app_secret: ' + app_secret);
        console.log('oauth_token: ' + access_token.oauth_token);
        console.log('oauth_token_secret: ' + access_token.oauth_token_secret);
        console.log('uid: ' + access_token.uid);
        process.exit();
      });
    });
  }
});


function ask(question, format, callback) {
 stdin.resume();
 stdout.write(question + ": ");

 stdin.once('data', function(data) {
   data = data.toString().trim();

   if (format.test(data)) {
     callback(data);
   } else {
     stdout.write("It should match: "+ format +"\n");
     ask(question, format, callback);
   }
 });
}
