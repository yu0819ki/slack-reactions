import qs from 'qs';
import axios from 'axios';
import _ from 'lodash';

class SlackAccessor {

  constructor(token) {
    this.token = token;
  }

  buildApiUrl(endpoint, params) {
    const url = [
      `https://slack.com/api${endpoint}`,
      qs.stringify(_.pickBy(
        Object.assign(params, {token: this.token}),
        (v) => {return v !== null;}))
    ].join('?');
    return url;
  }

  async getReactions(channelId, timestamp) {
    const url = this.buildApiUrl('/reactions.get', {channel: channelId, timestamp});
    const response = await axios.get(url);
    return _.get(response, 'data.message.reactions', []);
  }

  async getUserById(userId) {
    const url = this.buildApiUrl('/users.info', {user: userId});
    const response = await axios.get(url);
    const user = _.get(response, 'data.user', null);
    if (user === null) {
      throw new Error('User not found.');
    }
    return user;
  }

  async findChannel(channelName, limit = null, cursor = null) {
    const url = this.buildApiUrl('/channels.list', {cursor, limit});
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
      return this.findChannel(channelName, limit, nextCursor);
    }
    return channel;
  }
}

export default SlackAccessor;
