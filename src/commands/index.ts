import { ApplicationCommandInputType, 
    ApplicationCommandOptionType, 
    ApplicationCommandType, 
    Command 
} from "enmity/api/commands";
import { Toasts } from "enmity/metro/common";
import { sendReply } from "enmity/api/clyde";
import { getByProps, filters, bulk } from 'enmity/metro';
import { SettingsStore } from 'enmity/api/settings';
import { getIDByName } from 'enmity/api/assets'

interface SettingsProps {
    settings: SettingsStore;
}

let settings: SettingsProps["settings"];

const [Clipboard] = bulk(filters.byProps('setString'));

const MessageStore = getByProps("getMessage", "getMessages")

const embedGrabber: Command = {
	id: "get-embed",

	name: "embed",
	displayName: "embed",

	description: "Get the JSON of an embed",
	displayDescription: "Get the JSON of an embed",

	type: ApplicationCommandType.Chat,
	inputType: ApplicationCommandInputType.BuiltInText,

	options: [{
		name: "url",
		displayName: "messageURL",

		description: "URL/Link of the embed message",
		displayDescription: "URL/Link of the embed message",

		type: ApplicationCommandOptionType.String,
		required: true
	}/*,{
		name: "text",
		displayName: "isText",

		description: "Use text instead of JSON",
		displayDescription: "Use text instead of JSON",

		type: ApplicationCommandOptionType.Boolean,
		required: false,
	} UNWORKING FOR NOW*/],

	execute: async function (args, message) {
        let url = args.find(x => x.name == "url")?.value
        let isText = /*args.find(x => x.name == "text")?.value UNWORKING FOR NOW*/ true;
        let split = url?.split("/")
        split?.splice(0, 4)
        let om = MessageStore.getMessage(
            split?.[1],
            split?.[2]
        )
        if(!om || !om.embeds[0]) {
            console.log(`[CopyEmbeds]: Original Message not found/not embed`)
            return sendReply(message?.channel.id ?? "0", {
                message: "This is not an embedded message",
                content: "This is not an embedded message"
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
        Toasts.open({ 
            content: "Copied embed(s) to clipboard", 
            source: getIDByName("Check")
        })
        // For now the embeds will always come in text format.
        // if(isText) {
            sendReply(message?.channel.id ?? "0", asText)
        // } else {
        //     if(settings.getBoolean("isPlainText")) {
        //         sendReply(message?.channel.id ?? "0", asText)
        //     } else {
        //         sendReply(message?.channel.id ?? "0", JSON.stringify(om.embeds, null, 4))
        //     }
        // }
	}
}

export default embedGrabber;