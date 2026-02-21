const fs = jest.genMockFromModule('fs')

function mock_file_info(jsonData) {
  this.jsonData = jsonData
}

// A custom version of `readFileSync` that reads from the special mocked out
function readFileSync(filePath) {
  const entries = this.jsonData || {}

  if (entries[filePath]) {
    return JSON.stringify(entries[filePath])
  }

  const normalizedPath = (filePath || '').toString().replace(/\\/g, '/')
  const key = Object.keys(entries).find(entry => {
    const normalizedEntry = entry.replace(/\\/g, '/')
    return normalizedPath.endsWith(normalizedEntry) || normalizedPath.endsWith(normalizedEntry.replace(/^\.\.\//, ''))
  })

  return JSON.stringify(key ? entries[key] : undefined)
}

fs.readFileSync = readFileSync
fs.mock_file_info = mock_file_info

module.exports = fs
