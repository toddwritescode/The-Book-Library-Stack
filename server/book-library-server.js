const express = require("express");
const expressGraphql = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");

// ----------------------- GraphQL Schema -----------------------

const schema = buildSchema(`
    type Query {
        book(id: Int): Book
        books(title: String): [Book]
    }
    type Mutation {
        createBook(book: String!): Book
        updateBookTitle(id: Int!, title: String!): Book
    }
    type Book {
        id: Int!
        title: String!
        author: Author!
        description: String!
    }
    type Author {
        id: Int!
        firstName: String!
        lastName: String!
    }
`);

// ----------------------- INIT DATA -----------------------
const books = [
  {
    id: 1,
    title: "Harry Potter",
    author: { id: 1, firstName: "JK", lastName: "Rowling" },
    description: "You're a wizard Harry!"
  },
  {
    id: 2,
    title: "The Lion, The Witch and the Wardrobe",
    author: { id: 2, firstName: "CS", lastName: "Lewis" },
    description: "The wardrobe can take you anywhere"
  }
];

const authors = [
  { id: 1, firstName: "JK", lastName: "Rowling" },
  { id: 2, firstName: "CS", lastName: "Lewis" }
];

// ----------------------- Specify queries and mutations -----------------------
const getBook = function({ id }) {
  if (!!id) {
    return books.find(b => b.id === id);
  } else {
    return books[0];
  }
};

const getBooks = function(args) {
  if (!!args.title) {
    const title = args.title;
    return books.filter(b => b.title === title);
  } else {
    return books;
  }
};

const createBook = function(args) {
  if (!!args.book) {
    let author = authors.find(auth => {
      return (
        auth.firstName === args.book.author.firstName &&
        author.lastName === args.book.author.lastName
      );
    });
    if (author === undefined) {
      author = {
        id: authors.length + 1,
        firstName: args.book.author.firstName,
        lastName: args.book.author.lastName
      };
    }
    const newBook = {
      id: books.length + 1,
      title: book.title,
      author: author,
      description: book.description
    };
    books.push(newBook);
    return newBook;
  }
  return null;
};

const updateBookTitle = function({ id, title }) {
  books.map(book => {
    if (book.id === parseInt(id)) {
      book.title = title;
      return book;
    }
  });
  return null;
};

// ----------------------- Root Object / Resolver -----------------------
const root = {
  book: getBook,
  books: getBooks,
  createBook: createBook,
  updateBookTitle: updateBookTitle
};

// ----------------------- Express Server and GraphQL endpoint -----------------------
const app = express();
app.use(cors());
app.use(
  "/graphql",
  expressGraphql({
    schema: schema,
    rootValue: root,
    graphiql: true // tool running in browser that shows user interface showing graphql (sandbox)
  })
);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
