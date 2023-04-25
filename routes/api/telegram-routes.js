const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN;
const router = require('express').Router();
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');
const Signals = require('../../models/Signals');
const BetaPosters = require('../../models/BetaPosters');
const Users = require('../../models/Users');
const welcomeMessagesSent = {};

// Define the top-level menu options for each role
const adminTopLevelMenuOptions = [
  {
    text: 'Post',
    callback_data: 'admin_post_menu'
  },
  {
    text: 'Broadcast',
    callback_data: 'admin_broadcast_menu'
  },
  {
    text: 'View Subscribers',
    callback_data: 'admin_settings_menu'
  },
  {
    text: 'Manage Subscribers',
    callback_data: 'admin_settings_menu'
  },
  {
    text: 'Settings',
    callback_data: 'admin_settings_menu'
  }
];

const posterTopLevelMenuOptions = [
  {
    text: 'New Post',
    callback_data: 'new_post'
  },
  {
    text: 'See Post',
    callback_data: 'see_post'
  },
  {
    text: 'Delete Post',
    callback_data: 'delete_post'
  },
  {
    text: 'Your Subcribers',
    callback_data: 'your_subscribers'
  },

];

const subscriberTopLevelMenuOptions = [
  {
    text: 'Analysis',
    callback_data: 'subscriber_analysis_menu'
  },
  {
    text: 'Dax Dice',
    callback_data: 'dax_dice'
  }
];

// Define the second-level menu options for each role
const adminPostMenuOptions = [
  {
    text: 'Paid Post',
    callback_data: 'paid_post'
  },
  {
    text: 'Free Post',
    callback_data: 'free_post'
  }
];

const adminBroadcastMenuOptions = [
  {
    text: 'Broadcast To All',
    callback_data: 'broadcast_all'
  },
  {
    text: 'Broadcast To Paid Subscribers Only',
    callback_data: 'broadcast_paid'
  },
  {
    text: 'Broadcast To Free Subscribers Only',
    callback_data: 'broadcast_free'
  }
];

const adminSettingsMenuOptions = [
  {
    text: 'Change Role',
    callback_data: 'change_role'
  },
  {
    text: 'Change Subscription',
    callback_data: 'change_subscription'
  }
];

const subscriberAnalysisMenuOptions = [
  {
    text: 'Current Analysis',
    callback_data: 'current_analysis'
  },
  {
    text: 'Previous Analysis',
    callback_data: 'previous_analysis'
  }
];

// Define the top-level menus for each role
const adminTopLevelMenu = {
  reply_markup: {
    keyboard: [adminTopLevelMenuOptions],
    resize_keyboard: true,
    one_time_keyboard: true

  }
};

const posterTopLevelMenu = {
  reply_markup: {
    keyboard: [posterTopLevelMenuOptions],
    resize_keyboard: true,
    one_time_keyboard: true

  }
};

const subscriberTopLevelMenu = {
  reply_markup: {
    keyboard: [subscriberTopLevelMenuOptions],
    resize_keyboard: true,
    one_time_keyboard: true

  }
};

// Define the second-level menus for each role
const adminPostMenu = {
  reply_markup: {
    keyboard: [adminPostMenuOptions],
    resize_keyboard: true,
    force_reply: false,
  }
};

const adminBroadcastMenu = {
  reply_markup: {
    keyboard: [adminBroadcastMenuOptions],
    resize_keyboard: true,
    force_reply: false,
  }
};

const adminSettingsMenu = {
  reply_markup: {
    keyboard: [adminSettingsMenuOptions],
    resize_keyboard: true,
    force_reply: false,
  }
};

const subscriberAnalysisMenu = {
  reply_markup: {
    keyboard: [subscriberAnalysisMenuOptions],
    resize_keyboard: true,
    force_reply: false,
  }
};

//Code for catching unexpected messages and shortcuts
const shortcutToCallbackData = {
  '/ca': 'subscriber_analysis_menu',
  '/pa': 'previous_analysis',
  '/dice': 'dax_dice',
  '/help': 'menu'
};

