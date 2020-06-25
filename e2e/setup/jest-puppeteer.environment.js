const NodeEnvironment = require('jest-environment-node')
const FileSystem = require('fs')
const Path = require('path')
const Puppeteer = require('puppeteer')
const OS = require('os')

const DIR = Path.join(OS.tmpdir(), 'jest_puppeteer_global_setup')

class PuppeteerEnvironment extends NodeEnvironment {
  constructor (config) {
    super(config)
  }

  async setup () {
    await super.setup()
    // get the wsEndpoint
    const wsEndpoint = FileSystem.readFileSync(Path.join(DIR, 'wsEndpoint'), 'utf8')

    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }

    // connect to Puppeteer
    this.global.__BROWSER__ = await Puppeteer.connect({
      browserWSEndpoint: wsEndpoint
    })
  }

  async teardown () {
    await super.teardown()
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = PuppeteerEnvironment
