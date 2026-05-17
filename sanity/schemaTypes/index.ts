import { SchemaTypeDefinition } from 'sanity'
import news from './news'
import author from './author'
import program from './program'
import job from './job'
import teamMember from './teamMember'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [news, author, program, job, teamMember],
}