// Listen for any kind of message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  const user = await Users.findOne({ where: { chat_id: chatId } });
  if (!user) {
    console.log('User not found');
    return;
  }

  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name;
  const username = msg.from.username;

  try {
    let user = await Users.findOne({ where: { chat_id: chatId } });
    const currentDate = new Date();
    const timeSinceLastInteraction = user ? (currentDate - user.last_interaction) / (1000 * 60 * 60) : null;

    if (!user && msg.text === '/start') {
      user = await Users.create({
        firstname: firstName,
        lastname: lastName,
        username: username,
        chat_id: chatId,
        is_subscribed: true,
        paid_subscriber: false,
        role: 'admin',
        joined_on: currentDate.toISOString(),
        last_interaction: currentDate.toISOString()
      });

      bot.sendMessage(chatId, `Welcome to the bot, ${firstName}!`);
    } else if (user) {
      user.last_interaction = user.last_interaction || new Date();
      await user.save();

      if (timeSinceLastInteraction >= 12 && timeSinceLastInteraction < 72) {
        bot.sendMessage(chatId, `Welcome back, ${firstName}!`);
      } else if (timeSinceLastInteraction >= 72) {
        bot.sendMessage(chatId, `Welcome back, ${firstName}! You were last seen ${Math.floor(timeSinceLastInteraction / 24)} day(s) ago.`);
      }

      user.last_interaction = currentDate;
      await user.save();
    }

    // Update the switch statement to use the new menus
    switch (user.role) {
      case 'admin':
        keyboard = adminTopLevelMenu;
        break;
      case 'poster':
        keyboard = posterTopLevelMenu;
        break;
      default:
        keyboard = subscriberTopLevelMenu;
        break;
    }

    if (msg.text === '/start' && user) {
      // Do nothing
      console.log('Existing user trying /start')
    } else if (msg.text === '/start') {
      bot.sendMessage(chatId, 'Select an option', keyboard);
    } else {
      await handleTopLevelMenu(chatId, user.role, msg.text);
      const match = msg.text.match(/(.+)/);
      if (match) {
        const text = match[1];
        const userId = msg.from.id;
        const userRole = user.role;

        const callbackData = shortcutToCallbackData[text];
        if (callbackData) {
          // If the message is a shortcut, use the corresponding callback query data to execute the command
          bot.emit('callback_query', { message: { chat: { id: chatId } }, from: { id: userId }, data: callbackData });
        } else {
          switch (text) {
            case 'Current Analysis':
            case '/ca':
              if (userRole === 'subscriber') {
                currentAnalysis(chatId, -1);
              } else {
                errorMessages(chatId, 'You do not have permission to use this command.');
              }
              break;

            case 'Previous Analysis':
            case '/pa':
              currentAnalysis(chatId, -2);
              break;

            case 'Dax Dice':
            case '/dice':
              diceGame(chatId);
              break;

            case 'menu':
            case 'Menu':
            case '/help':
              bot.sendMessage(chatId, 'Select an option', keyboard);
              break;
          }
        }
      }
    }

  } catch (error) {
    console.log('Error:', error);
  }
});
//Callback Query and Menu Functions

async function handleTopLevelMenu(chatId, userRole, text) {
  console.log(`handleTopLevelMenu called by: ${userRole} and text: ${text}`); // Debugging

  const validOptions = [
    ...adminTopLevelMenuOptions,
    ...adminBroadcastMenuOptions,
    ...posterTopLevelMenuOptions,
    ...subscriberTopLevelMenuOptions,
  ].map((option) => option.text);

  console.log(text)
  if (!validOptions.includes(text)) {
    errorMessages(chatId, "Invalid option top level.");
    return;
  }

  switch (userRole) {
    case 'admin':
      if (text === 'Post') {
        console.log('Admin: Post'); // Debugging
        bot.sendMessage(chatId, 'Admin: Post'); // Temporary response
        bot.sendMessage(chatId, 'Select a post option', adminPostMenu);
      } else if (text === 'Broadcast') {
        console.log('Admin: Broadcast'); // Debugging
        bot.sendMessage(chatId, 'Admin: Broadcast'); // Temporary response
        bot.sendMessage(chatId, 'Select a broadcast option', adminBroadcastMenu);

        bot.once('text', async (msg) => {
          const broadcastType = msg.text;
          console.log(`Selected broadcastType: ${broadcastType}`); // Debugging

          bot.sendMessage(chatId, 'Type your message to broadcast:');
          bot.once('text', async (msg) => {
            const content = msg.text;
            console.log(`Message content: ${content}`); // Debugging

            bot.sendMessage(chatId, `Broadcast message type: ${text}\nMessage: ${content}`, {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Confirm and send',
                      callback_data: 'confirm_send_broadcast_message',
                    },
                    {
                      text: 'Cancel',
                      callback_data: 'cancel_broadcast_message',
                    },
                  ],
                ],
              },
            });

            bot.on('callback_query', async (callbackQuery) => {
              const callbackData = callbackQuery.data;
              console.log(`Selected callback data: ${callbackData}`); // Debugging

              if (callbackData === 'confirm_send_broadcast_message') {
                await broadcastMessage(chatId, broadcastType, content);
              } else {
                bot.sendMessage(chatId, 'Broadcast cancelled.');
              }

              bot.removeListener('callback_query');
            });
          });
        });
      } else {
        errorMessages(chatId, "Invalid option.");
        bot.removeListener('callback_query');
      }
      break;

    case 'poster':
      // Handle 'poster' role menu options here
      console.log('Poster Role'); // Debugging
      bot.sendMessage(chatId, 'Poster Role'); // Temporary response
      break;
    default:
      // Handle 'subscriber' role menu options here
      console.log('Subscriber Role'); // Debugging
      bot.sendMessage(chatId, 'Subscriber Role'); // Temporary response
      break;
  }
}

