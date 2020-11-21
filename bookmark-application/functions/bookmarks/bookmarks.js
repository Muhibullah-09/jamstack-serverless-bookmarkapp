const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookmark(url: String!, desc: String!) : Bookmark
  }
`


const authors = [
  { id: 1, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
  { id: 2, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
  { id: 3, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
]

const resolvers = {
  Query: {
    bookmark: (root, args, context) => {
      return authors
    }
  },
  Mutation: {
    addBookmark: async (_, { url, desc }) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD7JRPdAACB238s1diN0hQL4O4mxpWrg7DGYvs" });
        var result = await client.query(
          q.Create(
            q.Collection('links'),
            {
              data: {
                url,
                desc
              }
            },
          )

        );
        console.log("Document Created and Inserted in Container: " + result.ref.id);
        return result.ref.data

      }
      catch (error) {
        console.log('Error: ');
        console.log(error);
      }
      // console.log('url--desc', url,'desc',desc);

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()