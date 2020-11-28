//Line 5  => ! show mendatory
//Line 20 => Mutation queries modify data in the data store and
// returns a value. It can be used to insert, 
// update, or delete data. Mutations are defined 
// as a part of the schema.
// Line 37, 38 => I set up lambda resolver for one field, and this lambda will query to DB and get paginated data.
// Lambda needs to process fetched data from DB and prepare the response
// But this response has a lot of data set.
// I need to paginate this dataset again on lambda.
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


const resolvers = {
  Query: {
    bookmark: async (root, args, context) => {
      try{
        var client = new faunadb.Client({ secret: "fnAD7TARt-ACBXa4SkA3XkCefnp2SNS6DcBCPOLA" });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )
        return result.data.map(d => {
          return {
            id: d.ts,
            url: d.data.url,
            desc: d.data.desc,
          }
        })
      }
      catch(err){
        console.log('err',err);
      }
    }
  },
  Mutation: {
    addBookmark: async (_, { url, desc }) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD7TARt-ACBXa4SkA3XkCefnp2SNS6DcBCPOLA" });
        var result = await client.query(
          q.Create(
            q.Collection('bookmarklist'),
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

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()