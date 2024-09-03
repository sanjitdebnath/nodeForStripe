import concurrently from 'concurrently';

concurrently([
  { command: 'npm run server', name: 'server', prefixColor: 'blue' },
  { command: 'npm run client', name: 'client', prefixColor: 'green' }
], {
  killOthers: ['failure', 'success'],
  restartTries: 3,
}).then(success, failure);

function success() {
  console.log('Both applications are running successfully.');
}

function failure() {
  console.log('One of the applications failed to start.');
}
