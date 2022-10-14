import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React, Toasts, Constants } from 'enmity/metro/common';
import manifest from '../manifest.json';
import embedGrabber from './commands';

import Settings from './components/Settings';

const ThemeStore: Plugin = {
   ...manifest,

   onStart() {
      this.commands = [embedGrabber]
   },

   onStop() {
      this.commands = []
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(ThemeStore);
