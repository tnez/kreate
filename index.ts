import { program, Option } from 'commander'
import degit from 'degit'
import packageInfo from './package.json'

program
  .name(packageInfo.name)
  .version(packageInfo.version)
  .description(packageInfo.description)
  .arguments('<project-directory>')
  .action((projectDirectory, options) => {
    run(projectDirectory, options)
      .then(() => {
        console.log('[INFO] OK ✅')
        process.exit(0)
      })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  })
  .addOption(
    new Option('-t, --type <type>', 'project type')
      .choices(['api', 'lib', 'www'])
      .makeOptionMandatory(),
  )
  .parse(process.argv)

type Options = {
  type: string
}
async function run(projectDirectory: string, { type }: Options): Promise<void> {
  console.log(`[INFO] Creating new **${type}** project at ${projectDirectory}`)

  // Clone example path into directory
  return pullDownTemplate({ dest: projectDirectory, type })
}

async function pullDownTemplate({
  dest,
  type,
}: {
  dest: string
  type: string
}) {
  return new Promise<void>((resolve, reject) => {
    const gitter = degit(`github:tnez/kreate/templates/${type}`)
    gitter.on('warn', (warning) => {
      console.log()
      console.warn(`[WARN]: ${warning.message}`)
      console.log()
      reject()
    })
    gitter.clone(dest).then(resolve).catch(reject)
  })
}
