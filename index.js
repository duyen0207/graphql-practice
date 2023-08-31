import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// db
import db from "./_database.js";
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((author) => author.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((game) => game.id === parent.game_id);
    },
  },
  Mutation: {
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 1000).toString(),
      };
      db.games.push(game);
      return game;
    },
    deleteGame(_, args) {
      db.games = db.games.filter((g) => g.id !== args.id);
      return db.games;
    },
  },
};

// server setup
const server = new ApolloServer({
  // type defs - definitions of types of data we want to expose on our graph
  typeDefs: typeDefs,
  // resolvers - handle respond
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at port", 4000);
