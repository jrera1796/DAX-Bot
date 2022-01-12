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