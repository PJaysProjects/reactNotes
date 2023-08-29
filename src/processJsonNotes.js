const fs = require('fs');

var newSuffix = '3D'
var folder = './jsonNotes/'


try {
    var files = fs.readdirSync(folder)
} catch (err) {
    console.error('This is the error: ', err)
}


console.log(files)

files.forEach(file => {
    try {
        const data = fs.readFileSync(folder + file, 'utf-8');

        const jsonData = JSON.parse(data)

        console.log(jsonData)

        jsonData['edges'].forEach(element => {

            element['source'] = element['from']
            delete element['from']

            element['target'] = element['to']
            delete element['to']

        });

        jsonData['links'] = jsonData['edges']

        jsonData['nodes'].forEach(element => {
            element['val'] = 4
        });

        console.log(jsonData)

        const newJsonString = JSON.stringify(jsonData)

        var endPath = newSuffix + file

        fs.writeFileSync(folder + endPath, newJsonString, 'utf-8')

    } catch (err) {
        console.error('An error occurred in writing or reading (not very studious!): ', err)
    }
})