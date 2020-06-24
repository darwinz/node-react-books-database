const fs = jest.genMockFromModule('fs')

function mock_file_info(jsonData) {
  this.jsonData = jsonData
}

// A custom version of `readFileSync` that reads from the special mocked out
function readFileSync(filePath) {
  return JSON.stringify(this.jsonData[filePath])
}

fs.readFileSync = readFileSync
fs.mock_file_info = mock_file_info

module.exports = fs