async function broadcastMessage(chatId, broadcastType, content) {

  let targetUsers;
  console.log(broadcastType, ' = Broadcast Type Catcher')
  switch (broadcastType) {
    case 'Broadcast To All':
      targetUsers = await Users.findAll({
        where: {
          is_subscribed: true,
        },
      });
      break;
    case 'Broadcast To Paid Subscribers Only':
      targetUsers = await Users.findAll({
        where: {
          is_subscribed: true,
          paid_subscriber: true,
        },
      });
      break;
    case 'Broadcast To Free Subscribers':
      targetUsers = await Users.findAll({
        where: {
          is_subscribed: true,
          paid_subscriber: false,
        },
      });
      break;
    default:
      return;
  }

  const messageToSend = `${broadcastType}:\n\n${content}`;
  
  targetUsers.forEach(async (user) => {
    await bot.sendMessage(user.chat_id, messageToSend);
  });

 //Channel posting BYPASS - uncomment later
 // bot.sendMessage(channelId, messageToSend)

  bot.sendMessage(chatId, 'Your message has been broadcasted successfully.');
}

//Function that handles Signals Model does Current A and Previous A
function currentAnalysis(chatId, index) {
  Signals.findAll({
    attributes: ['id', 'exchange', 'ticker', 'notes', 'createdAt']
  })
    .then(data => {
      const results = data.slice(index);
      const latestAnalysis = results[0].dataValues;
      const time = dateFormat(latestAnalysis.createdAt);
      const message = `${latestAnalysis.exchange}:${latestAnalysis.ticker}\n\n${latestAnalysis.notes}\n${time}`;
      bot.sendMessage(chatId, message);
    })
    .catch(() => {
      console.log('There is no Signals to fetch');
    });
}

const checkForNewSignals = async () => {
  try {
    const signals = await Signals.findAll({
      where: {
        notified: false || 0
      }
    });
    //console.log('Number of signals:', signals.length);
    if (signals.length > 0) {
      const message = `New signals found:\n${signals.map(signal => `${signal.ticker} on ${signal.exchange} (${signal.interval}): ${signal.notes}`).join('\n')}`;
      console.log('New signals found:', message);

      // Retrieve subscribers from the Users table
      const subscribers = await Users.findAll({
        where: {
          is_subscribed: true
        }
      });

      // Send the message to all subscribers
      subscribers.forEach(async user => {
        bot.sendMessage(user.chat_id, message);
      });

      signals.forEach(async signal => {
        signal.notified = true;
        await signal.save();
      });
    }
  } catch (error) {
    console.log('Error checking for new signals:', error);
  }
};

//Error responses
function errorMessages(chatId, newError) {
  if (newError === undefined || newError === null || newError === '') {
    bot.sendMessage(chatId, `Im not sure I understood that.\n\n${newError}`);
  } else {
    bot.sendMessage(chatId, newError);
  }
  errorCount = 0;
}

// Bot Listening for Updates and Errors
bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  checkForNewSignals();
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

bot.on('error', (error) => {
  console.error('Error:', error);
});

//Adding channels to db for automated postings
bot.on('channel_post', (msg) => {
  console.log(msg);
});

//Games and Non Essential Things
function diceGame(n) {
  let dv1, dv2;
  bot.sendDice(n).then(data => {
    dv1 = data.dice.value;
    console.log(dv1);
    return bot.sendDice(n);
  })
    .then(data => {
      dv2 = data.dice.value;
      console.log(dv2);
      if (dv1 + dv2 === 7) {
        console.log("W");
      }
      else {
        console.log('L');
      }
    })
    .catch(error => {
      console.log(error);
    });
}

// Persitent Function Calls
setInterval(checkForNewSignals, 60000);

module.exports = router;
