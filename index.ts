import { program, Option } from 'commander'
import degit from 'degit'
import packageInfo from './package.json'

const ACCEPTED_TYPES = ['api', 'lib', 'www'] as const
const typeOption = new Option('-t, --type <type>', 'project type')
  .choices(ACCEPTED_TYPES)
  .makeOptionMandatory()

let projectDirectory: string = ''
let type: string = ''

program
  .name(packageInfo.name)
  .version(packageInfo.version)
  .description(packageInfo.description)
  .arguments('<project-directory>')
  .action((projectDirectory, options) => {
    run(projectDirectory, options)
      .then(process.exit(0))
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  })
  .addOption(typeOption)
  .parse(process.argv)

type Options = {
  type: string
}
async function run(projectDirectory: string, { type }: Options): Promise<void> {
  // Some logs for now...
  console.table({
    projectDirectory,
    type,
  })
  console.log()

  // Clone example path into directory
  await pullDownTemplate({ dest: projectDirectory, type })
}

async function pullDownTemplate({
  dest,
  type,
}: {
  dest: string
  type: string
}) {
  return new Promise<void>((resolve, reject) => {
    const gitter = degit(`tnez/kreate/templates/${type}`, {
      cache: true,
      force: true,
      verbose: true,
    })
    gitter.on('info', (info) => {
      console.log(`[INFO] ${info.message}`)
    })
    gitter.on('warn', (warning) => {
      console.warn(`[WARN]: ${warning.message}`)
      reject()
    })
    gitter.clone(dest).then(() => {
      resolve()
    })
  })
}
