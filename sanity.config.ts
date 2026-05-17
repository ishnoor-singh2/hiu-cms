import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schema} from './sanity/schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'hiu-cms',
  title: 'HIU CMS',
  projectId,
  dataset,
  plugins: [
    structureTool(),
  ],
  schema,
})
