import { SchemaTypeDefinition } from 'sanity'
import news from './news'
import job from './job'
import teamMember from './teamMember'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [news, job, teamMember],
}
