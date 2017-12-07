import url from 'url';
import SlackAccessor from './SlackAccessor';
const token = process.env.SLACK_API_TOKEN;

const main = async function(link) {
  const { path } = url.parse(link);
  const [all, channel, sec, msec] = /\/archives\/(.+)\/p([0-9]+)([0-9]{6})$/.exec(path);

  const slack = new SlackAccessor(token);
  const reactions = await slack.getReactions(channel, `${sec}.${msec}`);
  return Promise.all(reactions.map(async (v) => {
    const userNames =  await Promise.all(v.users.map(async (userId) => {
      const user = await slack.getUserById(userId);
      return user.name;
    }));
    return {
      reaction: v.name,
      users: userNames
    };
  }));
}
export default main;
