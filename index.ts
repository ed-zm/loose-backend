import { GraphQLServer } from 'graphql-yoga'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'
import path from 'path'
import Mutation from './src/graphql/mutations'
import Query from './src/graphql/queries'

const generated = fileLoader(path.join(__dirname, 'generated'), {
  recursive: true,
  extensions: ['.graphql']
})
const customResolvers = fileLoader(path.join(__dirname, 'datamodel/custom'), {
  recursive: true,
  extensions: ['.graphql']
})

const typeDefs = mergeTypes([...generated, ...customResolvers ])

const server = new GraphQLServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation
  }
})

server.start({
  port: process.env.PORT,
}, () => console.log(`running on ${process.env.PORT}`))