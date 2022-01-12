
var telegramUrl = "https://api.telegram.org/bot" + token + "/makePost";
var chat_id = "1182469925"
var chatSelf = "2073270337"
var textTest = "ITS LITT"
var photoTest = "https://www.tradingview.com/x/BBM1NSQW/"
var token = config.MY_API_TOKEN;
var key = config.SECRET_API_KEY;


var telAPI = "https://api.telegram.org/bot" + token + key + "/sendPhoto?chat_id=" + chat_id + "&photo=" + photoTest + "&caption=" + textTest;

async function makePost() {
  const data = {
      name: 'Tester Bot',
      description: 'Testing J Tester',
      public: false
  }
 
  try {
      let response = await fetch(telAPI,{
          headers:{
              'Content-Type' : 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(data),
          
          
      });
      if (response.ok) {
          console.log("Posting To Telegram")
          console.log(response)
          
      } else {
          console.log("Something went wrong")
          console.log(response)
      }
  } catch (err) {
      console.log(err);
  }
}

makePost();