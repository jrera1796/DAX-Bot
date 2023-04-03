const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN;
const router = require('express').Router();
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');
const Signals = require('../../models/Signals');
const BetaPosters = require('../../models/BetaPosters');
const Users = require('../../models/Users');

const adminCommands = [
  ['Paid Post', 'Free Post'],
  ['Broadcast To All']
];

const posterCommands = [
  ['New Post', 'See Post'],
  ['Delete Post']
];

const subscriberCommands = [
  ['Current Analysis'],
  ['Previous Analysis'],
  ['Dax Dice']
];

const adminKeyboard = {
  reply_markup: {
    keyboard: adminCommands,
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const posterKeyboard = {
  reply_markup: {
    keyboard: posterCommands,
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const subscriberKeyboard = {
  reply_markup: {
    keyboard: subscriberCommands,
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

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



// Listen for any kind of message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the bot!', subscriberKeyboard);

  try {
    const user = await Users.findOne({ where: { id: chatId } });
    let keyboard;
    switch (user.role) {
      case 'admin':
        keyboard = adminKeyboard;
        break;
      case 'poster':
        keyboard = posterKeyboard;
        break;
      case 'subscriber':
        keyboard = subscriberKeyboard;
        break;
      default:
        keyboard = subscriberKeyboard;
        break;
    }
    bot.sendMessage(chatId, 'Please select an option:', keyboard);
  } catch (error) {
    console.log('Error:', error);
  }
});


bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  checkForNewSignals();
});

// Listen for updates and errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

bot.on('error', (error) => {
  console.error('Error:', error);
});

bot.on('update', (update) => {
  if (update.message) {
    console.log(update.message);
    const chatId = update.message.chat.id;
    bot.sendMessage(chatId, 'Message received');
  }
});

bot.onText(/\/bitcoin/, (msg, match) => {
  const chatId = msg.chat.id;
  const price = 100;
  const invoice = bot.sendInvoice(
    chatId,
    'Payment for Product/Service',
    'Product/Service Description',
    'payload',
    process.env.BITCOIN_TOKEN,
    'BTC',
    [{ label: 'Product/Service', amount: price * 100 }]
  );
});

bot.onText(/(.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const userId = msg.from.id;
  const userRole = getUserRole(userId); // Replace with a function that retrieves the user's role

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

    default:
      errorMessages(chatId);
      break;
  }
});

setInterval(checkForNewSignals, 60000);

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
    .catch(err => {
      console.error(err);
    });
}

function errorMessages(chatId) {
  bot.sendMessage(chatId, `I'm not sure I understood that.`);
  errorCount = 0;
}

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

// function blockUser(chatId) {
//   if (!blockList.includes(chatId)) {
//     blockList.push(chatId);
//     console.log(`User ${chatId} has been added to the block list.`);
//   }
// }

// function unblockUser(chatId) {
//   if (blockList.includes(chatId)) {
//     const index = blockList.indexOf(chatId);
//     blockList.splice(index, 1);
//     console.log(`User ${chatId} has been removed from the block list`);
//   }
// }

module.exports = router;
