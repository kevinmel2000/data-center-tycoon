var prefixes = [
  'Cloud',
  'App',
  'Stream',
  'Giga',
  'Neo',
  'My',
  'Your',
  'Net',
  'Go',
  'Buzz',
  'Node',
  'Bridge',
  'Red',
  'Blue',
  'Green',
  'Micro',
  'Socket',
  'Feed'
]

var suffixes = [
  'Cloud',
  'App',
  'Beam',
  'Punch',
  'Stream',
  'Node',
  'Buzz',
  'Panel',
  'Above',
  'Feed',
  'Sense',
  'Genius',
  'Host',
  'Socket'
];

var postscripts = [
  '', '', '', '', '', // Easy/stupid way to only get postscripts sometimes
  '.io',
  'ify',
  '.me',
  '.ly'
];

function rando(xs) {
  return xs[Math.floor(xs.length * Math.random())];
}

console.log(rando(prefixes) + rando(suffixes) + rando(postscripts));
