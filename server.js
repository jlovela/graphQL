import { ApolloServer, gql } from 'apollo-server';

let tweets = [
  {
    id: '1',
    text: 'first one',
    userId: '2',
  },
  {
    id: '2',
    text: 'secend on',
    userId: '1',
  },
];

let users = [
  {
    id: '1',
    firstName: 'teasin',
    lastName: 'cho',
  },
  {
    id: '2',
    firstName: 'Elon',
    lastName: 'mask',
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    # fullname is the sum of firstName + lastName as a string
    fullName: String!
  }
  #Tweet object represents a resource for a tweet

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet!
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    #Deletes a Tweet if found, else return false
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets: () => tweets,
    tweet: (root, { id }) => tweets.find((tweet) => tweet.id === id),
    allUsers: () => users,
  },
  Mutation: {
    postTweet: (root, { text, userId }) => {
      const newTweet = {
        id: (tweets.length + 1).toString(),
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet: (root, { id }) => {
      const tweetIndex = tweets.findIndex((tweet) => tweet.id === id);
      if (tweetIndex === -1) return false;
      tweets.splice(tweetIndex, 1);
      return true;
    },
  },
  User: {
    fullName: (user) => `${user.firstName} ${user.lastName}`,
  },
  Tweet: {
    author: ({ userId }) => users.find((user) => user.id === userId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
