import embedGrabber from './commands';

import { FormRow } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getIDByName } from 'enmity/api/assets';
import { bulk, filters, getByProps } from 'enmity/metro'
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import { get, getBoolean } from 'enmity/api/settings';

import Settings from './components/Settings';

const Patcher = create('copy-embed')

const [
   LazyActionSheet,
   Clipboard
] = bulk(
   filters.byProps("openLazy", "hideActionSheet"),
   filters.byProps('setString')
);

const ThemeStore: Plugin = {
   ...manifest,

   onStart() {
      this.commands = [embedGrabber]
      let attempt = 0;
      let attempts = 3;
      const unpatchActionSheet = () => {
         try {
            attempt++;
            const MessageStore = getByProps("getMessage", "getMessages")


            console.log(`[CopyEmbeds] delayed start attempt ${attempt}/${attempts}.`);

            Toasts.open({
                 content: `[CopyEmbeds] start attempt ${attempt}/${attempts}.`,
                 source: getIDByName('debug'),
            })

            Patcher.before(LazyActionSheet, "openLazy", (_, [component, sheet], _res) => {
               if (sheet === "MessageLongPressActionSheet") {
                  component.then((instance) => {
                     Patcher.after(instance, "default", (_, message, res) => {
                        if (!res.props) {
                           console.log(`[CopyEmbeds Local Error: Property "Props" Does not Exist on "res"]`)
                           return res;
                        }

                        const finalLocation = res?.props?.children?.props?.children?.props?.children[1]

                        if(finalLocation[0].key=='1337') { return }
                        const originalMessage = MessageStore.getMessage(
                           message[0].message.channel_id,
                           message[0].message.id
                        ); 
                        
                        if (!originalMessage.embeds) { return console.log("[CopyEmbeds] No message embeds.") };
                                                   
                        const formElem = <FormRow
                           key={`1337`} 
                           label={`Copy Embed`}
                           leading={<FormRow.Icon source={getIDByName('img_nitro_star')} />}
                           onPress={() => {
                              let om = originalMessage
                             if(!om || !om.embeds[0]) {
                                 console.log(`[CopyEmbedss]: Original Message not found/not embed`)
                                 return Toasts.open({
                                    content: "This message does not have an embed!",
                                    source: "ic_block"
                                 })
                             }
                             let asText;
                             var x = ``
                             if(om.embeds.length > 1) {
                                 om.embeds.forEach(e => {
                                     x += `---- Embed #${om.embeds.indexOf(e)} ----\n${e.rawTitle}\n`
                                     e.rawDescription 
                                         ? x += `\n${e.rawDescription}\n\n`
                                         : x
                                     e.thumbnail 
                                         ? x += `Thumbnail: ${e.thumbnail.url}\n` 
                                         : x
                                     e.image 
                                         ? x += `Image: ${e.image.url}\n`
                                         : x
                                     e.fields.length > 0
                                     ? e.fields.forEach(f => {
                                         x += `\n${f.rawName}: ${f.rawValue}\n`
                                     })
                                     : x
                                     e.footer 
                                     ? e.footer.icon_url 
                                         ? x += `\nFooter: ${e.footer.text}\nIcon URL: ${e.footer.icon_url}`
                                         : x += `\nFooter: ${e.footer.text}\n`
                                     : x
                                     return asText = x
                                 })
                             } else {
                                 om.embeds.forEach(e => {
                                     x += `${e.rawTitle}\n`
                                     e.rawDescription 
                                         ? x += `\n${e.rawDescription}\n\n`
                                         : x
                                     e.thumbnail 
                                         ? x += `Thumbnail: ${e.thumbnail.url}\n` 
                                         : x
                                     e.image 
                                         ? x += `Image: ${e.image.url}\n`
                                         : x
                                     e.fields.length > 0
                                     ? e.fields.forEach(f => {
                                         x += `\n${f.rawName}: ${f.rawValue}\n`
                                     })
                                     : x
                                     e.footer 
                                     ? e.footer.icon_url 
                                         ? x += `\nFooter: ${e.footer.text}\nIcon URL: ${e.footer.icon_url}`
                                         : x += `\nFooter: ${e.footer.text}\n`
                                     : x
                                     return asText = x
                                 })
                             }
                             Clipboard.setString(asText)
                             LazyActionSheet.hideActionSheet()
                             Toasts.open({ 
                                 content: "Copied embed(s) to clipboard", 
                                 source: getIDByName("Check")
                             })
                           }} 
                        />
                        finalLocation.unshift(formElem)
                     })
                  });
               }
            })
         // - Credits -
         // ALL OF THIS LOGIC WAS CODED BY acquite
         // Thanks acquite :)
         // - Credits - 
         } catch(err) {
            console.log(`[CopyEmbeds Local Error ${err}]`);
            
            if (attempt < attempts) {
               console.warn(
                  `[CopyEmbeds] failed to start. Trying again in ${attempt}0s.`
               );
               Toasts.open({
                  content: `[CopyEmbeds] failed to start trying again in ${attempt}0s.`,
                  source: getIDByName('ic_message_retry'),
               })

               setTimeout(unpatchActionSheet, attempt * 10000); 
            } else {
               console.error(`[CopyEmbeds] failed to start. Giving up.`);
               Toasts.open({
                  content: `[CopyEmbeds] failed to start. Giving up.`,
                  source: getIDByName('Small'),
               })
            }
         }
      }
      unpatchActionSheet()
   },

   onStop() {
      // - Credits -
      // ALL OF THIS LOGIC WAS CODED BY acquite
      // Thanks acquite :)
      // - Credits - 
      this.commands = []
      this.patches = []
      Patcher.unpatchAll()
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(ThemeStore);
