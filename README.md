# 10/10 firestore importer

Import backed-up data into firestore projects to use as seed data in firestore emulators.

## Config

In order to authenticate, you'll need a `serviceAccount.json` file in the root of the project.

Copy it from here:
https://drive.google.com/file/d/1yfQ3jWm0_ZIPM4Ps9oRhuAZGOA79MNgh/view?usp=sharing

## Usage

Install the package and add the following to `scripts` in `package.json`:

`"seed": "./node_modules/.bin/ten10-firestore-importer"`

When you execute `npm run seed` you'll be prompted to select a backup that you want to copy. When selected the script will copy the backup data into the `seed-data`.

From here you can start the firestore emulators with the downloaded seed data by executing:

`firebase emulators:start --import seed-data`

## Troubleshooting

---

**Issue** When trying to run emulators, I'm getting the following messages and the emulators doesn't start:

```
⚠  firestore: Port 4001 is not open on localhost, could not start Firestore Emulator.
```

**Answer** I run into this issue sometimes on my Mac. For some reason the old processes lingers. Kill them with `lsof -ti tcp:4001 | xargs kill`

---
