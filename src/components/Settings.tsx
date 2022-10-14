import { FormRow, FormSwitch } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { React } from 'enmity/metro/common';

interface SettingsProps {
   settings: SettingsStore;
}

export default ({ settings }: SettingsProps) => {
   return <FormRow
      label='Copy as plain text (redundant ignore this)'
      trailing={
         <FormSwitch
            value={settings.get('isPlainText', true)}
            onValueChange={() => settings.toggle('isPlainText', true)}
         />
      }
   />;
};