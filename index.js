// Import the filesystem module
const fs = require('fs')
const Handlebars = require('handlebars')
const fsPromises = fs.promises

// Get all templates
const readBlockComponentTemplate = fs.readFileSync('./blocks/component-template.tsx.hbs', 'utf-8')
const blockComponentTemplate = Handlebars.compile(readBlockComponentTemplate)

const readBlockTypeTemplate = fs.readFileSync('./blocks/type-template.ts.hbs', 'utf-8')
const blockTypeTemplate = Handlebars.compile(readBlockTypeTemplate)

// Function to get all blocks from the apps/cms/scheams/blocks folder and return them as an array
const getBlocks = async () => {
  const blocks = await fsPromises.readdir('../../apps/cms/schemas/blocks')
  return blocks
}

// Change File data in to JSON Object
const changeFileDataToJson = (data) => {
  let jsonStringData = data
    .split('default')
    .pop()
    .replace(/\n/g, '')
    .replace(/'/g, '')
    .replace(/\w+/g, (e) => {
      return e.replace(e, `"${e}"`)
    })
  let jsonData = JSON.parse(`${jsonStringData}`)
  return jsonData
}

//Create Test Directories
const createTestDirectories = () => {
  const testBlockTypeDir = './test/types/blocks'
  const testBlockComponentDir = './test/components/blocks'
  const testComponentDir = './test/components'
  const testComponentTypeDir = './test/types/components'
  const testObjectTypeDir = './test/types/objects'
  const testObjectComponentDir = './test/components/objects'
  const allTestDirs = [
    testBlockTypeDir,
    testBlockComponentDir,
    testComponentDir,
    testComponentTypeDir,
    testObjectTypeDir,
    testObjectComponentDir
  ]

  allTestDirs.forEach((testDir) => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
  })
}

// Create Production Directories
const createProductionDirectories = () => {
  // Create the directory for all components and types if they don't exist
  const blockTypeDir = '../../apps/web/src/types/blocks'
  const blockComponentDir = '../../apps/web/src/components/blocks'
  const componentDir = '../../apps/web/src/components'
  const componentTypeDir = '../../apps/web/src/types/components'
  const objectTypeDir = '../../apps/web/src/types/objects'
  const objectComponentDir = '../../apps/web/src/components/objects'
  const allDirs = [blockTypeDir, blockComponentDir]
  allDirs.forEach((directory) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
  })
}

// Call getBlocks function and pass the blocks array to the next function
getBlocks().then((blocks) => {
  // loop though all blocks and read the file to get all json data.
  // if argument passed in script is "test" then console.log the data and exit.
  // else
  // then take that data and create or replace a file in ../../apps/web/src/types/blocks with typescript types based off of the block types template from ./blocks/type-template.js.
  // also take the data and create or replace a file in ../../apps/web/src/components/blocks with react components base off of the block component template from ./blocks/component-template.js.

  blocks.forEach((block) => {
    fs.readFile(`../../apps/cms/schemas/blocks/${block}`, 'utf8', function (err, data) {
      if (err) {
        return console.log(err)
      }
      const blockData = changeFileDataToJson(data)
      const blockComponent = blockComponentTemplate({ name: blockData.title })
      const blockType = blockTypeTemplate({ name: blockData.title, fields: blockData.fields })

      // Create the test directory if precess.argv[2] is test, for all components and types if they don't exist
      if (process.argv[2] === 'test') {
        console.log('HB - Blocks - \n', blockType, '\n', blockComponent)
        createTestDirectories()
      } else {
        createProductionDirectories()
      }
    })
  })
})
