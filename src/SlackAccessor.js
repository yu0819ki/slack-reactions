import qs from 'qs';
import axios from 'axios';
import _ from 'lodash';

class SlackAccessor {

  buildApiUrl(endpoint, params) {
    return [`https://slack.com/api${endpoint}`, qs.stringify(_.pickBy(params, (v) => {return v !== null;}))].join('?');
  }

  async getReactions(token, channelId, timestamp) {
    const url = this.buildApiUrl('/reactions.get', {token, channel: channelId, timestamp});
    const response = await axios.get(url);
    return _.get(response, 'data.message.reactions', []);
  }

  async findChannel(token, channelName, limit = null, cursor = null) {
    const url = this.buildApiUrl('/channels.list', {token, cursor, limit});
    const response = await axios.get(url);
    const channels = _.get(response, 'data.channels', []);
    const channel = _.find(channels, (channel) => {
      return channel.name === channelName
    });

    if (channel === undefined) {
      const nextCursor = _.get(response, 'data.response_metadata.next_cursor', null);
      if (nextCursor === null) {
        throw new Error('Channel not found.');
      }
      return this.findChannel(token, channelName, limit, nextCursor);
    }
    return channel;
  }
}

export default SlackAccessor;