# elric-changed-files

A module used internally by elric to check which files have changed since you last committed in git or hg.

## Install

```sh
$ npm install --save elric-changed-files
```

## API

### `getChangedFilesForRoots(roots: <Array<string>>, options: ?object): Promise<?object>`

Get the list of files and repos that have changed since the last commit.

#### Parameters

roots: Array of string paths gathered from [elric roots](https://elricjs.io/docs/configuration#roots-arraystring).

options: Object literal with keys

- lastCommit: boolean
- withAncestor: boolean

### findRepos(roots: <Array<string>>): Promise<?object>

Get a set of git and hg repositories.

#### Parameters

roots: Array of string paths gathered from [elric roots](https://elricjs.io/docs/configuration#roots-arraystring).

## Usage

```javascript
import {getChangedFilesForRoots} from 'elric-changed-files';

getChangedFilesForRoots(['/path/to/test'], {
  lastCommit: true,
  withAncestor: true,
}).then(files => {
  /*
  {
    repos: [],
    changedFiles: []
  }
  */
});
```

```javascript
import {findRepos} from 'elric-changed-files';

findRepos(['/path/to/test']).then(repos => {
  /*
  {
    git: Set<Path>,
    hg: Set<Path>
  }
  */
});
```
