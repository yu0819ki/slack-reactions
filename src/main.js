import url from 'url';
import SlackAccessor from './SlackAccessor';
const token = process.env.SLACK_API_TOKEN;

const main = async function(link) {
  const { path } = url.parse(link);
  const [all, channel, sec, msec] = /\/archives\/(.+)\/p([0-9]+)([0-9]{6})$/.exec(path);

  const slack = new SlackAccessor();
  const reactions = await slack.getReactions(token, channel, `${sec}.${msec}`);

  return reactions;
}
export default main;
