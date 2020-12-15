const { Storage } = require('@google-cloud/storage');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const mkdirp = require('mkdirp');
const fs = require('fs');

const bucketName = 'ten10-firestore-export';

module.exports = async () => {
	try {
		const storage = new Storage({
			projectId: 'ten10-2020',
			keyFilename: './serviceAccount.json'
		});

		await storage.bucket(bucketName).getFiles({ delimiter: '/', autoPaginate: false }, listFolders);
	} catch (err) {
		console.log('Failed to connect to Google Cloud Storage. You might need a serviceAccount.json in the root folder of your project.');
		console.log('Copy it from here: https://drive.google.com/file/d/1yfQ3jWm0_ZIPM4Ps9oRhuAZGOA79MNgh/view?usp=sharing');

		console.error('ERROR:', err);
	}
}

async function listFolders(err, files, next, apires) {
	if (err) {
		throw new Error(err);
	}

	const folders = apires.prefixes;

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'backup',
				message: 'Which backup do you want to copy?',
				choices: [...folders]
			}
		])
		.then(answers => {
			copySeed(answers['backup']);
		})
		.catch(error => {
			if (error.isTtyError) {
				// Prompt couldn't be rendered in the current environment
			} else {
				// Something else went wrong
			}
		});
	if (!!next) {
		bucket.getFiles(next, cb);
	}

	return folders;
}

const copySeed = function (remoteFolder) {
	const localFolder = `${process.cwd()}/seed-data/firestore_export/`;
	mkdirp.sync(localFolder);

	exec(`gsutil rsync -r gs://ten10-firestore-export/${remoteFolder} ${localFolder}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});

	const firebaseExport = {
		"version": "8.5.0",
		"firestore": {
			"version": "1.11.4",
			"path": "firestore_export",
			"metadata_file": `firestore_export/${remoteFolder.split('/')[0]}.overall_export_metadata`
		}
	};

	fs.writeFileSync(`${process.cwd()}/seed-data/firebase-export-metadata.json`, JSON.stringify(firebaseExport));
}