import url from 'url';
import bb from 'bluebird';
import SlackAccessor from './SlackAccessor';
const token = process.env.SLACK_API_TOKEN;

const main = async function(link) {
  const { path } = url.parse(link);
  const [all, channel, sec, msec] = /\/archives\/(.+)\/p([0-9]+)([0-9]{6})$/.exec(path);

  const slack = new SlackAccessor(token);

  const reactions = await slack.getReactions(channel, `${sec}.${msec}`);
  return bb.map(reactions, async (reaction) => {
    const userNames = await bb.map(reaction.users, (userId) => {
      return slack.getUserById(userId)
        .then(user => user.name);
    });
    return {
      reaction: reaction.name,
      users: userNames
    };
  });
}
export default main;
