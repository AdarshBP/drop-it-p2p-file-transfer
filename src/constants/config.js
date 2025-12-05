// Heartbeat configuration
export const HEARTBEAT_INTERVAL_MS = 10000; // 10 seconds
export const HEARTBEAT_TIMEOUT_MS = 10000; // 10 seconds
export const HEARTBEAT_FAILURE_THRESHOLD = 2;
// Contact page profile and links
export const CONTACT_PROFILE = {
  name: 'Adarsh',
  title: 'Developer of DropShare',
  subtitle: 'Full Stack Developer',
  photo: 'https://github.com/AdarshBP.png',
  photoAlt: 'Adarsh profile photo',
};

export const CONTACT_LINKS = [
  {
    icon: '📧',
    label: 'Email',
    value: 'bpadarsh8@gmail.com',
    href: 'mailto:bpadarsh8@gmail.com',
  },
  {
    icon: '🌐',
    label: 'Portfolio',
    value: 'adarshbp.vercel.app',
    href: 'https://adarshbp.vercel.app',
  },
];

export const CONTACT_GITHUB = {
  href: 'https://github.com/AdarshBP/drop-it-p2p-file-transfer',
  label: 'Found a bug? Open an issue on GitHub',
  icon: '💡',
};


// List of easy-to-remember, max 6-char names for peer IDs
export const RANDOM_PEER_NAMES = [
  'pixelz', 'orbitz', 'blippr', 'snappy', 'fuzion', 'vividy',
  'jiffy', 'twixy', 'buzzy', 'glowy', 'zappy', 'minty',
  'peachy', 'jazzy', 'flicks', 'dizzy', 'nifty', 'poppy',
  'swoosh', 'qubit', 'wifty', 'tango', 'bongo', 'pluto',
  'mango', 'candy', 'fable', 'gizmo', 'honey', 'jolly',
  'lucky', 'mirth', 'nifty', 'panda', 'quirk', 'rally',
  'sassy', 'tidal', 'unity', 'vapor', 'witty', 'yodel',
  'alpha', 'bravo', 'charm', 'delta', 'ember', 'frost',
  'gleam', 'hazel', 'ivory', 'jewel', 'karma', 'lumen',
  'mirth', 'nova', 'onyx', 'pearl', 'quark', 'raven',
  'sonic', 'terra', 'ultra', 'vivid', 'whale', 'xenon',
  'yacht', 'zebra', 'amber', 'basil', 'coral', 'daisy',
  'eagle', 'flint', 'grove', 'honey', 'indie', 'jolly',
  'koala', 'lotus', 'mango', 'noble', 'olive', 'piper',
  'quest', 'rider', 'sable', 'tulip', 'umbra', 'vapor',
  'waltz', 'xylon', 'yodel', 'zesty', 'blaze', 'comet',
  'drift', 'ember', 'fable', 'glint', 'haven', 'islet',
  'jiffy', 'kudos', 'latch', 'mirth', 'nifty', 'orbit',
  'punch', 'qubit', 'rally', 'swoop', 'trick', 'unity',
  'vivid', 'witty', 'yodel', 'zippy'
];

// Default ICE servers for PeerJS
export const DEFAULT_ICE_CONFIG = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  }
};