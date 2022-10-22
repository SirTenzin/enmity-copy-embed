// - Credits -
// ALL OF THIS LOGIC WAS CODED BY acquite
// Thanks acquite :)
// - Credits - 
import { FormRow, ScrollView } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { getIDByName } from 'enmity/api/assets';
import { React, Toasts, Constants, StyleSheet, Navigation } from 'enmity/metro/common';
import {name, version, release, plugin} from '../../manifest.json'
import { bulk, filters} from 'enmity/metro';
import Credits from './Credits'

interface SettingsProps {
   settings: SettingsStore;
}

const [
    Router, 
    Clipboard
] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString')
);

export default ({ settings }: SettingsProps) => {
    const toastTrail = getIDByName('ic_selection_checked_24px');

    const styles = StyleSheet.createThemedStyleSheet({
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        item: {
            color: Constants.ThemeColorMap.TEXT_MUTED
        }
    }); 

    const [touchX, setTouchX] = React.useState() 
    const [touchY, setTouchY] = React.useState() 

    return <>
        <ScrollView
            onTouchStart={e=> {
                    setTouchX(e.nativeEvent.pageX)
                    setTouchY(e.nativeEvent.pageY)
                }
            }
            onTouchEnd={e => {
                
                if (
                    touchX - e.nativeEvent.pageX < -100
                    && touchY - e.nativeEvent.pageY < 40
                    && touchY - e.nativeEvent.pageY > -40
                ) {
                    Navigation.pop() 
                }
            }}
        >
            <Credits /* main credits gui, created from scratch exclusively for dislate (thanks acquite - tenzin) *//>
            
            <FormRow label={`Plugin Version: ${version}
Release Channel: ${release}`} />
        </ScrollView>
   </>
};